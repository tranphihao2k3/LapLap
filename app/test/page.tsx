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
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            🔧 Test Laptop Cần Thơ - Kiểm Tra Laptop Miễn Phí
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 text-lg mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Công cụ test laptop online chuyên nghiệp tại Cần Thơ
                        </motion.p>
                        <motion.p
                            className="text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Kiểm tra toàn diện camera, micro, loa, màn hình, bàn phím laptop
                        </motion.p>
                    </div>

                    {/* Test Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
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
                                    <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                        Bắt đầu test →
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
                                    <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                        Bắt đầu test →
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
