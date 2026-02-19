import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nâng Cấp Laptop Cần Thơ - RAM, SSD Chính Hãng',
    description: 'Dịch vụ nâng cấp laptop tại Cần Thơ. Nâng cấp RAM, SSD chính hãng, giá tốt. Kiểm tra khả năng nâng cấp miễn phí bằng AI. Bảo hành dài hạn.',
    keywords: ['nâng cấp laptop cần thơ', 'nâng cấp ram laptop cần thơ', 'nâng cấp ssd laptop cần thơ', 'mua ram laptop cần thơ', 'mua ssd laptop cần thơ', 'sữa laptop cần thơ', 'vệ sinh laptop cần thơ', 'laplap upgrade'],
    openGraph: {
        title: 'Nâng Cấp Laptop Cần Thơ - RAM, SSD Chính Hãng | LapLap',
        description: 'Dịch vụ nâng cấp laptop uy tín tại Cần Thơ. Kiểm tra khả năng nâng cấp nhanh chóng.',
        type: 'website',
    },
};

export default function UpgradeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
