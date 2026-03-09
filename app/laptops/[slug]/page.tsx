import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { cache } from 'react';
import JsonLd from '@/components/JsonLd';
import { buildProductJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { getProduct as apiGetProduct, getProducts } from '@/lib/api/products';

// Helper to fetch product data from API (cached)
const getProduct = cache(async (slug: string) => {
    try {
        const res = await apiGetProduct(slug);
        if (res.success && res.data) {
            return res.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
});

// Helper to fetch related products
async function getRelatedProducts(categoryId: string, currentId: string) {
    try {
        // fetch products in same category via API and filter out current
        const res = await getProducts({
            categorySlug: categoryId, // categoryId now contains the slug
            page: 1,
            limit: 8,
        });
        if (res.success && res.data) {
            return res.data
                .filter(p => p._id !== currentId)
                .slice(0, 4);
        }
        return [];
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

    const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : (product.basePrice || product.price || 0);
    const formattedPrice = currentPrice.toLocaleString('vi-VN');
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
    if (product.category && typeof product.category === 'object' && 'slug' in product.category) {
        relatedProducts = await getRelatedProducts((product.category as any).slug, product._id.toString());
    }

    // Build JSON-LD data
    const categoryName = product.categoryId && typeof product.categoryId === 'object' && 'name' in product.categoryId
        ? (product.categoryId as any).name
        : 'Laptop';

    const productJsonLd = buildProductJsonLd({
        name: (product as any).name,
        description: `Laptop ${(product as any).name} tại LapLap Cần Thơ`,
        price: (product as any).price,
        basePrice: (product as any).basePrice,
        salePrice: (product as any).salePrice,
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

    // Build FAQ Schema for GEO
    const faqJsonLd = buildFaqJsonLd([
        {
            question: `Laptop ${product.name} có tốt không?`,
            answer: `${product.name} là dòng laptop ${categoryName} chất lượng cao. Với cấu hình CPU ${product.specs?.cpu}, RAM ${product.specs?.ram}, sản phẩm đáp ứng tốt các nhu cầu từ công việc văn phòng đến giải trí chuyên nghiệp.`
        },
        {
            question: `Thông số kỹ thuật chi tiết của ${product.name}?`,
            answer: `Máy trang bị chip ${product.specs?.cpu}, bộ nhớ RAM ${product.specs?.ram}, ổ cứng ${product.specs?.ssd} và màn hình ${product.specs?.screen}. Đây là cấu hình tối ưu trong tầm giá.`
        },
        {
            question: `Mua laptop ${product.name} ở đâu uy tín tại Cần Thơ?`,
            answer: `Bạn có thể mua trực tiếp tại LapLap - Laptop Cần Thơ. Chúng tôi cam kết máy chính hãng, bảo hành ${product.warrantyMonths || 12} tháng và hỗ trợ kỹ thuật trọn đời.`
        },
        {
            question: `LapLap có hỗ trợ trả góp cho ${product.name} không?`,
            answer: `Có, LapLap hỗ trợ trả góp 0% qua thẻ tín dụng hoặc hỗ trợ hồ sơ qua công ty tài chính, duyệt nhanh chỉ trong 5 phút.`
        }
    ]);

    return (
        <>
            <JsonLd id="product-jsonld" data={productJsonLd} />
            <JsonLd id="breadcrumb-product-jsonld" data={breadcrumbJsonLd} />
            <JsonLd id="faq-product-jsonld" data={faqJsonLd} />
            {/* Cast to any to avoid strict type checking issues with Mongoose lean objects vs Interfaces */}
            <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
        </>
    );
}
