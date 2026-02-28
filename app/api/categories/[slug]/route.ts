import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const category = await Category.findOne({ slug }).lean();
        if (!category) {
            return NextResponse.json({ success: false, error: "Không tìm thấy danh mục" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: category });
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

        const category = await Category.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!category) {
            return NextResponse.json({ success: false, error: "Không tìm thấy danh mục" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: category });
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

        const category = await Category.findOneAndDelete({ slug });
        if (!category) {
            return NextResponse.json({ success: false, error: "Không tìm thấy danh mục" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa danh mục" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
