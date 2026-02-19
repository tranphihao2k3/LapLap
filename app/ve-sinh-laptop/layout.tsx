import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vệ Sinh Laptop Cần Thơ | Laptop Sạch Mát Lấy Liền - LapLap',
  description: 'Dịch vụ vệ sinh laptop Cần Thơ uy tín, lấy liền. Tra keo tản nhiệt xịn MX4/MX6. Khắc phục máy nóng, kêu to. Hỗ trợ sửa chữa (sữa laptop) tại chỗ.',
  keywords: ['vệ sinh laptop cần thơ', 'vệ sinh máy tính cần thơ', 'tra keo tản nhiệt', 'bảo dưỡng laptop', 'vệ sinh macbook', 'sữa laptop cần thơ', 'MX4', 'MX6'],
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
