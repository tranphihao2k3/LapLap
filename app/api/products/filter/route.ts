import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const page = parseInt(body.page) || 1;
        const limit = parseInt(body.limit) || 12;
        const skip = (page - 1) * limit;

        const query: any = {};

        // Search text matching name, model or specs
        if (body.search) {
            query.$or = [
                { name: { $regex: body.search, $options: 'i' } },
                { model: { $regex: body.search, $options: 'i' } },
                { "specs.cpu": { $regex: body.search, $options: 'i' } },
                { "specs.gpu": { $regex: body.search, $options: 'i' } },
                { "specs.ram": { $regex: body.search, $options: 'i' } },
            ];
        }

        // Standard filters
        if (body.categories && body.categories.length > 0) query.categoryId = { $in: body.categories };
        if (body.brands && body.brands.length > 0) query.brandId = { $in: body.brands };
        if (body.cpus && body.cpus.length > 0) query['specs.cpu'] = { $in: body.cpus };
        if (body.rams && body.rams.length > 0) query['specs.ram'] = { $in: body.rams };
        if (body.ssds && body.ssds.length > 0) query['specs.ssd'] = { $in: body.ssds };
        if (body.gpus && body.gpus.length > 0) query['specs.gpu'] = { $in: body.gpus };
        if (body.screens && body.screens.length > 0) query['specs.screen'] = { $in: body.screens };
        if (body.hzs && body.hzs.length > 0) query['specs.hz'] = { $in: body.hzs };
        if (body.resolutions && body.resolutions.length > 0) query['specs.resolution'] = { $in: body.resolutions };
        if (body.statuses && body.statuses.length > 0) query.status = { $in: body.statuses };

        // Price range
        if (body.priceRanges && body.priceRanges.length > 0) {
            const priceConditions = body.priceRanges.map((range: { min: number, max: number }) => ({
                price: { $gte: range.min, $lte: range.max === Infinity ? 9999999999 : range.max }
            }));
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: priceConditions }];
                delete query.$or;
            } else {
                query.$or = priceConditions;
            }
        } else if (body.priceRange && (body.priceRange.min > 0 || body.priceRange.max < 100000000)) {
            // Support for max/min object from admin
            if (!query.price) query.price = {};
            if (body.priceRange.min !== undefined) query.price.$gte = body.priceRange.min;
            if (body.priceRange.max !== undefined) query.price.$lte = body.priceRange.max;
        }

        let dbQuery = Product.find(query);

        dbQuery = dbQuery
            .populate('categoryId', 'name slug')
            .populate('brandId', 'name slug logo');

        dbQuery = dbQuery.sort({ createdAt: -1 }).skip(skip).limit(limit);

        const [products, total] = await Promise.all([
            dbQuery.lean(),
            Product.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error: any) {
        console.error('API /products/filter error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
