import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Get distinct values and all categories/brands in parallel
        const [cpus, rams, ssds, gpus, screens, hzs, resolutions, categories, brands] = await Promise.all([
            Product.distinct('specs.cpu', { 'specs.cpu': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.ram', { 'specs.ram': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.ssd', { 'specs.ssd': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.gpu', { 'specs.gpu': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.screen', { 'specs.screen': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.hz', { 'specs.hz': { $type: 'string', $ne: '' } }),
            Product.distinct('specs.resolution', { 'specs.resolution': { $type: 'string', $ne: '' } }),
            Category.find({}).lean(),
            Brand.find({}).lean()
        ]);

        return NextResponse.json({
            success: true,
            data: {
                cpus: cpus.filter(Boolean).sort(),
                rams: rams.filter(Boolean).sort(),
                ssds: ssds.filter(Boolean).sort(),
                gpus: gpus.filter(Boolean).sort(),
                screens: screens.filter(Boolean).sort(),
                hzs: hzs.filter(Boolean).sort(),
                resolutions: resolutions.filter(Boolean).sort(),
                categories,
                brands
            }
        });
    } catch (error: any) {
        console.error('API /products/filter-options error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
