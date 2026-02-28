import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Software } from "@/models/Software";
import { logAudit } from "@/lib/audit";

// GET single software by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const software = await Software.findById(slug);

        if (!software) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: software,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch software" },
            { status: 500 }
        );
    }
}

// PUT update software
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        // Get old data for audit
        const oldSoftware = await Software.findById(slug).lean();

        if (body.slug) {
            const existing = await Software.findOne({ slug: body.slug, _id: { $ne: slug } });
            if (existing) {
                return NextResponse.json(
                    { success: false, error: "Slug already exists" },
                    { status: 400 }
                );
            }
        }

        const updatedSoftware = await Software.findByIdAndUpdate(
            slug,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedSoftware) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

        // Log audit
        await logAudit({
            collectionName: "software",
            documentId: slug,
            action: "update",
            before: oldSoftware,
            after: updatedSoftware.toObject(),
            description: `Cập nhật phần mềm: ${updatedSoftware.name}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            data: updatedSoftware,
        });
    } catch (error) {
        console.error("Error updating software:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update software" },
            { status: 500 }
        );
    }
}

// DELETE software
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        // Get software for audit before delete
        const oldSoftware = await Software.findById(slug).lean();

        if (!oldSoftware) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

        const deletedSoftware = await Software.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "software",
            documentId: slug,
            action: "delete",
            before: oldSoftware,
            description: `Xóa phần mềm: ${oldSoftware.name}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            message: "Software deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete software" },
            { status: 500 }
        );
    }
}
