import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FAQ } from "@/models/FAQ";

// GET FAQs with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const isActive = searchParams.get("isActive");
        
        const query: any = {};
        if (category) query.category = category;
        if (isActive !== null && isActive !== '') query.isActive = isActive === 'true';
        
        const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: faqs,
            count: faqs.length
        });
    } catch (error: any) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create FAQ
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { question, answer, category, order, isActive } = body;
        
        if (!question || !answer) {
            return NextResponse.json(
                { success: false, error: "Thiếu câu hỏi hoặc câu trả lời" },
                { status: 400 }
            );
        }
        
        const faq = await FAQ.create({
            question,
            answer,
            category: category || 'general',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        
        return NextResponse.json({
            success: true,
            message: "Thêm FAQ thành công",
            data: faq
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating FAQ:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
