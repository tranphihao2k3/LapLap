"use client";

import {
    Clock,
    ShieldCheck,
    Flame,
    Sparkles,
    Zap
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CleaningProcess from "./components/CleaningProcess";
import CleaningBenefits from "./components/CleaningBenefits";
import { motion } from "framer-motion";

export default function CleaningServicePage() {
    return (
        <>
            <Header />

            {/* Hero Section - Full Width */}
            <section className="relative w-full h-[320px] md:h-[400px] bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-lg border-b border-blue-400/30">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-3/5 text-center md:text-left pt-10 md:pt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-4 py-1.5 bg-yellow-400/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-400/50 text-yellow-200"
                        >
                            ✨ Laptop mượt mà - Làm việc thả ga
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-black mb-4 leading-tight"
                        >
                            Vệ Sinh & Bảo Dưỡng <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">
                                Laptop Chuyên Nghiệp
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-blue-50 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
                        >
                            Laptop <span className="text-yellow-300 font-bold">Nóng – Lag – Treo Máy?</span><br />
                            Vệ sinh ngay để phục hồi hiệu năng đỉnh cao.
                        </motion.p>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8"
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-bold">Lấy liền 30p</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                                <span className="font-bold">Keo tản nhiệt xịn</span>
                            </div>
                            <div className="flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/20 font-bold transform -rotate-2">
                                <span>Chỉ từ 150K</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="hidden md:flex w-2/5 items-center justify-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative z-10"
                        >
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                                <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center">
                                    <Sparkles className="w-32 h-32 text-yellow-400 drop-shadow-2xl animate-pulse" />
                                </div>

                                {/* Orbiting Elements */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0"
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-8"
                                >
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-100 p-2 rounded-full shadow-lg">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <main className="min-h-screen bg-slate-50 text-slate-800 pb-24 pt-8">
                {/* Removed original banner section */}

                <div className="container mx-auto max-w-4xl px-4 space-y-20">

                    {/* ================= QUY TRÌNH ================= */}
                    <CleaningProcess />

                    {/* ================= ƯU ĐÃI ================= */}
                    <CleaningBenefits />

                    {/* ================= CAM KẾT ================= */}
                    <section className="bg-white rounded-xl p-8 shadow-md border-l-4 border-[var(--color-secondary)] text-center space-y-4">
                        <p className="text-lg font-bold text-[#1e4275]">
                            LapLap Cần Thơ – Vệ sinh laptop uy tín – sạch – nhanh – giá tốt
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div className="flex items-center gap-3 justify-center font-semibold">
                                <Clock className="text-[#1e4275]" />
                                Thời gian: 30 phút – 1 tiếng
                            </div>
                            <div className="flex items-center gap-3 justify-center font-semibold text-green-700">
                                <ShieldCheck className="text-green-600" />
                                Phòng kỹ thuật riêng – an toàn
                            </div>
                        </div>
                    </section>

                    {/* ================= GIÁ ================= */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <PriceCard
                            title="Laptop văn phòng"
                            price="150.000đ"
                            note="Máy mỏng nhẹ – học tập – làm việc"
                        />
                        <PriceCard
                            title="Laptop Gaming"
                            price="200.000đ – 250.000đ"
                            note="Máy tản nhiệt lớn – CPU & GPU"
                            highlight
                        />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

/* ================= SUB COMPONENTS ================= */

function PriceCard({
    title,
    price,
    note,
    highlight = false
}: {
    title: string;
    price: string;
    note: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl p-6 text-center font-bold shadow-lg transition-transform hover:scale-105
            ${highlight
                    ? "bg-[#1e4275] text-white border-2 border-[#124A84]"
                    : "bg-white text-[#1e4275]"
                }`}
        >
            <h3 className="text-lg mb-2">{title}</h3>
            <div className="text-2xl mb-1">{price}</div>
            <p className={`text-sm ${highlight ? "text-slate-200" : "text-slate-600"}`}>
                {note}
            </p>
        </div>
    );
}
