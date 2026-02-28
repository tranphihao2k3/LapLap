import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Debt } from "@/models/Debt";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const debt = await Debt.findById(slug)
            .populate("customerId", "name phone")
            .populate("supplierId", "name contactPerson")
            .populate("orderId", "orderCode totalAmount")
            .lean();

        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy công nợ" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: debt });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const debt = await Debt.findById(slug);
        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy công nợ" }, { status: 404 });
        }

        Object.assign(debt, body);
        await debt.save();

        return NextResponse.json({ success: true, data: debt });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const debt = await Debt.findByIdAndDelete(slug);
        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy công nợ" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa công nợ" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
