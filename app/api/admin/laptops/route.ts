import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Populate category and brand for better data
        const laptops = await Product.find({})
            .populate('categoryId', 'name')
            .populate('brandId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: laptops
        });
    } catch (error: any) {
        console.error('Error fetching laptops:', error);
        return NextResponse.json(
            { success: false, message: 'Lỗi khi lấy danh sách laptop: ' + error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Validation (basic)
        if (!body.name || !body.price) {
            return NextResponse.json(
                { success: false, message: 'Name and Price are required' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        let slug = body.slug;
        if (!slug && body.name) {
            slug = body.name.toLowerCase()
                .replace(/tiếng việt/g, 'tieng viet') // simple placeholder
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        }

        const newLaptop = await Product.create({
            ...body,
            slug
        });

        return NextResponse.json({
            success: true,
            message: 'Laptop created successfully',
            data: newLaptop
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating laptop:', error);
        return NextResponse.json(
            { success: false, message: 'Error creating laptop: ' + error.message },
            { status: 500 }
        );
    }
}
