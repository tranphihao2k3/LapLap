import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import ProductDetailClient from './ProductDetailClient';
import mongoose from 'mongoose';

import { cache } from 'react';

// Helper to fetch product data - cached to deduplicate requests between generateMetadata and page
const getProduct = cache(async (slug: string) => {
    try {
        await connectDB();
        let product = await ProductModel.findOne({ slug })
            .populate("categoryId", "name slug")
            .populate("brandId", "name slug logo")
            .lean();

        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await ProductModel.findById(slug)
                .populate("categoryId", "name slug")
                .populate("brandId", "name slug logo")
                .lean();
        }

        if (product) {
            // Serialization for passing to client component
            product._id = product._id.toString();
            if (product.categoryId && typeof product.categoryId === 'object' && '_id' in product.categoryId) {
                (product.categoryId as any)._id = (product.categoryId as any)._id.toString();
            }
            if (product.brandId && typeof product.brandId === 'object' && '_id' in product.brandId) {
                (product.brandId as any)._id = (product.brandId as any)._id.toString();
            }
        }

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
});

// Helper to fetch related products
async function getRelatedProducts(categoryId: string, currentId: string) {
    try {
        await connectDB();
        const related = await ProductModel.find({
            categoryId: categoryId,
            _id: { $ne: currentId }
        })
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("categoryId", "name slug")
            .lean();

        return related.map(p => {
            const serialized = { ...p };
            serialized._id = p._id.toString();
            if (serialized.categoryId && typeof serialized.categoryId === 'object' && '_id' in serialized.categoryId) {
                (serialized.categoryId as any)._id = (serialized.categoryId as any)._id.toString();
            }
            // Remove brandId since it is not used in ProductCard and causes serialization issues if not populated or if it is a rigid object
            if ('brandId' in serialized) {
                delete (serialized as any).brandId;
            }
            return serialized;
        });
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Sản phẩm không tồn tại | LapLap Cần Thơ',
            description: 'Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'
        };
    }

    const title = `${product.name} - Giá Rẻ, Chính Hãng | LapLap Cần Thơ`;
    const description = `Mua ${product.name} chính hãng, giá tốt nhất tại LapLap Cần Thơ. Cấu hình: ${product.specs?.cpu || ''} / ${product.specs?.ram || ''} / ${product.specs?.ssd || ''}. Bảo hành uy tín, trả góp 0%.`;
    const imageUrl = product.image || (product.images && product.images[0]) || 'https://laplapcantho.store/placeholder-laptop.png';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://laplapcantho.store/laptops/${slug}`,
            siteName: 'LapLap Cần Thơ',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
            locale: 'vi_VN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return notFound();
    }

    let relatedProducts: any[] = [];
    if (product.categoryId && typeof product.categoryId === 'object' && '_id' in product.categoryId) {
        relatedProducts = await getRelatedProducts((product.categoryId as any)._id.toString(), product._id.toString());
    }

    // Cast to any to avoid strict type checking issues with Mongoose lean objects vs Interfaces
    return <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />;
}
