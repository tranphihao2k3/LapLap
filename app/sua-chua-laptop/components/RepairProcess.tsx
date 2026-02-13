"use client";

import { motion } from "framer-motion";

export default function RepairProcess() {
    const steps = [
        {
            id: 1,
            title: "Tiếp nhận",
            desc: "Kiểm tra tình trạng máy và ghi nhận yêu cầu.",
        },
        {
            id: 2,
            title: "Báo giá",
            desc: "Xác định lỗi, đề xuất giải pháp và báo giá rõ ràng.",
        },
        {
            id: 3,
            title: "Sửa chữa",
            desc: "Tiến hành sửa chữa dưới sự giám sát nếu khách cần.",
        },
        {
            id: 4,
            title: "Bàn giao",
            desc: "Khách kiểm tra lại máy, dán tem bảo hành và thanh toán.",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        },
    };

    return (
        <section className="bg-sky-50 rounded-2xl p-8 mb-16 border border-sky-200 overflow-hidden">
            <h2 className="text-xl font-bold text-[var(--color-secondary)] text-center mb-10 uppercase">
                Quy trình sửa chữa minh bạch tại LapLap
            </h2>

            <motion.div
                className="grid md:grid-cols-4 gap-8 text-center relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Connecting Line (Desktop only) */}
                <div className="hidden md:block absolute top-[24px] left-[12.5%] right-[12.5%] h-0.5 bg-gray-300 -z-0" />

                {steps.map((step) => (
                    <motion.div
                        key={step.id}
                        className="space-y-4 relative z-10"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="w-14 h-14 bg-[#1e4275] text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg shadow-lg"
                            whileHover={{ scale: 1.2, backgroundColor: "#2563eb" }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {step.id}
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-lg text-[#1e4275]">{step.title}</h4>
                            <p className="text-sm text-slate-600 mt-1 px-2">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
