"use client";

import Link from "next/link";
import Image from "next/image";
import StatItem from "@/components/StatItem";
import ProductCard from "./laptops/ProductCard";
import { useRef, useEffect, useState } from "react";
import { getCategories, getProducts, getBrands } from '@/lib/api/products';
import { MapPin, Truck, Shield, FlaskConical, ArrowRight, Phone, Facebook, ChevronRight, Star, Zap, Clock } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import TechLoader from "@/components/ui/TechLoader";

import { Category, Brand, Product } from '@/types/api';

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
        const [categoriesRes, brandsRes] = await Promise.all([
          getCategories(),
          getBrands({ categorySlug: 'laptop', hasProducts: true })
        ]);
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);
        if (brandsRes.success && brandsRes.data) setBrands(brandsRes.data);

        const laptopsRes = await getProducts({
          active: true, limit: 100, page: 1, sort: '-createdAt', categorySlug: 'laptop'
        });

        if (laptopsRes.success && laptopsRes.data) {
          const catGrouped: { [key: string]: Product[] } = {};
          const brandGrouped: { [key: string]: Product[] } = {};
          laptopsRes.data.forEach((laptop: any) => {
            if (laptop.isActive !== false) {
              const catId = typeof laptop.category === 'object' ? laptop.category?._id : laptop.category || "other";
              if (catId) { if (!catGrouped[catId]) catGrouped[catId] = []; catGrouped[catId].push(laptop); }
              const brand = laptop.brand || laptop.brandId;
              const brandId = typeof brand === 'object' ? brand?._id : brand || "other";
              if (brandId && brandId !== "other") { if (!brandGrouped[brandId]) brandGrouped[brandId] = []; brandGrouped[brandId].push(laptop); }
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
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };
  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  if (loading) return <TechLoader />;

  return (
    <main className="flex-1 bg-[#f7f9fc]">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #08112b 0%, #0d1f4e 40%, #0a2d6e 70%, #0d3a8a 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(0,180,255,0.18) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', left: '-5%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(26,58,200,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }} />
          {/* Cyan accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            width: '1px', height: '35%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,220,255,0.5), transparent)',
          }} />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left content */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden" animate="visible" variants={stagger}
            >
              {/* Location badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6" style={{
                background: 'rgba(0,220,255,0.12)',
                border: '1px solid rgba(0,220,255,0.35)',
                borderRadius: '999px',
                padding: '6px 16px',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00dcff', boxShadow: '0 0 8px #00dcff' }} />
                <MapPin size={12} color="#00dcff" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#00dcff', textTransform: 'uppercase' }}>
                  Cần Thơ
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 variants={fadeInUp}
                style={{
                  fontFamily: "'Syne', 'Be Vietnam Pro', sans-serif",
                  fontSize: 'clamp(38px, 5.5vw, 68px)',
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: '-1.5px',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}
              >
                Laptop Cũ<br />
                <span style={{
                  background: 'linear-gradient(90deg, #00dcff, #4d9fff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Cần Thơ
                </span>{' '}
                <span style={{ color: '#fff' }}>Giá Tốt</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p variants={fadeInUp}
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: 'rgba(180,210,255,0.85)',
                  maxWidth: 480,
                  marginBottom: 36,
                  marginLeft: 'auto', marginRight: 'auto',
                }}
                className="lg:mx-0"
              >
                Hệ thống mua bán <strong style={{ color: '#fff' }}>laptop cũ Cần Thơ</strong> & laptop mới chính hãng giá tốt nhất.
                Dịch vụ sửa chữa, vệ sinh máy lấy liền chuyên nghiệp.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                <Link href="/laptops" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px',
                  background: 'linear-gradient(135deg, #1a5eff, #0a3bd4)',
                  borderRadius: 10, color: '#fff',
                  fontWeight: 700, fontSize: 14,
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(26,94,255,0.45)',
                  transition: 'all 0.25s',
                }}>
                  Mua Ngay <ArrowRight size={16} />
                </Link>
                <Link href="/test" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, color: '#fff',
                  fontWeight: 600, fontSize: 14,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s',
                }}>
                  <FlaskConical size={15} /> Test Máy
                </Link>
                <a href="tel:0978648720" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px',
                  background: 'rgba(0,220,255,0.1)',
                  border: '1px solid rgba(0,220,255,0.3)',
                  borderRadius: 10, color: '#00dcff',
                  fontWeight: 600, fontSize: 14,
                  textDecoration: 'none',
                }}>
                  <Phone size={15} /> 0978 648 720
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeInUp}
                className="grid grid-cols-3 gap-0"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: 28, maxWidth: 380,
                  marginLeft: 'auto', marginRight: 'auto',
                }}
                // @ts-ignore
                style2={{ marginLeft: 0 }}
              // not ideal but for demo
              >
                {[
                  { val: '100+', label: 'Sản phẩm' },
                  { val: '23/7', label: 'Hỗ trợ' },
                  { val: '100%', label: 'Uy tín' },
                ].map((s, i) => (
                  <div key={i} className="text-center lg:text-left" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none', padding: '0 20px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Syne', sans-serif", letterSpacing: '-1px' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(160,195,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Laptop Image */}
            <motion.div
              className="hidden lg:flex flex-1 justify-center items-center"
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 380 }}>
                {/* Glow under laptop */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '10%', right: '10%',
                  height: 80,
                  background: 'radial-gradient(ellipse, rgba(0,180,255,0.35) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }} />
                <Image
                  src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                  alt="Laptop Cần Thơ - LapLap Store"
                  fill priority quality={95}
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))', animation: 'floatY 4s ease-in-out infinite' }}
                />
                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    position: 'absolute', top: '5%', right: '-5%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Còn hàng ngay</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  style={{
                    position: 'absolute', bottom: '10%', left: '-8%',
                    background: 'linear-gradient(135deg, #1a5eff22, #0a3bd422)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(26,94,255,0.3)',
                    borderRadius: 12, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <Shield size={16} color="#4d9fff" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Bảo hành 12 tháng</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f7f9fc" />
          </svg>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
          @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          BENEFITS BAR
      ═══════════════════════════════════════ */}
      <section className="container mx-auto max-w-6xl px-6 -mt-2 pb-6">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          {[
            { icon: MapPin, label: 'Tại Cần Thơ', sub: 'Ninh Kiều, Cần Thơ', color: '#1a5eff', bg: '#eff4ff' },
            { icon: Truck, label: 'Giao Hàng Tận Nơi', sub: 'Nội thành miễn phí', color: '#059669', bg: '#ecfdf5' },
            { icon: Shield, label: 'Bảo Hành Uy Tín', sub: '6 - 12 tháng', color: '#7c3aed', bg: '#f5f3ff' },
            { icon: FlaskConical, label: 'Test Máy Miễn Phí', sub: 'Trực tiếp tại cửa hàng', color: '#ea580c', bg: '#fff7ed' },
          ].map(({ icon: Icon, label, sub, color, bg }, i) => (
            <motion.div key={i} variants={fadeInUp}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: '20px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.25s',
              }}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          PRODUCT SECTIONS (Categories + Brands)
      ═══════════════════════════════════════ */}
      <div className="container mx-auto max-w-6xl px-6 pb-20 space-y-16">

        {/* Categories */}
        {categories.map((category) => {
          const laptops = laptopsByCategory[category._id] || [];
          if (laptops.length === 0) return null;
          return (
            <ProductSection
              key={category._id}
              title={category.name}
              accentColor="#1a5eff"
              viewAllHref={`/laptops?category=${category._id}`}
              stagger={stagger}
              fadeInUp={fadeInUp}
            >
              {laptops.slice(0, 8).map((laptop) => (
                <motion.div key={laptop._id} variants={fadeInUp}>
                  <ProductCard product={laptop} />
                </motion.div>
              ))}
            </ProductSection>
          );
        })}

        {/* Brands */}
        {brands.map((brand) => {
          const laptops = laptopsByBrand[brand._id] || [];
          if (laptops.length === 0) return null;
          return (
            <ProductSection
              key={brand._id}
              title={`Laptop ${brand.name}`}
              accentColor="#0891b2"
              viewAllHref={`/laptops?brand=${brand._id}`}
              stagger={stagger}
              fadeInUp={fadeInUp}
            >
              {laptops.slice(0, 4).map((laptop) => (
                <motion.div key={laptop._id} variants={fadeInUp}>
                  <ProductCard product={laptop} />
                </motion.div>
              ))}
            </ProductSection>
          );
        })}

        {/* ─── WHY CHOOSE US ─── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#eff4ff', borderRadius: 999, padding: '5px 14px',
              fontSize: 12, fontWeight: 700, color: '#1a5eff',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 12,
            }}>
              <Star size={12} /> Tại sao chọn LapLap
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
              color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 8,
            }}>
              Uy tín hàng đầu Cần Thơ
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Cam kết chất lượng, giá tốt nhất và dịch vụ hậu mãi tận tâm.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Kiểm tra minh bạch',
                desc: 'Mỗi máy đều được test kỹ lưỡng 20+ điểm trước khi bán. Bạn có thể test lại trực tiếp tại cửa hàng hoàn toàn miễn phí.',
                color: '#1a5eff', bg: '#eff4ff',
              },
              {
                icon: '💰',
                title: 'Giá tốt nhất thị trường',
                desc: 'Cam kết giá cạnh tranh nhất Cần Thơ. Nếu tìm được nơi rẻ hơn cùng chất lượng, chúng tôi sẽ hoàn tiền chênh lệch.',
                color: '#059669', bg: '#ecfdf5',
              },
              {
                icon: '🛡️',
                title: 'Bảo hành & hỗ trợ lâu dài',
                desc: 'Bảo hành 6-12 tháng rõ ràng. Hỗ trợ kỹ thuật 23/7, sửa chữa lấy liền, không để khách chờ lâu.',
                color: '#7c3aed', bg: '#f5f3ff',
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '28px 24px',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 18,
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#0f172a', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#64748b' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── CTA BANNER ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{
            background: 'linear-gradient(135deg, #0d1f4e 0%, #0a2d6e 50%, #0d3a8a 100%)',
            borderRadius: 24,
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: '-30%', right: '-10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,220,255,0.15)',
            border: '1px solid rgba(0,220,255,0.3)',
            borderRadius: 999, padding: '5px 14px',
            fontSize: 12, fontWeight: 700, color: '#00dcff',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 16, position: 'relative',
          }}>
            <Zap size={12} /> Liên hệ ngay
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 800, color: '#fff',
            letterSpacing: '-0.5px', marginBottom: 12,
            position: 'relative',
          }}>
            Tìm laptop phù hợp?<br />
            <span style={{ color: '#00dcff' }}>Tư vấn miễn phí ngay!</span>
          </h2>
          <p style={{ color: 'rgba(180,210,255,0.85)', fontSize: 15, maxWidth: 440, marginBottom: 28, position: 'relative' }}>
            Đội ngũ tư vấn giàu kinh nghiệm sẵn sàng giúp bạn chọn chiếc laptop phù hợp nhất với nhu cầu và ngân sách.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
            <a href="tel:0978648720" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: 'linear-gradient(135deg, #00dcff, #1a7fff)',
              borderRadius: 10, color: '#000',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,220,255,0.4)',
            }}>
              <Phone size={16} /> 0978 648 720
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10, color: '#fff',
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>
              <Facebook size={16} /> Ghé thăm Fanpage
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, position: 'relative' }}>
            <Clock size={14} color="rgba(160,195,255,0.6)" />
            <span style={{ fontSize: 13, color: 'rgba(160,195,255,0.6)' }}>
              Mở cửa T2–T7: 8:00–21:00 · CN: 8:00–18:00
            </span>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   ProductSection component
───────────────────────────────────────────── */
function ProductSection({
  title, accentColor, viewAllHref, children, stagger, fadeInUp
}: {
  title: string;
  accentColor: string;
  viewAllHref: string;
  children: React.ReactNode;
  stagger: Variants;
  fadeInUp: Variants;
}) {
  return (
    <motion.section
      initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: '-60px' }} variants={stagger}
    >
      <motion.div variants={fadeInUp}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 4, height: 28, borderRadius: 2, background: accentColor }} />
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', textTransform: 'uppercase',
          }}>
            {title}
          </h2>
        </div>
        <Link href={viewAllHref} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 600, color: accentColor,
          textDecoration: 'none', padding: '7px 16px',
          border: `1px solid ${accentColor}30`,
          borderRadius: 999, background: `${accentColor}08`,
          transition: 'all 0.2s',
        }}>
          Xem tất cả <ChevronRight size={14} />
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}