import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";
import { logAudit } from "@/lib/audit";

function isObjectId(value: string): boolean {
    return /^[a-f\d]{24}$/i.test(value);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const group = isObjectId(slug)
            ? await FacebookGroup.findById(slug).lean()
            : await FacebookGroup.findOne({ groupId: slug }).lean();

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: group });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        // Get old data for audit
        const oldGroup = isObjectId(slug)
            ? await FacebookGroup.findById(slug).lean()
            : await FacebookGroup.findOne({ groupId: slug }).lean();

        const group = isObjectId(slug)
            ? await FacebookGroup.findByIdAndUpdate(slug, { $set: body }, { new: true })
            : await FacebookGroup.findOneAndUpdate({ groupId: slug }, { $set: body }, { new: true });

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "facebookgroups",
            documentId: isObjectId(slug) ? slug : group._id.toString(),
            action: "update",
            before: oldGroup,
            after: group.toObject(),
            description: `Cập nhật nhóm Facebook: ${group.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: group });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();
        const { name, url, order, isActive } = body;

        // Get old data for audit
        const oldGroup = isObjectId(slug)
            ? await FacebookGroup.findById(slug).lean()
            : await FacebookGroup.findOne({ groupId: slug }).lean();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (url !== undefined) updateData.url = url;
        if (order !== undefined) updateData.order = order;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedGroup = isObjectId(slug)
            ? await FacebookGroup.findByIdAndUpdate(slug, updateData, { new: true })
            : await FacebookGroup.findOneAndUpdate({ groupId: slug }, updateData, { new: true });

        if (!updatedGroup) {
            return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "facebookgroups",
            documentId: isObjectId(slug) ? slug : updatedGroup._id.toString(),
            action: "update",
            before: oldGroup,
            after: updatedGroup.toObject(),
            description: `Cập nhật nhóm Facebook: ${updatedGroup.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: updatedGroup });
    } catch (error: any) {
        console.error('Error updating Facebook group:', error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update Facebook group" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        // Get group for audit before delete
        const oldGroup = isObjectId(slug)
            ? await FacebookGroup.findById(slug).lean()
            : await FacebookGroup.findOne({ groupId: slug }).lean();

        const group = isObjectId(slug)
            ? await FacebookGroup.findByIdAndDelete(slug)
            : await FacebookGroup.findOneAndDelete({ groupId: slug });

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "facebookgroups",
            documentId: isObjectId(slug) ? slug : group._id.toString(),
            action: "delete",
            before: oldGroup,
            description: `Xóa nhóm Facebook: ${group.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa nhóm" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
