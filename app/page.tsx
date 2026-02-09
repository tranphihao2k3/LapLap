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
            {/* Hero Section */}
            <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/banner.jpg"
                alt="Laptop Cần Thơ - LapLap Store"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                <div className="container mx-auto px-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Laptop Cần Thơ Chính Hãng
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-6">
                    Laptop mới, laptop cũ giá tốt nhất tại Cần Thơ
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/laptops"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Xem Laptop
                    </Link>
                    <Link
                      href="/test"
                      className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Test Laptop Miễn Phí
                    </Link>
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