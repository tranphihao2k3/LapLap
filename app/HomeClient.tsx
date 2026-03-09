"use client";

import Link from "next/link";
import Image from "next/image";
import StatItem from "@/components/StatItem";
import ProductCard from "./laptops/ProductCard";
import { useRef, useEffect, useState } from "react";
import { getCategories, getProducts, getBrands } from '@/lib/api/products';
import { MapPin, Truck, Shield, TestTube } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import TechLoader from "@/components/ui/TechLoader";

interface LaptopSpec {
  cpu: string;
  gpu: string;
  ram: string;
  ssd: string;
  screen: string;
  battery: string;
}

import { Category, Brand, Product } from '@/types/api';

// adjust Product type imported above includes additional fields

export default function HomeClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [laptopsByCategory, setLaptopsByCategory] = useState<{ [key: string]: Product[] }>({});
  const [laptopsByBrand, setLaptopsByBrand] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Categories and Brands
        const [categoriesRes, brandsRes] = await Promise.all([
          getCategories(),
          getBrands({ categorySlug: 'laptop', hasProducts: true })
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }

        if (brandsRes.success && brandsRes.data) {
          setBrands(brandsRes.data);
        }

        // 2. Fetch a larger set of products to group on the frontend
        const laptopsRes = await getProducts({
          active: true,
          limit: 100, // Fetch more to populate diverse sections
          page: 1,
          sort: '-createdAt',
          categorySlug: 'laptop'
        });

        if (laptopsRes.success && laptopsRes.data) {
          const catGrouped: { [key: string]: Product[] } = {};
          const brandGrouped: { [key: string]: Product[] } = {};

          laptopsRes.data.forEach((laptop: any) => {
            // NexGear Uses isActive instead of status
            if (laptop.isActive !== false) {
              // Group by Category
              const catId =
                typeof laptop.category === 'object'
                  ? laptop.category?._id
                  : laptop.category || "other";

              if (catId) {
                if (!catGrouped[catId]) catGrouped[catId] = [];
                catGrouped[catId].push(laptop);
              }

              // Group by Brand
              const brand = laptop.brand || laptop.brandId;
              const brandId =
                typeof brand === 'object'
                  ? brand?._id
                  : brand || "other";

              if (brandId && brandId !== "other") {
                if (!brandGrouped[brandId]) brandGrouped[brandId] = [];
                brandGrouped[brandId].push(laptop);
              }
            }
          });

          setLaptopsByCategory(catGrouped);
          setLaptopsByBrand(brandGrouped);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  if (loading) return <TechLoader />;

  return (
    <main className="flex-1">
      <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-20 mb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto max-w-5xl px-4 h-full flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                className="flex-1 text-center lg:text-left z-10"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-white/20"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white font-semibold text-[10px] uppercase tracking-widest">
                    Cần Thơ
                  </span>
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight"
                >
                  Laptop Cũ Cần Thơ
                  <br />
                  <span className="text-cyan-300">
                    LapLap - Uy Tín & Giá Rẻ
                  </span>
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-sm md:text-base text-blue-100/90 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                >
                  Hệ thống mua bán <strong>laptop cũ Cần Thơ</strong> & laptop
                  mới chính hãng giá tốt nhất. Dịch vụ sửa chữa, vệ sinh máy lấy
                  liền chuyên nghiệp.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8"
                >
                  <Button
                    href="/laptops"
                    variant="white"
                    size="md"
                    rightIcon="→"
                    className="min-w-[140px] shadow-lg shadow-black/20"
                  >
                    MUA NGAY
                  </Button>
                  <Button
                    href="/test"
                    variant="glass"
                    size="md"
                    className="min-w-[140px] border-white/30 hover:bg-white/10"
                  >
                    TEST MÁY
                  </Button>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0"
                >
                  <StatItem value={100} suffix="+" label="Sản phẩm" />
                  <StatItem value={24} suffix="/7" label="Hỗ trợ" />
                  <StatItem value={100} suffix="%" label="Uy tín" />
                </motion.div>
              </motion.div>
              <motion.div
                className="hidden md:flex flex-1 justify-center items-center relative w-full"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="relative w-full max-w-[450px] h-[280px] md:h-[400px]">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-400/20 blur-[80px] rounded-[100%] animate-pulse"></div>
                  <Image
                    src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                    alt="High-end Gaming Laptop"
                    fill
                    priority
                    quality={100}
                    className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-float relative z-10"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        <motion.section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <BenefitCard icon={MapPin} title="Tại Cần Thơ" color="blue" />
          <BenefitCard icon={Truck} title="Giao Hàng Tận Nơi" color="green" />
          <BenefitCard icon={Shield} title="Bảo Hành Uy Tín" color="purple" />
          <BenefitCard icon={TestTube} title="Test Miễn Phí" color="orange" />
        </motion.section>

        {/* Categories Section */}
        {categories.map((category) => {
          const laptops = laptopsByCategory[category._id] || [];
          if (laptops.length === 0) return null;
          return (
            <section key={category._id} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-black text-slate-800 border-b-4 border-blue-600 pb-2 inline-block uppercase tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  {category.name}
                </motion.h2>
                <Button
                  href={`/laptops?category=${category._id}`}
                  variant="outline"
                  size="sm"
                  rounded="full"
                >
                  Xem tất cả
                </Button>
              </div>
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
                initial="hidden"
                whileInView="visible"
                variants={stagger}
              >
                {laptops.slice(0, 8).map((laptop) => (
                  <motion.div key={laptop._id} variants={fadeInUp}>
                    <ProductCard product={laptop} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}

        {/* Brands Section */}
        {brands.map((brand) => {
          const laptops = laptopsByBrand[brand._id] || [];
          if (laptops.length === 0) return null;
          return (
            <section key={brand._id} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-black text-slate-800 border-b-4 border-cyan-500 pb-2 inline-block uppercase tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  Laptop {brand.name}
                </motion.h2>
                <Button
                  href={`/laptops?brand=${brand._id}`}
                  variant="outline"
                  size="sm"
                  rounded="full"
                >
                  Xem thêm
                </Button>
              </div>
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
                initial="hidden"
                whileInView="visible"
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
      </div>
    </main>
  );
}

function BenefitCard({ icon: Icon, title, color }: any) {
  const colors: any = {
    blue: "from-blue-50 border-blue-100 text-blue-600",
    green: "from-green-50 border-green-100 text-green-600",
    purple: "from-purple-50 border-purple-100 text-purple-600",
    orange: "from-orange-50 border-orange-100 text-orange-600",
  };
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`group bg-gradient-to-br ${colors[color]} p-4 md:p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col items-center text-center`}
    >
      <div
        className={`w-10 h-10 md:w-14 md:h-14 bg-white/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5 md:w-7 md:h-7" />
      </div>
      <h3 className="font-bold text-sm md:text-lg text-gray-800">{title}</h3>
    </motion.div>
  );
}
