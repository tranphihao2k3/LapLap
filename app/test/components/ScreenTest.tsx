"use client";

import { useEffect, useState } from "react";

const testColors = [
    { name: "White", color: "#FFFFFF" },
    { name: "Black", color: "#000000" },
    { name: "Red", color: "#FF0000" },
    { name: "Green", color: "#00FF00" },
    { name: "Blue", color: "#0000FF" },
    { name: "Gray", color: "#808080" },
];

export default function ScreenTest({ onBack }: { onBack: () => void }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        document.documentElement.requestFullscreen?.();

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") exit();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const next = () =>
        setIndex((i) => (i + 1) % testColors.length);

    const prev = () =>
        setIndex((i) => (i === 0 ? testColors.length - 1 : i - 1));

    const exit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        }
        onBack();
    };

    return (
        <div
            className="fixed inset-0 w-screen h-screen cursor-pointer select-none z-50"
            style={{ background: testColors[index].color }}
            onClick={next}
        >
            {/* Nút quay lại */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    exit();
                }}
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full
                   bg-black/30 text-white text-sm
                   opacity-40 hover:opacity-100
                   transition font-medium border border-white/20"
            >
                ← Quay lại
            </button>

            {/* Thông tin màu */}
            <div className="absolute bottom-6 right-6 text-gray-400 text-sm bg-black/50 px-3 py-1 rounded-full">
                {testColors[index].name} ({index + 1}/{testColors.length})
            </div>

            {/* Hướng dẫn */}
            <div className="absolute bottom-6 left-6 text-gray-400 text-sm bg-black/50 px-3 py-1 rounded-full opacity-50 hover:opacity-100 transition-opacity">
                Click hoặc nhấn mũi tên để đổi màu • ESC để thoát
            </div>
        </div>
    );
}
