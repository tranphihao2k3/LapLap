import { Metadata } from 'next';
import LaptopsClient from './LaptopsClient';
import { connectDB } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const params = await searchParams;
    const categorySlug = params.category as string;
    const brandSlug = params.brand as string;
    const searchQuery = params.search as string;

    let title = "Laptop Cần Thơ | Danh Sách Laptop Cũ & Mới Giá Tốt | LapLap";
    let description = "Kho laptop cũ Cần Thơ lớn nhất. Dell, HP, ThinkPad, MacBook chính hãng. Trả góp 0%, bảo hành uy tín.";

    try {
        await connectDB();

        if (categorySlug) {
            const categoryObj = await Category.findOne({
                $or: [
                    { slug: categorySlug },
                    ...(categorySlug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: categorySlug }] : [])
                ]
            }).lean();

            if (categoryObj) {
                title = `${categoryObj.name} Cần Thơ | Giá Tốt Nhất | LapLap Store`;
                description = `Mua ${categoryObj.name} uy tín tại Cần Thơ. Đa dạng mẫu mã, tình trạng như mới, trả góp 0%, bảo hành 12 tháng. Đặt mua ngay!`;
            }
        } else if (brandSlug) {
            const brandObj = await Brand.findOne({
                $or: [
                    { slug: brandSlug },
                    ...(brandSlug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: brandSlug }] : [])
                ]
            }).lean();

            if (brandObj) {
                title = `Laptop ${brandObj.name} Cần Thơ | Chính Hãng, Giá Rẻ | LapLap Store`;
                description = `Chuyên dòng máy ${brandObj.name} tại Cần Thơ. Cam kết nguyên bản, giá tốt nhất thị trường, hỗ trợ kỹ thuật trọn đời.`;
            }
        } else if (searchQuery) {
            title = `Kết quả tìm kiếm cho "${searchQuery}" | LapLap Cần Thơ`;
            description = `Tìm thấy các mẫu laptop phù hợp với từ khóa "${searchQuery}" tại LapLap Cần Thơ. Giá tốt, hỗ trợ tận tâm.`;
        }
    } catch (error) {
        console.error("Metadata error:", error);
    }

    const canonicalUrl = `https://laplapcantho.store/laptops${categorySlug ? `?category=${categorySlug}` : brandSlug ? `?brand=${brandSlug}` : ''}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
        }
    };
}


export default function LaptopsPage() {
    return <LaptopsClient />;
}