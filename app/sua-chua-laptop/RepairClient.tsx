'use client';

import { motion } from "framer-motion";
import { Wrench, Settings, Search, CheckCircle, Zap } from "lucide-react";
import RepairProcess from "./components/RepairProcess";
import CommonErrors from "./components/CommonErrors";
import ServiceCommitment from "./components/ServiceCommitment";

export default function RepairClient() {
    return (
        <main className="min-h-screen bg-white text-slate-800 pb-20">
            {/* Hero Section */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-blue-400/30 py-12 md:py-20">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/50 text-blue-200">
                            🛠️ Khắc phục mọi sự cố
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                            Sửa Chữa Laptop <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Uy Tín & Chuyên Nghiệp</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                            Chẩn đoán chính xác - Sửa chữa tận tâm. <br />Đội ngũ kỹ thuật viên giàu kinh nghiệm tại Cần Thơ.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <Search className="w-5 h-5 text-yellow-400" />
                                <span className="font-bold">Kiểm tra miễn phí</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="font-bold">Bảo hành uy tín</span>
                            </div>
                        </motion.div>
                    </div>
                    <div className="hidden md:flex w-2/5 items-center justify-center relative">
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute">
                                <Settings className="w-48 h-48 text-indigo-500/30" />
                            </motion.div>
                            <div className="absolute bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-100 z-20">
                                <Wrench className="w-16 h-16 text-blue-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 py-12">
                <CommonErrors />
                <RepairProcess />
                <ServiceCommitment />
            </div>
        </main>
    );
}
