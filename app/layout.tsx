import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookMessenger from "@/components/FacebookMessenger";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://laplapcantho.store"),
  title: {
    default: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Chính Hãng Giá Tốt",
    template: "%s | LapLap Cần Thơ"
  },
  description: "LapLap - Chuyên laptop tại Cần Thơ. Laptop mới, laptop cũ chính hãng, giá tốt nhất. Giao hàng tận nơi, bảo hành uy tín. Test laptop miễn phí online.",
  keywords: ["laptop cần thơ", "mua laptop cần thơ", "laptop giá rẻ cần thơ", "test laptop", "laptop cũ cần thơ", "LapLap"],
  authors: [{ name: "LapLap" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LapLap - Laptop Cần Thơ",
    title: "Laptop Cần Thơ - Mua Bán Laptop Chính Hãng",
    description: "Chuyên laptop tại Cần Thơ. Giao hàng tận nơi, bảo hành uy tín.",
  },
};

import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} min-h-screen flex flex-col`}>
        {children}
        <FacebookMessenger />
        <SpeedInsights />
      </body>
    </html>
  );
}
