import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Brand } from "@/models/Brand";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const brand = await Brand.findOne({ slug }).lean();
        if (!brand) {
            return NextResponse.json({ success: false, error: "Không tìm thấy thương hiệu" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: brand });
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

        const brand = await Brand.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!brand) {
            return NextResponse.json({ success: false, error: "Không tìm thấy thương hiệu" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: brand });
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

        const brand = await Brand.findOneAndDelete({ slug });
        if (!brand) {
            return NextResponse.json({ success: false, error: "Không tìm thấy thương hiệu" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa thương hiệu" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
