"use client";

import { motion } from "framer-motion";
import {
    AlertTriangle,
    Zap,
    MonitorOff,
    Settings,
    HardDrive,
    WifiOff,
    Stethoscope
} from "lucide-react";

export default function CommonErrors() {
    const errors = [
        {
            icon: <Zap size={32} />,
            title: "Lỗi Nguồn",
            description: "Máy không lên nguồn, máy tự động tắt, sạc không vào điện hoặc bị chập chờn."
        },
        {
            icon: <MonitorOff size={32} />,
            title: "Lỗi Màn Hình",
            description: "Màn hình bị sọc, nhòe màu, có điểm chết hoặc không hiển thị (màn hình đen)."
        },
        {
            icon: <Settings size={32} />,
            title: "Lỗi Bàn Phím/Chuột",
            description: "Bàn phím bị liệt nút, kẹt phím, nhảy chữ hoặc Touchpad không nhận."
        },
        {
            icon: <HardDrive size={32} />,
            title: "Lỗi Phần Cứng",
            description: "Hư hỏng ổ cứng, RAM không nhận, quạt tản nhiệt kêu to hoặc bị gãy bản lề."
        },
        {
            icon: <WifiOff size={32} />,
            title: "Lỗi Kết Nối",
            description: "Không bắt được Wifi, lỗi Bluetooth, hỏng cổng USB hoặc cổng HDMI."
        },
        {
            icon: <Stethoscope size={32} />,
            title: "Lỗi Phần Mềm",
            description: "Máy bị nhiễm Virus, lỗi Windows, đứng máy khi mở ứng dụng nặng."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <section className="mb-16">
            <h2 className="text-xl font-bold flex items-center gap-2 border-l-4 border-[var(--color-secondary)] pl-3 mb-8">
                <AlertTriangle className="text-red-500" /> Các lỗi Laptop thường gặp cần xử lý ngay
            </h2>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {errors.map((error, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="p-6 border-2 border-slate-100 rounded-2xl hover:border-[#1e4275] transition-all group hover:shadow-lg cursor-pointer bg-white"
                        whileHover={{ y: -5 }}
                    >
                        <div className="text-[#1e4275] mb-4 group-hover:scale-110 transition-transform">
                            {error.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-[#1e4275] uppercase">{error.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {error.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
