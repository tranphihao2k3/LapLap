'use client';

import { Clock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import CleaningProcess from "./components/CleaningProcess";
import CleaningBenefits from "./components/CleaningBenefits";
import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";

export default function CleaningClient() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="inline-block px-4 py-1.5 bg-yellow-400/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-400/50 text-yellow-200">✨ Laptop mượt mà - Làm việc thả ga</motion.div>
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-black mb-4 leading-tight">Vệ Sinh & Bảo Dưỡng <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">Laptop Chuyên Nghiệp</span></motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-blue-50 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">Laptop <span className="text-yellow-300 font-bold">Nóng – Lag – Treo Máy?</span><br />Vệ sinh ngay để phục hồi hiệu năng đỉnh cao.</motion.p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"><Zap className="w-5 h-5 text-yellow-400 fill-current" /><span className="font-bold">Lấy liền 30p</span></div>
                            <div className="flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg shadow-lg font-bold"><span>Chỉ từ 150K</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 space-y-20 pt-16">
                <CleaningProcess />
                <CleaningBenefits />
                <section className="bg-white rounded-xl p-8 shadow-md border-l-4 border-blue-600 text-center space-y-4">
                    <p className="text-lg font-bold text-[#1e4275]">LapLap Cần Thơ – Vệ sinh laptop uy tín – sạch – nhanh – giá tốt</p>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-center gap-3 justify-center font-semibold"><Clock /> Thời gian: 30 - 45 phút</div>
                        <div className="flex items-center gap-3 justify-center font-semibold text-green-700"><ShieldCheck /> Keo tản nhiệt MX-4/MX-6</div>
                    </div>
                </section>
                <BookingForm title="Đặt Lịch Vệ Sinh" requestType="cleaning" />
            </div>
        </main>
    );
}
