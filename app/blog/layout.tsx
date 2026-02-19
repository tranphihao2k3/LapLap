import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog Laptop Cần Thơ - Kinh Nghiệm & Thủ Thuật',
    description: 'Chia sẻ kinh nghiệm mua laptop cũ, thủ thuật sử dụng máy tính, tin tức công nghệ mới nhất. Hướng dẫn sửa lỗi vặt laptop tại nhà.',
    keywords: ['blog laptop', 'tin tức laptop cần thơ', 'kinh nghiệm mua laptop cũ', 'thủ thuật laptop', 'review laptop cần thơ', 'sữa laptop cần thơ', 'laplap blog'],
    openGraph: {
        title: 'Blog Laptop Cần Thơ - Chia Sẻ Kiến Thức Công Nghệ',
        description: 'Nơi chia sẻ kiến thức, kinh nghiệm về laptop và công nghệ tại Cần Thơ.',
        type: 'website',
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
