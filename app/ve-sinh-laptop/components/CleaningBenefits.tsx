"use client";

import { motion } from "framer-motion";
import { Gift, CheckCircle2 } from "lucide-react";

export default function CleaningBenefits() {
    const benefits = [
        { text: "Miễn phí kiểm tra tình trạng laptop" },
        { text: "Tư vấn nâng cấp SSD – RAM phù hợp" },
        { text: "Bảo hành keo tản nhiệt theo gói" },
        { text: "Giảm 10% cho học sinh – sinh viên", highlight: true },
    ];

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.section
            className="bg-[var(--color-secondary)] rounded-2xl p-8 text-white shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <h2 className="text-xl font-bold flex items-center gap-3 justify-center mb-8">
                <Gift className="text-yellow-400 animate-pulse" />
                Ưu đãi khi vệ sinh laptop tại LapLap Cần Thơ
            </h2>

            <ul className="grid md:grid-cols-2 gap-5">
                {benefits.map((benefit, idx) => (
                    <motion.li
                        key={idx}
                        variants={itemVariants}
                        className={`flex items-center gap-3 ${benefit.highlight ? "font-bold text-yellow-300" : ""}`}
                    >
                        <CheckCircle2 className="text-green-400 flex-shrink-0" />
                        {benefit.text}
                    </motion.li>
                ))}
            </ul>
        </motion.section>
    );
}
