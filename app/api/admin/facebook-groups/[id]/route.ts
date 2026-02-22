import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const resolvedParams = await context.params;
        const { name, url, order, isActive } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (url !== undefined) updateData.url = url;
        if (order !== undefined) updateData.order = order;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedGroup = await FacebookGroup.findByIdAndUpdate(
            resolvedParams.id,
            updateData,
            { new: true }
        );

        if (!updatedGroup) {
            return NextResponse.json(
                { success: false, error: "Group not found" },
                { status: 404 }
            );
        }

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
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const resolvedParams = await context.params;
        const deletedGroup = await FacebookGroup.findByIdAndDelete(resolvedParams.id);

        if (!deletedGroup) {
            return NextResponse.json(
                { success: false, error: "Group not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Group deleted successfully" });
    } catch (error: any) {
        console.error('Error deleting Facebook group:', error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to delete Facebook group" },
            { status: 500 }
        );
    }
}
