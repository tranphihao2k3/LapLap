import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { logAudit } from "@/lib/audit";

// GET single banner
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const banner = await Banner.findById(id);
        
        if (!banner) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy banner" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: banner
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update banner
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldBanner = await Banner.findById(id).lean();
        
        const banner = await Banner.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );
        
        if (!banner) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy banner" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "banners",
            documentId: id,
            action: "update",
            before: oldBanner,
            after: banner.toObject(),
            description: `Cập nhật banner: ${banner.title || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật banner thành công",
            data: banner
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE banner
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get banner for audit before delete
        const banner = await Banner.findById(id).lean();
        
        if (!banner) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy banner" },
                { status: 404 }
            );
        }
        
        await Banner.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "banners",
            documentId: id,
            action: "delete",
            before: banner,
            description: `Xóa banner: ${banner.title || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa banner thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
