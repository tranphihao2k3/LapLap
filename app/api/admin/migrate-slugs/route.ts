import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import slugify from "slugify";

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({ slug: { $exists: false } });

        // Also fetch products that might have empty slugs
        const emptySlugProducts = await Product.find({ slug: "" });
        const allProducts = [...products, ...emptySlugProducts];

        let count = 0;
        const errors = [];

        for (const product of allProducts) {
            try {
                let baseSlug = slugify(product.name, { lower: true, strict: true, locale: 'vi' });
                let slug = baseSlug;
                let counter = 1;

                // Check for duplicates
                while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }

                product.slug = slug;
                await product.save();
                count++;
            } catch (err: any) {
                errors.push({ id: product._id, name: product.name, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migrated ${count} products.`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
