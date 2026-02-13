'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "./laptops/ProductCard";
import { useEffect, useState } from 'react';
import { MapPin, Truck, Shield, TestTube } from 'lucide-react';
import { motion } from "framer-motion";

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
      "url": "https://laplapcantho.store",
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <div className="space-y-12">
          {/* Hero Section - CSS Gradient Banner */}
          <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column: Text */}
                  <motion.div
                    className="max-w-3xl z-10"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                  >
                    {/* Badge */}
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                      <span className="text-white font-medium text-sm">Cần Thơ</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                      Laptop Cần Thơ
                      <br />
                      <span className="bg-gradient-to-r from-[var(--color-accent)] to-white bg-clip-text text-transparent">
                        Chính Hãng
                      </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                      Laptop mới, laptop cũ giá tốt nhất tại Cần Thơ
                      <br />
                      <span className="text-[var(--color-accent)] font-semibold">Giao hàng tận nơi • Bảo hành uy tín</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
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
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
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
                    </motion.div>
                  </motion.div>

                  {/* Right Column: 3D Image */}
                  <motion.div
                    className="hidden lg:flex justify-center items-center relative z-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="relative w-full h-[400px] animate-float">
                      {/* Placeholder for 3D Laptop */}
                      <img
                        src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                        alt="3D Laptop Illustration"
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                      {/* Decorative Elements around image */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/30 rounded-full blur-xl animate-pulse delay-700"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <motion.section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Tại Cần Thơ</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Phục vụ khách hàng tại Cần Thơ và các tỉnh lân cận nhanh chóng.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Giao Hàng Tận Nơi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Miễn phí giao hàng nội thành Cần Thơ, ship COD toàn quốc.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Bảo Hành Uy Tín</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bảo hành chính hãng, hỗ trợ kỹ thuật trọn đời máy.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl shadow-lg border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TestTube className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Test Miễn Phí</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Công cụ test laptop online miễn phí, chính xác 100%.
              </p>
            </motion.div>
          </motion.section>

          {/* Products Section */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <>
              {/* Categories */}
              {categories.map((category) => {
                const laptops = laptopsByCategory[category._id] || [];

                if (laptops.length === 0) return null;

                return (
                  <section key={category._id} className="space-y-6">
                    <motion.h2
                      className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {category.name}
                    </motion.h2>
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={stagger}
                    >
                      {laptops.slice(0, 8).map((laptop) => (
                        <motion.a
                          key={laptop._id}
                          href={`/laptops/${laptop._id}`}
                          variants={fadeInUp}
                          whileHover={{ y: -5 }}
                        >
                          <ProductCard product={laptop} />
                        </motion.a>
                      ))}
                    </motion.div>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}