'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "./laptops/ProductCard";
import { useEffect, useState } from 'react';

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
            {/* Banner Section */}
            <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/banner.jpg"
                alt="LapLap Store Banner"
                fill
                className="object-cover"
                priority
              />
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