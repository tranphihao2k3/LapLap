"use client";

import { motion, Variants } from "framer-motion";
import { Wrench } from "lucide-react";

export default function CleaningProcess() {
    const processSteps = [
        {
            index: 1,
            title: "Vệ sinh ngoại quan A – B – C – D",
            description: "Làm sạch toàn bộ vỏ ngoài, bản lề, khe tản nhiệt."
        },
        {
            index: 2,
            title: "Vệ sinh bên trong máy",
            description: "Thổi bụi main, quạt, RAM, SSD – loại bỏ bụi gây nóng."
        },
        {
            index: 3,
            title: "Thay keo tản nhiệt CPU – GPU",
            description: "Giảm 10–25°C, máy mát – bền – chạy ổn định hơn.",
            highlight: true
        },
        {
            index: 4,
            title: "Làm sạch hệ thống tản nhiệt",
            description: "Quạt – ống đồng – khe gió được vệ sinh kỹ."
        },
        {
            index: 5,
            title: "Vệ sinh bàn phím – khe phím",
            description: "Loại bỏ bụi, tóc, mồ hôi – phím nhạy hơn."
        },
        {
            index: 6,
            title: "Test tổng thể & tư vấn miễn phí",
            description: "Kiểm tra nhiệt độ – hiệu năng sau vệ sinh."
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <section>
            <h2 className="text-xl font-bold flex items-center gap-3 mb-10">
                <Wrench className="text-[var(--color-secondary)]" />
                Quy trình vệ sinh laptop chuyên sâu
            </h2>

            <motion.div
                className="grid gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {processSteps.map((step) => (
                    <motion.div
                        key={step.index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className={`flex gap-4 p-5 rounded-xl border transition-all shadow-sm
                        ${step.highlight
                                ? "bg-yellow-50 border-yellow-400"
                                : "bg-white border-gray-100 hover:shadow-md"
                            }`}
                    >
                        <div className="text-[#1e4275] font-black text-xl flex-shrink-0 w-8">
                            {step.index}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{step.title}</h4>
                            <p className="text-slate-600">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
