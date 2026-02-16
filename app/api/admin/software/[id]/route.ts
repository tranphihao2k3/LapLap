import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Software } from "@/models/Software";

// GET single software by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const software = await Software.findById(id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Prevent slug update to avoid breaking links (optional, but safer)
        // If you want to allow slug updates, make sure to handle uniqueness check
        if (body.slug) {
            const existing = await Software.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json(
                    { success: false, error: "Slug already exists" },
                    { status: 400 }
                );
            }
        }

        const updatedSoftware = await Software.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedSoftware) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedSoftware = await Software.findByIdAndDelete(id);

        if (!deletedSoftware) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

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
