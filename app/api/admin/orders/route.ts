import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET() {
    try {
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
