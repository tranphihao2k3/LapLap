"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CameraTest from "./components/CameraTest";
import MicTest from "./components/MicTest";
import SpeakerTest from "./components/SpeakerTest";
import ScreenTest from "./components/ScreenTest";
import SoftwareDownload from "./components/SoftwareDownload";
import { motion, Variants } from "framer-motion";
import { Activity, PlayCircle, Monitor, CheckCircle, Smartphone, Zap, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

type TestType = "camera" | "mic" | "speaker" | "screen" | "keyboard" | "software";

interface TestItem {
    id: TestType;
    title: string;
    desc: string;
    link?: string;
}

export default function UnifiedTestPage() {
    const activeTestState = useState<TestType | null>(null);
    const activeTest = activeTestState[0];
    const setActiveTest = activeTestState[1];

    // Add structured data for SEO
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "LapLap - Test Laptop Cần Thơ",
            "description": "Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, micro, loa, màn hình, bàn phím laptop online.",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cần Thơ",
                "addressCountry": "VN"
            },
            "url": "https://laplapcantho.store/test",
            "priceRange": "Miễn phí",
            "areaServed": "Cần Thơ"
        });
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const tests: TestItem[] = [
        { id: "software" as TestType, title: "⬇️ Tải Phần Mềm", desc: "Tải phần mềm test laptop (BatteryMon, HDSentinel...)" },
        { id: "camera" as TestType, title: "📷 Camera", desc: "Kiểm tra camera laptop" },
        { id: "mic" as TestType, title: "🎙️ Microphone", desc: "Kiểm tra micro laptop" },
        { id: "speaker" as TestType, title: "🔊 Loa", desc: "Kiểm tra loa/âm thanh laptop" },
        { id: "screen" as TestType, title: "🖥️ Màn hình", desc: "Kiểm tra màn hình laptop" },
        { id: "keyboard" as TestType, title: "⌨️ Bàn phím", desc: "Kiểm tra bàn phím laptop", link: "/test/keyboard" },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
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
        <>
            <Header />

            {/* Hero Section - Standardized Height & Style */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-4 py-1.5 bg-indigo-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/50 text-indigo-200"
                        >
                            ⚡ Công cụ Test Laptop Online
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-black mb-4 leading-tight"
                        >
                            Kiểm Tra Laptop <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-indigo-200">
                                Miễn Phí & Chính Xác
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-indigo-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
                        >
                            Test Camera, Micro, Loa, Màn hình, Bàn phím... ngay trên trình duyệt mà không cần cài đặt phần mềm.
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
                                <span className="font-bold">Nhanh chóng</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="font-bold">Chính xác 100%</span>
                            </div>
                            <Button
                                onClick={() => setActiveTest("screen")}
                                variant="primary"
                                className="bg-gradient-to-r from-pink-500 to-rose-500 border-none shadow-pink-500/30"
                                leftIcon={<PlayCircle size={20} />}
                            >
                                Test Ngay
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="hidden md:flex w-2/5 items-center justify-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative z-10"
                        >
                            <div className="relative w-72 h-56 bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-2xl rounded-b-md shadow-2xl border-4 border-gray-700 flex flex-col overflow-hidden">
                                {/* Screen Content */}
                                <div className="flex-1 bg-gray-900 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-blue-500/10 grid grid-cols-6 grid-rows-4">
                                        {[...Array(24)].map((_, i) => (
                                            <div key={i} className="border border-blue-500/5"></div>
                                        ))}
                                    </div>
                                    <Activity className="w-24 h-24 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse" />

                                    {/* Scan Line */}
                                    <motion.div
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.8)]"
                                    />
                                </div>
                                {/* Laptop Base (Visual only) */}
                                <div className="h-4 bg-gray-700 w-full relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                                </div>
                            </div>
                            {/* Reflection/Shadow */}
                            <div className="h-4 w-64 mx-auto bg-black/20 blur-xl rounded-full mt-2"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <main className="min-h-screen bg-slate-50 py-16 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Test Grid */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {tests.map((test) => (
                            test.link ? (
                                <motion.a
                                    key={test.id}
                                    href={test.link}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-500 h-full flex flex-col items-center text-center cursor-pointer block"
                                >
                                    <div className="text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                                        {test.title.split(" ")[0]}
                                    </div>
                                    <h2 className="text-sm md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 md:mb-2 line-clamp-1">
                                        {test.title.split(" ").slice(1).join(" ")}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500 flex-grow hidden md:block">{test.desc}</p>
                                    <div className="mt-2 md:mt-4">
                                        <div className="flex items-center gap-1 md:gap-2 text-blue-600 font-bold group-hover:translate-x-1 transition-transform text-xs md:text-base">
                                            Test <span className="hidden md:inline">Ngay</span> <ArrowRight size={14} className="md:w-5 md:h-5" />
                                        </div>
                                    </div>
                                </motion.a>
                            ) : (
                                <motion.div
                                    key={test.id}
                                    onClick={() => setActiveTest(test.id as TestType)}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    role="button"
                                    className="group bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-500 h-full flex flex-col items-center text-center w-full cursor-pointer"
                                >
                                    <div className="text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                                        {test.title.split(" ")[0]}
                                    </div>
                                    <h2 className="text-sm md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 md:mb-2 line-clamp-1">
                                        {test.title.split(" ").slice(1).join(" ")}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500 flex-grow hidden md:block">{test.desc}</p>
                                    <div className="mt-2 md:mt-4">
                                        <div className="flex items-center gap-1 md:gap-2 text-blue-600 font-bold group-hover:translate-x-1 transition-transform text-xs md:text-base">
                                            Test <span className="hidden md:inline">Ngay</span> <ArrowRight size={14} className="md:w-5 md:h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </motion.div>

                    {/* Information Sections Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Location Info */}
                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-md h-full"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                                📍 Test Laptop Tại Cần Thơ
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                LapLap cung cấp công cụ test laptop miễn phí, hoàn toàn online, phục vụ khách hàng tại Cần Thơ và toàn quốc.
                                Không cần cài đặt phần mềm, chỉ cần trình duyệt web là có thể kiểm tra ngay.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-500 font-bold">✓</span> Miễn phí 100%
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-500 font-bold">✓</span> Nhanh chóng
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-500 font-bold">✓</span> Chính xác
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-500 font-bold">✓</span> An toàn
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Guide Info */}
                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-md h-full"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                                ℹ️ Hướng dẫn sử dụng
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                                    <span>Chọn công cụ test bạn muốn kiểm tra từ danh sách trên.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                                    <span>Cho phép truy cập thiết bị (camera, micro) khi trình duyệt yêu cầu.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                                    <span>Làm theo hướng dẫn trên màn hình để hoàn thành bài test.</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* FAQ Section */}
                    <motion.div
                        className="bg-white rounded-xl p-8 shadow-md"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                            ❓ Câu Hỏi Thường Gặp & Kiến Thức Test Laptop
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Tại sao nên test laptop trước khi mua?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Sử dụng <strong>công cụ test laptop</strong> giúp phát hiện các lỗi phần cứng tiềm ẩn như camera bị mờ, micro không thu âm, loa rè, hoặc màn hình bị điểm chết (dead pixel). Đặc biệt khi mua <strong>laptop cũ Cần Thơ</strong>, việc kiểm tra kỹ lưỡng giúp bạn tránh mua phải máy lỗi.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Các công cụ kiểm tra laptop online có chính xác không?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Hệ thống <strong>kiểm tra laptop online</strong> của chúng tôi sử dụng công nghệ Web API chuẩn, cho kết quả chính xác 100% đối với các bài kiểm tra ngoại vi như: <strong>test bàn phím online</strong>, test cam, test mic và loa.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Làm thế nào để test màn hình laptop chuyên sâu?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Bạn có thể sử dụng bài <strong>test màn hình</strong> trên website của LapLap để kiểm tra hở sáng và điểm chết bằng cách chuyển đổi qua các màu nền đơn sắc (trắng, đen, đỏ, xanh). Đây là cách nhanh nhất để đánh giá chất lượng tấm nền.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Cần chuẩn bị gì khi test máy?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Chỉ cần một trình duyệt web ổn định và cấp quyền truy cập thiết bị khi được hỏi. LapLap cam kết bảo mật thông tin, chúng tôi không lưu trữ bất kỳ hình ảnh hay âm thanh nào từ thiết bị của bạn.</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100 italic text-gray-500 text-sm">
                            <p>Từ khóa tìm kiếm phổ biến: test laptop, công cụ test laptop online, kiểm tra laptop cũ cần thơ, test bàn phím, test camera, test màn hình.</p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
