import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tuyển Dụng - Gia Nhập Đội Ngũ LapLap Cần Thơ',
    description: 'LapLap Cần Thơ tuyển dụng kỹ thuật viên laptop, nhân viên kinh doanh, hỗ trợ khách hàng. Môi trường làm việc chuyên nghiệp, thu nhập hấp dẫn.',
    keywords: [
        'tuyển dụng cần thơ',
        'việc làm kỹ thuật viên laptop',
        'tuyển nhân viên máy tính',
        'việc làm cần thơ',
        'laplap tuyển dụng',
    ],
    openGraph: {
        title: 'Tuyển Dụng | LapLap Cần Thơ',
        description: 'Cơ hội việc làm tại LapLap Cần Thơ - Môi trường chuyên nghiệp, thu nhập hấp dẫn.',
        type: 'website',
        url: 'https://laplapcantho.store/tuyen-dung',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/tuyen-dung',
    },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
