'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "./laptops/ProductCard";
import { useEffect, useState } from 'react';
import { MapPin, Truck, Shield, TestTube } from 'lucide-react';
import { motion, Variants } from "framer-motion";
import Button from "@/components/ui/Button";

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
  slug?: string;
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

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const stagger: Variants = {
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
          {/* Hero Section - Redesigned for better mobile support */}
          <section className="relative w-full min-h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-[#0f172a]">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1e40af] animate-gradient">
              {/* Decorative Blur Orbs */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-10"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-400 rounded-full blur-[100px] opacity-20"></div>
            </div>

            <div className="relative z-10 h-full flex items-center py-12 md:py-0">
              <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                  {/* Text Content */}
                  <motion.div
                    className="flex-1 text-center lg:text-left z-10"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                  >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-semibold text-xs uppercase tracking-widest">Cần Thơ</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                      Laptop Cần Thơ
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">
                        Chính Hãng
                      </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                      Sở hữu ngay laptop đỉnh cao với giá tốt nhất tại Cần Thơ.
                      <span className="block mt-2 text-cyan-300 font-bold drop-shadow-sm">Giao hàng tức thì • Bảo hành 24/7 chuyên nghiệp</span>
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                      <Button
                        href="/laptops"
                        variant="white"
                        size="xl"
                        rightIcon="→"
                        fullWidth
                        className="sm:w-auto"
                      >
                        MUA NGAY
                      </Button>
                      <Button
                        href="/test"
                        variant="glass"
                        size="xl"
                        fullWidth
                        className="sm:w-auto"
                      >
                        TEST MÁY MIỄN PHÍ
                      </Button>
                    </motion.div>

                    {/* Stats Section - Responsive Grid */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/10">
                      <div className="text-center lg:text-left">
                        <div className="text-2xl md:text-3xl font-bold text-cyan-400">100+</div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider text-blue-200/60 font-bold">Sản phẩm</div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-2xl md:text-3xl font-bold text-cyan-400">24/7</div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider text-blue-200/60 font-bold">Hỗ trợ</div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-2xl md:text-3xl font-bold text-cyan-400">100%</div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider text-blue-200/60 font-bold">Uy tín</div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Right Image Content - Responsive sizing */}
                  <motion.div
                    className="flex-1 flex justify-center items-center relative"
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <div className="relative w-full max-w-[500px] h-[250px] md:h-[450px]">
                      {/* Premium Glow around image */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-400/20 blur-[80px] rounded-[100%] animate-pulse"></div>

                      <img
                        src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                        alt="High-end Gaming Laptop"
                        className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-float relative z-10"
                      />

                      {/* Floating Tech Elements */}
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-5 -right-5 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 z-20"
                      >
                        <Shield className="w-6 h-6 text-cyan-400" />
                      </motion.div>
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
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={stagger}
                    >
                      {laptops.slice(0, 8).map((laptop) => (
                        <motion.div
                          key={laptop._id}
                          variants={fadeInUp}
                          whileHover={{ y: -5 }}
                        >
                          <ProductCard product={laptop} />
                        </motion.div>
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