import "./globals.css";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FacebookMessenger from "@/components/FacebookMessenger";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://laplapcantho.store"),
  title: {
    default: "LapLap - Laptop Cần Thơ | Laptop Cũ & Mới Chính Hãng Giá Tốt",
    template: "%s | LapLap Cần Thơ"
  },
  description: "LapLap Cần Thơ - Mua bán laptop cũ mới giá tốt uy tín. Sửa chữa (sữa laptop), vệ sinh laptop lấy liền. Bảo hành dài hạn, hậu mãi tận tâm.",
  keywords: [
    "laptop cần thơ",
    "laptop cũ cần thơ",
    "mua laptop cần thơ",
    "sữa laptop cần thơ",
    "sửa laptop cần thơ",
    "laplap cần thơ",
    "laplap",
    "laptop giá rẻ cần thơ",
    "thu mua laptop cũ cần thơ",
    "cài win cần thơ"
  ],
  authors: [{ name: "LapLap Cần Thơ" }],
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LapLap - Laptop Cần Thơ",
    title: "LapLap - Laptop Cần Thơ | Laptop Cũ & Mới Chính Hãng",
    description: "Chuyên mua bán laptop cũ, mới tại Cần Thơ. Sửa chữa (sữa laptop) uy tín, giá tốt. Giao hàng tận nơi.",
  },
};

import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

import { ComparisonProvider } from "@/context/ComparisonContext";
import ComparisonBar from "@/components/ComparisonBar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <ComparisonProvider>
            {children}
            <ComparisonBar />
          </ComparisonProvider>
          <CartDrawer />
        </CartProvider>
        <FacebookMessenger />
        <SpeedInsights />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L4692QM7NF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-L4692QM7NF');
          `}
        </Script>
      </body>
    </html>
  );
}
