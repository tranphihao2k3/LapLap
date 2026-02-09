'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "./laptops/ProductCard";
import { useEffect, useState } from 'react';
import { MapPin, Truck, Shield, TestTube } from 'lucide-react';

interface LaptopSpec {
  cpu: string;
  gpu: string;
  ram: string;
  ssd: string;
  screen: string;
  battery: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  model: string;
  price: number;
  image: string;
  images: string[];
  specs: LaptopSpec;
  categoryId: Category;
  brandId: Brand;
  status: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [laptopsByCategory, setLaptopsByCategory] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Add structured data for local SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "LapLap - Laptop Cần Thơ",
      "description": "Chuyên laptop chính hãng tại Cần Thơ. Laptop mới, cũ giá tốt. Giao hàng tận nơi, bảo hành uy tín.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cần Thơ",
        "addressRegion": "Cần Thơ",
        "addressCountry": "VN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "10.0452",
        "longitude": "105.7469"
      },
      "url": "https://laplap.vercel.app",
      "priceRange": "$$",
      "areaServed": "Cần Thơ"
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const fetchData = async () => {
    try {
      const categoriesRes = await fetch('/api/admin/categories');
      const categoriesData = await categoriesRes.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data);

        const laptopsByCategory: { [key: string]: Product[] } = {};

        for (const category of categoriesData.data) {
          const laptopsRes = await fetch(`/api/admin/laptops`);
          const laptopsData = await laptopsRes.json();

          if (laptopsData.success) {
            laptopsByCategory[category._id] = laptopsData.data.filter(
              (laptop: Product) => laptop.categoryId._id === category._id && laptop.status === 'active'
            );
          }
        }

        setLaptopsByCategory(laptopsByCategory);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto p-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Section - CSS Gradient Banner */}
            <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary-dark)] animate-gradient">
                {/* Overlay Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                      <span className="text-white font-medium text-sm">Cần Thơ</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                      Laptop Cần Thơ
                      <br />
                      <span className="bg-gradient-to-r from-[var(--color-accent)] to-white bg-clip-text text-transparent">
                        Chính Hãng
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                      Laptop mới, laptop cũ giá tốt nhất tại Cần Thơ
                      <br />
                      <span className="text-[var(--color-accent)] font-semibold">Giao hàng tận nơi • Bảo hành uy tín</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/laptops"
                        className="group bg-white hover:bg-[var(--color-accent)] text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                      >
                        Xem Laptop
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                      <Link
                        href="/test"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
                      >
                        Test Laptop Miễn Phí
                      </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                      <div>
                        <div className="text-3xl font-bold text-[var(--color-accent)]">100+</div>
                        <div className="text-sm text-blue-100">Sản phẩm</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-[var(--color-accent)]">24/7</div>
                        <div className="text-sm text-blue-100">Hỗ trợ</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-[var(--color-accent)]">100%</div>
                        <div className="text-sm text-blue-100">Chính hãng</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-8 h-8 text-blue-600" />
                  <h3 className="font-bold text-lg">Tại Cần Thơ</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Phục vụ khách hàng tại Cần Thơ và các tỉnh lân cận
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-lg">Giao Hàng Tận Nơi</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Miễn phí giao hàng nội thành Cần Thơ
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <h3 className="font-bold text-lg">Bảo Hành Uy Tín</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Bảo hành chính hãng, hỗ trợ tận tâm
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <TestTube className="w-8 h-8 text-orange-600" />
                  <h3 className="font-bold text-lg">Test Miễn Phí</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Công cụ test laptop online miễn phí
                </p>
              </div>
            </section>

            {/* Categories */}
            {categories.map((category) => {
              const laptops = laptopsByCategory[category._id] || [];

              if (laptops.length === 0) return null;

              return (
                <section key={category._id} className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {laptops.slice(0, 8).map((laptop) => (
                      <a key={laptop._id} href={`/laptops/${laptop._id}`}>
                        <ProductCard product={laptop} />
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ trang admin.
                </p>
                <a
                  href="/admin"
                  className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đi đến trang Admin
                </a>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}