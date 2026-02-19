'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import {
    Target, Eye, Heart, Award, Users, Briefcase,
    CheckCircle, ShieldCheck, MapPin, Phone, Mail,
    Globe, Zap, TrendingUp, Star
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { useRef } from 'react';

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function AboutPage() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 font-sans overflow-hidden">

                {/* 1. HERO SECTION */}
                <section ref={targetRef} className="relative min-h-[500px] md:h-[80vh] md:min-h-[600px] flex items-center overflow-hidden py-20 md:py-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-blue-900 z-10 opacity-95"></div>
                    <div className="absolute inset-0 z-0">
                        {/* Parallax Background Image */}
                        <motion.div style={{ y }} className="w-full h-[120%] relative -top-[10%]">
                            <img
                                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                alt="Technology Background"
                                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                            />
                        </motion.div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-20">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md">
                                VỀ CHÚNG TÔI
                            </motion.span>
                            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                                Kiến tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tương lai</span> <br />
                                Công nghệ tại Cần Thơ
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                                "Không chỉ bán Laptop, chúng tôi trao giải pháp và niềm tin cho hành trình thành công của bạn."
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button href="#story" variant="white" size="lg" className="shadow-lg shadow-blue-900/20 px-8">
                                    Tìm hiểu thêm
                                </Button>
                                <Button href="#contact" variant="outline" size="lg" className="text-white border-white hover:bg-white/10 px-8">
                                    Liên hệ ngay
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ delay: 2, duration: 2, repeat: Infinity }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 hidden md:block"
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                            <div className="w-1 h-2 bg-white rounded-full"></div>
                        </div>
                    </motion.div>
                </section>

                {/* 2. OUR STORY SECTION */}
                <section id="story" className="py-16 md:py-24 bg-white relative">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeInLeft}
                                className="relative"
                            >
                                <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 relative z-10">
                                    Câu chuyện <br /> <span className="text-blue-600">Khởi nghiệp</span>
                                </h2>
                                <div className="space-y-6 text-slate-600 leading-relaxed text-lg relative z-10">
                                    <p>
                                        <span className="text-5xl md:text-6xl float-left mr-4 mt-[-5px] md:mt-[-10px] font-serif text-blue-200">2020</span>
                                        Là nám đánh dấu sự ra đời của LapLap, bắt nguồn từ niềm đam mê cháy bỏng với công nghệ của founder <strong>Trần Phi Hào</strong>. Từ một căn phòng nhỏ với vài chiếc laptop cũ, chúng tôi đã mơ về một hệ thống bán lẻ uy tín hàng đầu.
                                    </p>
                                    <p className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 italic">
                                        "Khó khăn không làm chúng tôi chùn bước, đó là động lực để LapLap hoàn thiện từng ngày."
                                    </p>
                                    <p>
                                        Hơn 5 năm qua là hành trình không ngừng nỗ lực để chứng minh: <strong>Uy tín</strong> không đến từ lời nói, mà đến từ hàng nghìn sản phẩm chất lượng được trao tận tay khách hàng.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeInRight}
                                className="relative"
                            >
                                {/* Timeline / Milestones Visual */}
                                <div className="relative border-l-2 border-slate-200 ml-4 pl-8 md:ml-0 md:pl-8 space-y-10">
                                    <div className="relative group">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform"></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform cursor-default">
                                            <span className="text-sm font-bold text-blue-500 mb-1 block">2020</span>
                                            <h4 className="text-xl font-bold text-slate-900">Thành lập LapLap</h4>
                                            <p className="text-slate-500 text-sm mt-2">Bắt đầu hành trình với cửa hàng đầu tiên tại Cần Thơ.</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-purple-600 rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform"></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform cursor-default">
                                            <span className="text-sm font-bold text-purple-500 mb-1 block">2023</span>
                                            <h4 className="text-xl font-bold text-slate-900">Mở rộng quy mô</h4>
                                            <p className="text-slate-500 text-sm mt-2">Phát triển thêm phòng kỹ thuật chuẩn quốc tế và kho hàng lớn.</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-green-600 rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform"></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform cursor-default">
                                            <span className="text-sm font-bold text-green-500 mb-1 block">2025</span>
                                            <h4 className="text-xl font-bold text-slate-900">Top 1 Cần Thơ</h4>
                                            <p className="text-slate-500 text-sm mt-2">Được bình chọn là địa chỉ mua laptop uy tín nhất khu vực.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3. MISSION - VISION - VALUES */}
                <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <Card3D
                                icon={Target}
                                title="Sứ Mệnh"
                                color="text-blue-400"
                                desc="Đơn giản hóa việc tiếp cận công nghệ cho mọi người, mang đến trải nghiệm mua sắm an tâm tuyệt đối."
                            />
                            <Card3D
                                icon={Eye}
                                title="Tầm Nhìn"
                                color="text-purple-400"
                                desc="Trở thành biểu tượng niềm tin số 1 về bán lẻ và dịch vụ Laptop tại khu vực Đồng Bằng Sông Cửu Long."
                            />
                            <Card3D
                                icon={Heart}
                                title="Giá Trị Cốt Lõi"
                                color="text-red-400"
                                desc="TẬN TÂM phục vụ - TRUNG THỰC trong mọi giao dịch - TRÁCH NHIỆM với từng sản phẩm bán ra."
                            />
                        </motion.div>
                    </div>
                </section>

                {/* 4. STATS (Social Proof) */}
                <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
                    {/* Background Subtle Elements */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>

                    <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                        >
                            {[
                                { num: '10K+', label: 'Khách hàng', icon: Users, color: 'text-blue-400' },
                                { num: '5+', label: 'Năm kinh nghiệm', icon: Briefcase, color: 'text-purple-400' },
                                { num: '20+', label: 'Nhân sự', icon: Award, color: 'text-green-400' },
                                { num: '100%', label: 'Hài lòng', icon: Star, color: 'text-yellow-400' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="relative group h-full"
                                >
                                    <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:-translate-y-2 shadow-2xl">
                                        <div className="mb-6 p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <item.icon size={28} className={item.color} />
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter tabular-nums">
                                            {item.num}
                                        </h3>
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                                            {item.label}
                                        </p>
                                    </div>
                                    {/* Decorative subtle pulse effect on hover */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* 5. SERVICES ECOSYSTEM */}
                <section className="py-16 md:py-24 bg-slate-50">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Hệ sinh thái</span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-6">Giải pháp toàn diện</h2>
                                <p className="text-slate-500 text-lg">
                                    Chúng tôi xây dựng một chu trình khép kín từ tư vấn, bán hàng đến hậu mãi, sửa chữa để bạn hoàn toàn yên tâm sử dụng.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ServiceCard
                                icon={Briefcase}
                                title="Kinh doanh Laptop"
                                desc="Laptop nhập khẩu Mỹ, Nhật tuyển chọn kỹ lưỡng. Đa dạng phân khúc từ Văn phòng, Doanh nhân đến Gaming, Đồ họa."
                                link="/laptops"
                                delay={0}
                            />
                            <ServiceCard
                                icon={Zap}
                                title="Sửa chữa Phần cứng"
                                desc="Trung tâm bảo hành chuyên sâu với máy móc hiện đại. Xử lý sự cố mainboard, màn hình, nguồn với độ chính xác cao."
                                link="/sua-chua-laptop"
                                delay={0.2}
                            />
                            <ServiceCard
                                icon={TrendingUp}
                                title="Nâng cấp & Spa"
                                desc="Dịch vụ vệ sinh, tra keo tản nhiệt xịn. Nâng cấp RAM, SSD chính hãng giúp máy tính lột xác hiệu năng."
                                link="/ve-sinh-laptop"
                                delay={0.4}
                            />
                        </div>
                    </div>
                </section>

                {/* 6. TEAM */}
                <section className="py-16 md:py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-16">
                            <div className="flex-1">
                                <motion.h2
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-snug"
                                >
                                    Đội ngũ <br /> <span className="text-blue-600">Lãnh đạo</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg text-slate-600 leading-relaxed"
                                >
                                    Sự thành công của LapLap được xây dựng bởi những con người tài năng, tâm huyết và luôn đặt khách hàng làm trung tâm.
                                </motion.p>
                            </div>
                            <div className="flex-1 w-full text-right">
                                <Button href="/tuyen-dung" variant="outline" size="lg">Tham gia cùng chúng tôi</Button>
                            </div>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            <TeamMember
                                img="https://scontent.fvca1-2.fna.fbcdn.net/v/t39.30808-6/600319798_2494516350964485_227059619579226926_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=aKijqTdWjc4Q7kNvwGkrDJA&_nc_oc=Adnl7prUm6QOBQdOkpgb6w_PAVIxnAvEk1dN0t4OLK1O8wYxIpL11X4D7ctc1D3PqtE&_nc_zt=23&_nc_ht=scontent.fvca1-2.fna&_nc_gid=TddckYo6uyBP7hhwiBO_aw&oh=00_AfvOtreFDtjKd3R9rEvOKf6xX5S1j5IdLF9M4mPC86KHbw&oe=699AA097"
                                name="Trần Phi Hào"
                                role="Founder & CEO"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* 7. CULTURE GALLERY */}
                <section className="py-16 md:py-24 bg-slate-900 text-white">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-black mb-4"
                            >
                                Văn hóa LapLap
                            </motion.h2>
                            <p className="text-slate-400">Nơi làm việc không chỉ là công ty, mà là ngôi nhà thứ hai.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group"
                            >
                                <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3" alt="Office Culture" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-8">
                                    <h3 className="text-2xl font-bold text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Môi trường chuyên nghiệp</h3>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group"
                            >
                                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3" alt="Meeting" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="col-span-1 row-span-2 relative rounded-3xl overflow-hidden group"
                            >
                                <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3" alt="Teamwork" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-8">
                                    <h3 className="text-xl font-bold text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Đoàn kết là sức mạnh</h3>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group"
                            >
                                <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3" alt="Happy" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 8. COMMITMENT */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Cam kết của chúng tôi</h2>
                            <p className="text-slate-500 text-lg">Những nguyên tắc bất di bất dịch tạo nên thương hiệu LapLap.</p>
                        </div>
                        <div className="space-y-6">
                            <CommitmentItem
                                number="01"
                                title="Chất lượng là danh dự"
                                content="Chúng tôi nói KHÔNG với hàng giả, hàng kém chất lượng. Mọi sản phẩm đều được kiểm tra quy trình 12 bước nghiêm ngặt trước khi đến tay khách hàng."
                            />
                            <CommitmentItem
                                number="02"
                                title="Bảo hành trách nhiệm"
                                content="Lỗi là đổi trong 30 ngày. Bảo hành siêu tốc, hỗ trợ mượn máy trong thời gian chờ sửa chữa để không gián đoạn công việc của bạn."
                            />
                            <CommitmentItem
                                number="03"
                                title="Khách hàng là người thân"
                                content="Tư vấn đúng nhu cầu, không vẽ bệnh, không kê giá. Chúng tôi phục vụ bạn như phục vụ chính người thân trong gia đình."
                            />
                        </div>
                    </div>
                </section>

                {/* 9. CONTACT CTA */}
                <section id="contact" className="py-16 md:py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-white/20 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="flex-1 w-full text-center lg:text-left">
                                <h2 className="text-2xl md:text-4xl font-bold mb-4">Sẵn sàng trải nghiệm dịch vụ 5 sao?</h2>
                                <p className="text-blue-100 text-base md:text-lg mb-8">Hãy ghé thăm showroom của chúng tôi hoặc liên hệ ngay để được tư vấn miễn phí.</p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Phone className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs text-blue-200 uppercase font-bold">Hotline</div>
                                            <div className="font-bold text-lg">0978.648.720</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                            <MapPin className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs text-blue-200 uppercase font-bold">Showroom</div>
                                            <div className="font-bold text-lg">....</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <Button href="/laptops" variant="white" size="xl" className="shadow-2xl shadow-blue-900/50">
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. LEGAL */}
                {/* <section className="py-8 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-slate-700">CÔNG TY TNHH CÔNG NGHỆ LAPLAP</p>
                            <p>Địa chỉ: ....</p>
                            <p>GPKD số: 0123456789 do Sở KHĐT TP. Cần Thơ cấp ngày 01/01/2020</p>
                        </div>
                        <div className="flex gap-4">
                            <img src="/logo-placeholder.png" alt="Bo Cong Thuong" className="h-10 opacity-50 grayscale" />
                        </div>
                    </div>
                </section> */}

            </main>
            <Footer />
        </>
    );
}

// --- SUB COMPONENTS ---

function Card3D({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
            <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} className={color} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
        </motion.div>
    );
}

function ServiceCard({ icon: Icon, title, desc, link, delay }: { icon: any, title: string, desc: string, link: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Link href={link} className="block group h-full">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-blue-100 z-0"></div>
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                        <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{title}</h3>
                    <p className="text-slate-500 leading-relaxed mb-6 relative z-10">{desc}</p>
                </div>
            </Link>
        </motion.div>
    );
}

function TeamMember({ img, name, role }: { img: string, name: string, role: string }) {
    return (
        <motion.div variants={fadeInUp} className="group relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg">
                <Image src={img} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white font-bold text-lg">{name}</div>
                    <div className="text-blue-300 text-sm font-medium">{role}</div>
                </div>
            </div>
            {/* Mobile Fallback if hover doesn't work well */}
            <div className="text-center md:hidden">
                <h4 className="font-bold text-slate-900">{name}</h4>
                <p className="text-blue-600 text-sm">{role}</p>
            </div>
        </motion.div>
    );
}

function CommitmentItem({ number, title, content }: { number: string, title: string, content: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow items-start"
        >
            <div className="text-4xl font-black text-slate-200">{number}</div>
            <div>
                <h4 className="font-bold text-xl text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-600 leading-relaxed">{content}</p>
            </div>
        </motion.div>
    );
}
