'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatItem from "@/components/StatItem";
import ProductCard from "./laptops/ProductCard";
import { useRef, useEffect, useState } from 'react';
import { MapPin, Truck, Shield, TestTube } from 'lucide-react';
import { motion, Variants, useInView, animate } from "framer-motion";
import Button from "@/components/ui/Button";
import Slider from "react-slick";
import TechLoader from '@/components/ui/TechLoader';


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
      "description": "Chuyên mua bán laptop cũ, mới chính hãng tại Cần Thơ. Dịch vụ sửa chữa (sữa laptop), vệ sinh laptop lấy liền uy tín.",
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section - Full Width & Modern */}
        <section className="relative w-full min-h-[500px] md:h-[600px] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden shadow-2xl mb-12">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 h-full flex items-center py-12 md:py-0">
            <div className="container mx-auto max-w-5xl px-4 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 pt-10 md:pt-0">
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

                  <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Laptop Cần Thơ
                    <br />
                    <span className="text-cyan-300">
                      LapLap - Cũ & Mới
                    </span>
                  </motion.h1>

                  <motion.p variants={fadeInUp} className="text-base md:text-lg text-blue-100/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                    Hệ thống bán lẻ laptop cũ Cần Thơ & laptop mới chính hãng uy tín nhất.
                    Dịch vụ sửa chữa (sữa laptop), vệ sinh máy tính lấy liền.
                    <span className="block mt-2 text-cyan-200 font-bold">Giao hàng tức thì • Bảo hành 24/7 chuyên nghiệp</span>
                  </motion.p>

                  <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                    <Button
                      href="/laptops"
                      variant="white"
                      size="lg"
                      rightIcon="→"
                      className="min-w-[160px] shadow-lg shadow-blue-900/20"
                    >
                      MUA NGAY
                    </Button>
                    <Button
                      href="/test"
                      variant="glass"
                      size="lg"
                      className="min-w-[160px] border-white/30 hover:bg-white/10"
                    >
                      TEST MÁY
                    </Button>
                  </motion.div>

                  {/* Stats Section - Responsive Grid */}
                  <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                    <StatItem value={100} suffix="+" label="Sản phẩm" />
                    <StatItem value={24} suffix="/7" label="Hỗ trợ" />
                    <StatItem value={100} suffix="%" label="Uy tín" />
                  </motion.div>
                </motion.div>

                {/* Right Image Content - Responsive sizing */}
                <motion.div
                  className="flex-1 flex justify-center items-center relative w-full"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="relative w-full max-w-[500px] h-[300px] md:h-[500px]">
                    {/* Premium Glow around image */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-400/20 blur-[80px] rounded-[100%] animate-pulse"></div>

                    <img
                      src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                      alt="High-end Gaming Laptop"
                      className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-float relative z-10"
                    />


                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
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
            <TechLoader />
          ) : (
            <>
              {/* Categories */}
              {categories.map((category) => {
                const laptops = laptopsByCategory[category._id] || [];

                if (laptops.length === 0) return null;

                return (
                  <section key={category._id} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <motion.h2
                        className="text-2xl md:text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {category.name}
                      </motion.h2>

                      <Button
                        href={`/laptops?category=${category._id}`}
                        variant="outline"
                        size="sm"
                        rounded="full"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                      >
                        Xem thêm
                      </Button>
                    </div>
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={stagger}
                    >
                      {laptops.slice(0, 4).map((laptop) => (
                        <motion.div key={laptop._id} variants={fadeInUp}>
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