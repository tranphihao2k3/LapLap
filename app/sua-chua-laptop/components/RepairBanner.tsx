"use client";

import { motion } from "framer-motion";

export default function RepairBanner() {
    return (
        <section className="bg-[var(--color-secondary)] text-white py-10 px-4 text-center overflow-hidden">
            <div className="container mx-auto space-y-3">
                <motion.h1
                    className="text-2xl md:text-3xl font-bold flex flex-col md:flex-row items-center justify-center gap-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span>🛠️</span>
                    <span>Laptop gặp sự cố – Không lên nguồn – Lỗi màn hình?</span>
                </motion.h1>

                <motion.p
                    className="text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Đừng để những hư hỏng nhỏ làm gián đoạn công việc của bạn!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <p className="text-yellow-400 font-bold text-xl uppercase animate-pulse">
                        ⚡ LapLap Cần Thơ: Khắc phục mọi lỗi Laptop – Thay thế linh kiện lấy liền – Bảo hành uy tín.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
