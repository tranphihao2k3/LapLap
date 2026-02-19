import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

// GET single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

// UPDATE order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: body.status },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        );
    }
}
