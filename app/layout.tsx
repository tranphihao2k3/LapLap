import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LapLap - Laptop Cần Thơ | Test & Mua Bán Laptop Uy Tín",
    template: "%s | LapLap"
  },
  description: "LapLap - Chuyên mua bán laptop tại Cần Thơ. Công cụ test laptop miễn phí online. Laptop chính hãng, giá tốt, bảo hành uy tín.",
  keywords: ["laptop cần thơ", "mua laptop", "test laptop", "laptop cũ", "laptop mới", "LapLap"],
  authors: [{ name: "LapLap" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LapLap",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
