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
            <Head>
                <title>Test Laptop Cần Thơ - Kiểm Tra Laptop Miễn Phí Online | LapLap</title>
                <meta name="description" content="Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, micro, loa, màn hình, bàn phím laptop online. Dịch vụ test laptop chuyên nghiệp, nhanh chóng, chính xác." />
                <meta name="keywords" content="test laptop, test laptop cần thơ, kiểm tra laptop, test camera laptop, test màn hình laptop, test bàn phím, test micro laptop, test loa laptop, công cụ test laptop" />
                <meta name="author" content="LapLap" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* Open Graph */}
                <meta property="og:title" content="Test Laptop Cần Thơ - Kiểm Tra Laptop Miễn Phí" />
                <meta property="og:description" content="Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, micro, loa, màn hình, bàn phím laptop online." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://laplapcantho.store/test" />
                <meta property="og:locale" content="vi_VN" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://laplapcantho.store/test" />
            </Head>
            <Header />

            {/* Hero Section - Full Width */}
            <section className="relative w-full min-h-[350px] md:h-[400px] bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-lg border-b border-indigo-400/30 py-12 md:py-0">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 h-full relative z-10 flex items-center justify-between">
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
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
                                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 h-full flex flex-col items-center text-center cursor-pointer"
                                >
                                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                        {test.title.split(" ")[0]}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {test.title.split(" ").slice(1).join(" ")}
                                    </h2>
                                    <p className="text-gray-600 flex-grow">{test.desc}</p>
                                    <div className="mt-4">
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 group-hover:translate-x-2 transition-transform"
                                            rightIcon={<ArrowRight size={18} />}
                                        >
                                            Bắt đầu test
                                        </Button>
                                    </div>
                                </motion.a>
                            ) : (
                                <motion.button
                                    key={test.id}
                                    onClick={() => setActiveTest(test.id as TestType)}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 h-full flex flex-col items-center text-center w-full"
                                >
                                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                        {test.title.split(" ")[0]}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {test.title.split(" ").slice(1).join(" ")}
                                    </h2>
                                    <p className="text-gray-600 flex-grow">{test.desc}</p>
                                    <div className="mt-4">
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 group-hover:translate-x-2 transition-transform"
                                            rightIcon={<ArrowRight size={18} />}
                                        >
                                            Bắt đầu test
                                        </Button>
                                    </div>
                                </motion.button>
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
                            ❓ Câu Hỏi Thường Gặp
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Tại sao nên test laptop trước khi mua?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Test laptop giúp phát hiện lỗi phần cứng như camera hỏng, loa rè, màn hình lỗi pixel, bàn phím không nhạy. Đặc biệt quan trọng khi mua laptop cũ.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Công cụ test laptop có miễn phí không?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Hoàn toàn miễn phí! Bạn chỉ cần truy cập website và bắt đầu test ngay, không cần đăng ký tài khoản hay thanh toán.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Độ chính xác thế nào?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Công cụ sử dụng công nghệ web chuẩn HTML5, cho kết quả chính xác tương đương phần mềm chuyên dụng.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Cần chuẩn bị gì?</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">Chỉ cần laptop có kết nối internet và trình duyệt web (Chrome, Edge, Firefox, Safari) là đủ.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
