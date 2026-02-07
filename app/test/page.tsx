"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CameraTest from "./components/CameraTest";
import MicTest from "./components/MicTest";
import SpeakerTest from "./components/SpeakerTest";
import ScreenTest from "./components/ScreenTest";

type TestType = "camera" | "mic" | "speaker" | "screen";

export default function UnifiedTestPage() {
    const [activeTest, setActiveTest] = useState<TestType | null>(null);

    const tests = [
        { id: "camera" as TestType, title: "📷 Camera", desc: "Kiểm tra camera" },
        { id: "mic" as TestType, title: "🎙️ Microphone", desc: "Kiểm tra micro" },
        { id: "speaker" as TestType, title: "🔊 Loa", desc: "Kiểm tra loa/âm thanh" },
        { id: "screen" as TestType, title: "🖥️ Màn hình", desc: "Kiểm tra màn hình" },
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
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            🔧 Công cụ Test Laptop
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Kiểm tra toàn diện các thiết bị của laptop
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

                    {/* Info */}
                    <div className="mt-12 bg-white rounded-xl p-6 shadow-md">
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
