import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vệ Sinh Laptop Cần Thơ - Keo Tản Nhiệt Xịn, Lấy Ngay | LapLap',
  description: 'Dịch vụ vệ sinh laptop chuyên nghiệp tại Cần Thơ. Sử dụng keo tản nhiệt MX4/MX6 chính hãng. Quy trình chuẩn, lấy ngay trong 30 phút.',
  keywords: ['vệ sinh laptop cần thơ', 'tra keo tản nhiệt', 'bảo dưỡng laptop', 'vệ sinh macbook', 'laplap cleaning', 'MX4', 'MX6'],
  openGraph: {
    title: 'Vệ Sinh Laptop Cần Thơ - Keo Tản Nhiệt Xịn, Lấy Ngay | LapLap',
    description: 'Dịch vụ vệ sinh laptop chuyên nghiệp tại Cần Thơ. Sử dụng keo tản nhiệt MX4/MX6 chính hãng.',
    type: 'website',
  }
};

export default function VeSinhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50">
      <div className="">
        {children}
      </div>
    </div>
  );
}
