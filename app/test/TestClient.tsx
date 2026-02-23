'use client';

import { useState } from "react";
import CameraTest from "./components/CameraTest";
import MicTest from "./components/MicTest";
import SpeakerTest from "./components/SpeakerTest";
import ScreenTest from "./components/ScreenTest";
import SoftwareDownload from "./components/SoftwareDownload";
import { motion, Variants } from "framer-motion";
import { Activity, PlayCircle, CheckCircle, Zap, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

type TestType = "camera" | "mic" | "speaker" | "screen" | "keyboard" | "software";

interface TestItem {
    id: TestType;
    title: string;
    desc: string;
    link?: string;
}

export default function TestClient() {
    const [activeTest, setActiveTest] = useState<TestType | null>(null);

    const tests: TestItem[] = [
        { id: "software", title: "⬇️ Tải Phần Mềm", desc: "Tải phần mềm test laptop (BatteryMon, HDSentinel...)" },
        { id: "camera", title: "📷 Camera", desc: "Kiểm tra camera laptop" },
        { id: "mic", title: "🎙️ Microphone", desc: "Kiểm tra micro laptop" },
        { id: "speaker", title: "🔊 Loa", desc: "Kiểm tra loa/âm thanh laptop" },
        { id: "screen", title: "🖥️ Màn hình", desc: "Kiểm tra màn hình laptop" },
        { id: "keyboard", title: "⌨️ Bàn phím", desc: "Kiểm tra bàn phím laptop", link: "/test/keyboard" },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    if (activeTest) {
        return (
            <div className="min-h-screen bg-white">
                {activeTest === "software" && <SoftwareDownload onBack={() => setActiveTest(null)} />}
                {activeTest === "camera" && <CameraTest onBack={() => setActiveTest(null)} />}
                {activeTest === "mic" && <MicTest onBack={() => setActiveTest(null)} />}
                {activeTest === "speaker" && <SpeakerTest onBack={() => setActiveTest(null)} />}
                {activeTest === "screen" && <ScreenTest onBack={() => setActiveTest(null)} />}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="inline-block px-4 py-1.5 bg-indigo-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/50 text-indigo-200">
                            ⚡ Công cụ Test Laptop Online
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                            Kiểm Tra Laptop <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-indigo-200">Miễn Phí & Chính Xác</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-indigo-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                            Test Camera, Micro, Loa, Màn hình, Bàn phím... ngay trên trình duyệt mà không cần cài đặt phần mềm.
                        </motion.p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-bold">Nhanh chóng</span>
                            </div>
                            <Button onClick={() => setActiveTest("screen")} variant="primary" className="bg-gradient-to-r from-pink-500 to-rose-500 border-none shadow-pink-500/30" leftIcon={<PlayCircle size={20} />}>Test Ngay</Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto py-16 px-4">
                <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12" variants={containerVariants} initial="hidden" animate="visible">
                    {tests.map((test) => (
                        <motion.div key={test.id} onClick={() => test.link ? (window.location.href = test.link) : setActiveTest(test.id as any)} variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="group bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-blue-500 flex flex-col items-center text-center cursor-pointer">
                            <div className="text-4xl md:text-6xl mb-4">{test.title.split(" ")[0]}</div>
                            <h2 className="text-sm md:text-xl font-bold text-gray-800 mb-2">{test.title.split(" ").slice(1).join(" ")}</h2>
                            <p className="text-xs text-gray-500 hidden md:block">{test.desc}</p>
                            <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs md:text-base">Test Ngay <ArrowRight size={14} /></div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <motion.div className="bg-white rounded-xl p-8 shadow-md" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="font-bold text-xl text-gray-800 mb-4">📍 Test Laptop Tại Cần Thơ</h2>
                        <p className="text-gray-600 leading-relaxed">Công cụ test laptop hoàn toàn online, phục vụ khách hàng tại Cần Thơ. Không cần cài đặt, chỉ cần trình duyệt.</p>
                    </motion.div>
                    <motion.div className="bg-white rounded-xl p-8 shadow-md" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h3 className="font-bold text-xl text-gray-800 mb-4">ℹ️ Hướng dẫn</h3>
                        <p className="text-gray-600">Chọn công cụ, cấp quyền thiết bị và làm theo hướng dẫn trên màn hình.</p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
