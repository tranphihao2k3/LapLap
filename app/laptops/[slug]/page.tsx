import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import ProductDetailClient from './ProductDetailClient';
import mongoose from 'mongoose';
import { cache } from 'react';
import JsonLd from '@/components/JsonLd';
import { buildProductJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';

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
            (product as any)._id = product._id.toString();
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
            (serialized as any)._id = p._id.toString();
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

    const formattedPrice = product.price.toLocaleString('vi-VN');
    const title = `${product.name} | Giá ${formattedPrice} VNĐ | LapLap Cần Thơ`;
    const description = `Mua Laptop ${product.name} giá rẻ tại Cần Thơ chỉ ${formattedPrice}đ. CPU ${product.specs?.cpu || ''}, RAM ${product.specs?.ram || ''}, SSD ${product.specs?.ssd || ''}. Bảo hành uy tín, hỗ trợ trả góp 0%. Đặt mua ngay!`;


    let imageUrl = product.image || (product.images && product.images[0]) || '/placeholder-laptop.png';
    // Ensure absolute URL for Open Graph
    if (imageUrl.startsWith('/')) {
        imageUrl = `https://laplapcantho.store${imageUrl}`;
    }

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

    // Build JSON-LD data
    const categoryName = product.categoryId && typeof product.categoryId === 'object' && 'name' in product.categoryId
        ? (product.categoryId as any).name
        : 'Laptop';

    const productJsonLd = buildProductJsonLd({
        name: (product as any).name,
        description: `Laptop ${(product as any).name} tại LapLap Cần Thơ`,
        price: (product as any).price,
        originalPrice: (product as any).originalPrice,
        image: (product as any).image,
        images: (product as any).images,
        slug: (product as any).slug || slug,
        _id: (product as any)._id.toString(),
        specs: (product as any).specs,
        brandId: (product as any).brandId,
        condition: (product as any).condition,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Laptop', url: '/laptops' },
        { name: (product as any).name, url: `/laptops/${(product as any).slug || slug}` },
    ]);

    return (
        <>
            <JsonLd id="product-jsonld" data={productJsonLd} />
            <JsonLd id="breadcrumb-product-jsonld" data={breadcrumbJsonLd} />
            {/* Cast to any to avoid strict type checking issues with Mongoose lean objects vs Interfaces */}
            <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
        </>
    );
}
