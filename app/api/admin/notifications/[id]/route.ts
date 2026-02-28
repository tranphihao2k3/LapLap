import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import { logAudit } from "@/lib/audit";

// PUT update notification (mark as read)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldNotification = await Notification.findById(id).lean();
        
        const updateData: any = {};
        if (body.isRead !== undefined) {
            updateData.isRead = body.isRead;
            if (body.isRead) updateData.readAt = new Date();
            else updateData.readAt = null;
        }
        
        const updated = await Notification.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updated) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy thông báo" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "notifications",
            documentId: id,
            action: "update",
            before: oldNotification,
            after: updated.toObject(),
            description: `Cập nhật thông báo: ${updated.title}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật thành công",
            data: updated
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE notification
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get notification for audit before delete
        const notification = await Notification.findById(id).lean();
        
        if (!notification) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy thông báo" },
                { status: 404 }
            );
        }
        
        await Notification.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "notifications",
            documentId: id,
            action: "delete",
            before: notification,
            description: `Xóa thông báo: ${notification.title}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
