import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test Bàn Phím Laptop Online Miễn Phí — Kiểm Tra Phím Chết, N-Key | LapLap Cần Thơ',
    description: 'Công cụ test bàn phím laptop online miễn phí. Kiểm tra phím chết, phím kẹt, N-Key Rollover ngay trên trình duyệt — không cần cài phần mềm. Dịch vụ kiểm tra laptop uy tín tại Cần Thơ.',
    keywords: [
        // Primary keywords
        'test bàn phím laptop',
        'kiểm tra bàn phím laptop',
        'test phím laptop online',
        'bàn phím laptop bị liệt phím',
        'phím laptop không hoạt động',
        'keyboard tester online',
        'kiểm tra phím chết laptop',
        // Secondary keywords
        'test laptop',
        'công cụ test laptop',
        'kiểm tra laptop online',
        'test laptop cần thơ',
        'test laptop cũ cần thơ',
        'laptop cần thơ',
        'công cụ kiểm tra laptop miễn phí',
        // Long-tail
        'cách kiểm tra bàn phím laptop',
        'phần mềm test bàn phím laptop',
        'kiểm tra bàn phím laptop trước khi mua',
        'test bàn phím laptop không cần cài đặt',
        'n-key rollover là gì',
        'anti ghosting bàn phím'
    ],
    openGraph: {
        title: 'Test Bàn Phím Laptop Online — Kiểm Tra Phím Chết Ngay | LapLap Cần Thơ',
        description: 'Kiểm tra bàn phím laptop ngay trên trình duyệt: phím chết, phím kẹt, N-Key Rollover. Miễn phí, không cài đặt. Bấm thử từng phím và xem kết quả tức thì.',
        type: 'website',
        url: 'https://laplapcantho.store/test/keyboard',
        siteName: 'LapLap Cần Thơ — Laptop Chất Lượng',
        locale: 'vi_VN',
        images: [
            {
                url: 'https://laplapcantho.store/og-keyboard-test.jpg',
                width: 1200,
                height: 630,
                alt: 'Công cụ test bàn phím laptop online miễn phí - LapLap Cần Thơ',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Test Bàn Phím Laptop Online Miễn Phí | LapLap Cần Thơ',
        description: 'Kiểm tra phím chết, phím kẹt, N-Key Rollover ngay trên trình duyệt. Không cần cài phần mềm.',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/test/keyboard',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
        },
    },
};

export default function KeyboardTestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
