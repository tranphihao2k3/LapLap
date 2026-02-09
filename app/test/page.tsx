"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CameraTest from "./components/CameraTest";
import MicTest from "./components/MicTest";
import SpeakerTest from "./components/SpeakerTest";
import ScreenTest from "./components/ScreenTest";

type TestType = "camera" | "mic" | "speaker" | "screen";

export default function UnifiedTestPage() {
    const [activeTest, setActiveTest] = useState<TestType | null>(null);

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
            "url": "https://laplap.vercel.app/test",
            "priceRange": "Miễn phí",
            "areaServed": "Cần Thơ"
        });
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const tests = [
        { id: "camera" as TestType, title: "📷 Camera", desc: "Kiểm tra camera laptop" },
        { id: "mic" as TestType, title: "🎙️ Microphone", desc: "Kiểm tra micro laptop" },
        { id: "speaker" as TestType, title: "🔊 Loa", desc: "Kiểm tra loa/âm thanh laptop" },
        { id: "screen" as TestType, title: "🖥️ Màn hình", desc: "Kiểm tra màn hình laptop" },
    ];

    if (activeTest) {
        return (
            <div className="min-h-screen bg-white">
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
                <meta property="og:url" content="https://laplap.vercel.app/test" />
                <meta property="og:locale" content="vi_VN" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://laplap.vercel.app/test" />
            </Head>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            🔧 Test Laptop Cần Thơ - Kiểm Tra Laptop Miễn Phí
                        </h1>
                        <p className="text-gray-600 text-lg mb-2">
                            Công cụ test laptop online chuyên nghiệp tại Cần Thơ
                        </p>
                        <p className="text-gray-500">
                            Kiểm tra toàn diện camera, micro, loa, màn hình, bàn phím laptop
                        </p>
                    </div>

                    {/* Test Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tests.map((test) => (
                            <button
                                key={test.id}
                                onClick={() => setActiveTest(test.id)}
                                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                    {test.title.split(" ")[0]}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {test.title.split(" ").slice(1).join(" ")}
                                </h2>
                                <p className="text-gray-600">{test.desc}</p>
                                <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                    Bắt đầu test →
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Keyboard Test - Separate Link */}
                    <div className="flex justify-center mt-6">
                        <a
                            href="/test/keyboard"
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500 text-center w-full md:w-96"
                        >
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                ⌨️
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Bàn phím
                            </h2>
                            <p className="text-gray-600">Kiểm tra bàn phím</p>
                            <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                Bắt đầu test →
                            </div>
                        </a>
                    </div>

                    {/* Location Info */}
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
                        <h2 className="font-bold text-xl text-gray-800 mb-3">
                            📍 Test Laptop Tại Cần Thơ
                        </h2>
                        <p className="text-gray-600 mb-4">
                            LapLap cung cấp công cụ test laptop miễn phí, hoàn toàn online, phục vụ khách hàng tại Cần Thơ và toàn quốc.
                            Không cần cài đặt phần mềm, chỉ cần trình duyệt web là có thể kiểm tra laptop ngay lập tức.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <p><strong>✓ Miễn phí 100%</strong> - Không mất phí</p>
                                <p><strong>✓ Nhanh chóng</strong> - Kết quả tức thì</p>
                            </div>
                            <div>
                                <p><strong>✓ Chính xác</strong> - Công nghệ hiện đại</p>
                                <p><strong>✓ An toàn</strong> - Không cài đặt phần mềm</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
                        <h2 className="font-bold text-xl text-gray-800 mb-4">
                            ❓ Câu Hỏi Thường Gặp
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Tại sao nên test laptop trước khi mua?</h3>
                                <p className="text-sm">Test laptop giúp phát hiện lỗi phần cứng như camera hỏng, loa rè, màn hình lỗi pixel, bàn phím không nhạy. Đặc biệt quan trọng khi mua laptop cũ tại Cần Thơ.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Công cụ test laptop có miễn phí không?</h3>
                                <p className="text-sm">Hoàn toàn miễn phí! Bạn chỉ cần truy cập website và bắt đầu test ngay, không cần đăng ký tài khoản hay thanh toán.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Test laptop ở Cần Thơ có chính xác không?</h3>
                                <p className="text-sm">Công cụ sử dụng công nghệ web hiện đại, cho kết quả chính xác tương đương phần mềm test chuyên dụng. Phù hợp cho cả cá nhân và cửa hàng laptop tại Cần Thơ.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Cần chuẩn bị gì để test laptop?</h3>
                                <p className="text-sm">Chỉ cần laptop có kết nối internet và trình duyệt web (Chrome, Edge, Firefox). Cho phép truy cập camera, micro khi trình duyệt yêu cầu.</p>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
                        <h3 className="font-bold text-lg text-gray-800 mb-3">
                            ℹ️ Hướng dẫn sử dụng
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>✅ Chọn công cụ test bạn muốn kiểm tra</li>
                            <li>✅ Cho phép truy cập thiết bị khi trình duyệt yêu cầu</li>
                            <li>✅ Làm theo hướng dẫn trên màn hình</li>
                            <li>✅ Nhấn "Quay lại" để chọn test khác</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
