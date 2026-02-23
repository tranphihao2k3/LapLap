'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import {
    Target, Eye, Heart, Award, Users, Briefcase,
    MapPin, Phone, Mail,
    Zap, TrendingUp, Star
} from 'lucide-react';
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

export default function AboutClient() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    // Sub-components as functions inside Client Component to preserve motion/hooks
    const Card3D = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
        <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
            <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} className={color} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
        </motion.div>
    );

    const ServiceCard = ({ icon: Icon, title, desc, link, delay }: { icon: any, title: string, desc: string, link: string, delay: number }) => (
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

    const TeamMember = ({ img, name, role }: { img: string, name: string, role: string }) => (
        <motion.div variants={fadeInUp} className="group relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg">
                <Image src={img} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white font-bold text-lg">{name}</div>
                    <div className="text-blue-300 text-sm font-medium">{role}</div>
                </div>
            </div>
            <div className="text-center md:hidden">
                <h4 className="font-bold text-slate-900">{name}</h4>
                <p className="text-blue-600 text-sm">{role}</p>
            </div>
        </motion.div>
    );

    const CommitmentItem = ({ number, title, content }: { number: string, title: string, content: string }) => (
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

    return (
        <main className="min-h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Hero Section */}
            <section ref={targetRef} className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-20">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-20">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto text-center">
                        <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-blue-100 border border-white/20 text-sm font-semibold tracking-wider mb-6">
                            GIỚI THIỆU LAPLAP
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                            Kiến tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 uppercase">Tương lai</span> <br />
                            Công nghệ tại Cần Thơ
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                            "Không chỉ bán Laptop, chúng tôi trao giải pháp và niềm tin cho hành trình thành công của bạn."
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button href="#story" variant="white" size="lg" className="shadow-lg px-8">Tìm hiểu thêm</Button>
                            <Button href="#contact" variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 px-8">Liên hệ ngay</Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* OUR STORY */}
            <section id="story" className="py-16 md:py-24 bg-white relative">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInLeft} className="relative">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Câu chuyện Khởi nghiệp</h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>Được thành lập bởi founder Trần Phi Hào từ năm 2020 tại Cần Thơ.</p>
                                <p className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 italic">"Uy tín đến từ hàng nghìn khách hàng tin tưởng."</p>
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInRight} className="relative">
                            <div className="relative border-l-2 border-slate-200 space-y-10 pl-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                    <span className="text-sm font-bold text-blue-500">2020</span>
                                    <h4 className="text-xl font-bold text-slate-900">Thành lập LapLap</h4>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                    <span className="text-sm font-bold text-green-500">2025</span>
                                    <h4 className="text-xl font-bold text-slate-900">Top 1 Cần Thơ</h4>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MISSION - VISION */}
            <section className="py-16 md:py-24 bg-slate-900 text-white relative">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card3D icon={Target} title="Sứ Mệnh" color="text-blue-400" desc="Đơn giản hóa việc tiếp cận công nghệ cho mọi người." />
                        <Card3D icon={Eye} title="Tầm Nhìn" color="text-purple-400" desc="Trở thành biểu tượng niềm tin số 1 tại Miền Tây." />
                        <Card3D icon={Heart} title="Giá Trị" color="text-red-400" desc="TẬN TÂM - TRUNG THỰC - TRÁCH NHIỆM." />
                    </motion.div>
                </div>
            </section>

            {/* STATS */}
            <section className="py-20 bg-slate-950 text-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { num: '10K+', label: 'Khách hàng', icon: Users, color: 'text-blue-400' },
                            { num: '5+', label: 'Kinh nghiệm', icon: Briefcase, color: 'text-purple-400' },
                            { num: '20+', label: 'Nhân sự', icon: Award, color: 'text-green-400' },
                            { num: '100%', label: 'Hài lòng', icon: Star, color: 'text-yellow-400' },
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="text-center p-8 bg-white/5 rounded-3xl border border-white/10">
                                <item.icon size={28} className={`${item.color} mx-auto mb-4`} />
                                <h3 className="text-4xl font-black mb-2">{item.num}</h3>
                                <p className="text-slate-400 text-xs uppercase tracking-widest">{item.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard icon={Briefcase} title="Kinh doanh Laptop" desc="Laptop nhập khẩu Mỹ, Nhật tuyển chọn." link="/laptops" delay={0} />
                        <ServiceCard icon={Zap} title="Sửa chữa" desc="Trung tâm bảo hành chuyên sâu." link="/sua-chua-laptop" delay={0.2} />
                        <ServiceCard icon={TrendingUp} title="Nâng cấp" desc="Vệ sinh, nâng cấp linh kiện chính hãng." link="/ve-sinh-laptop" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* CONTACT CTA */}
            <section id="contact" className="py-16 md:py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                        <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn?</h2>
                        <p className="text-blue-100 mb-8">Hãy ghé thăm showroom hoặc liên hệ Hotline để được hỗ trợ tốt nhất.</p>
                        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                            <div className="flex items-center gap-4">
                                <Phone className="text-blue-400" />
                                <div className="text-left font-bold text-xl">0978.648.720</div>
                            </div>
                            <Button href="/laptops" variant="white" size="xl">Mua ngay</Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
