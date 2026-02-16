"use client";

import { motion, Variants } from "framer-motion";
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
            id: 'power',
            icon: Zap,
            title: "Lỗi Nguồn",
            description: "Máy không lên nguồn, máy tự động tắt, sạc không vào điện hoặc bị chập chờn."
        },
        {
            id: 'screen',
            icon: MonitorOff,
            title: "Lỗi Màn Hình",
            description: "Màn hình bị sọc, nhòe màu, có điểm chết hoặc không hiển thị (màn hình đen)."
        },
        {
            id: 'keyboard',
            icon: Settings,
            title: "Lỗi Bàn Phím/Chuột",
            description: "Bàn phím bị liệt nút, kẹt phím, nhảy chữ hoặc Touchpad không nhận."
        },
        {
            id: 'hardware',
            icon: HardDrive,
            title: "Lỗi Phần Cứng",
            description: "Hư hỏng ổ cứng, RAM không nhận, quạt tản nhiệt kêu to hoặc bị gãy bản lề."
        },
        {
            id: 'connection',
            icon: WifiOff,
            title: "Lỗi Kết Nối",
            description: "Không bắt được Wifi, lỗi Bluetooth, hỏng cổng USB hoặc cổng HDMI."
        },
        {
            id: 'software',
            icon: Stethoscope,
            title: "Lỗi Phần Mềm",
            description: "Máy bị nhiễm Virus, lỗi Windows, đứng máy khi mở ứng dụng nặng."
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <section className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 border-l-4 border-blue-600 pl-4 mb-10 text-gray-800">
                <AlertTriangle className="text-red-500 w-6 h-6 md:w-8 md:h-8" /> Các lỗi Laptop thường gặp cần xử lý ngay
            </h2>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {errors.map((error, index) => {
                    const CardIcon = error.icon;
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`group relative p-6 bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden
                                ${error.id === 'power' ? 'hover:border-yellow-400 hover:shadow-yellow-100' : ''}
                                ${error.id === 'screen' ? 'hover:border-blue-400 hover:shadow-blue-100' : ''}
                                ${error.id === 'keyboard' ? 'hover:border-slate-400 hover:shadow-slate-100' : ''}
                                ${error.id === 'hardware' ? 'hover:border-orange-400 hover:shadow-orange-100' : ''}
                                ${error.id === 'connection' ? 'hover:border-green-400 hover:shadow-green-100' : ''}
                                ${error.id === 'software' ? 'hover:border-purple-400 hover:shadow-purple-100' : ''}
                                border-slate-200
                            `}
                            whileHover={{ y: -5 }}
                        >
                            {/* Decorative Background Blob */}
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500
                                ${error.id === 'power' ? 'bg-yellow-500' : ''}
                                ${error.id === 'screen' ? 'bg-blue-500' : ''}
                                ${error.id === 'keyboard' ? 'bg-slate-500' : ''}
                                ${error.id === 'hardware' ? 'bg-orange-500' : ''}
                                ${error.id === 'connection' ? 'bg-green-500' : ''}
                                ${error.id === 'software' ? 'bg-purple-500' : ''}
                            `}></div>

                            <div className="flex items-start gap-4 relaltive z-10">
                                <div className={`p-3 rounded-xl flex-shrink-0 transition-colors duration-300
                                    ${error.id === 'power' ? 'bg-yellow-50 overflow-hidden' : ''}
                                    ${error.id === 'screen' ? 'bg-blue-50' : ''}
                                    ${error.id === 'keyboard' ? 'bg-slate-50' : ''}
                                    ${error.id === 'hardware' ? 'bg-orange-50' : ''}
                                    ${error.id === 'connection' ? 'bg-green-50' : ''}
                                    ${error.id === 'software' ? 'bg-purple-50' : ''}
                                `}>
                                    <motion.div
                                        className={`
                                            ${error.id === 'power' ? 'text-yellow-600' : ''}
                                            ${error.id === 'screen' ? 'text-blue-600' : ''}
                                            ${error.id === 'keyboard' ? 'text-slate-600' : ''}
                                            ${error.id === 'hardware' ? 'text-orange-600' : ''}
                                            ${error.id === 'connection' ? 'text-green-600' : ''}
                                            ${error.id === 'software' ? 'text-purple-600' : ''}
                                        `}
                                        variants={{
                                            hover: {
                                                opacity: error.id === 'power' ? [1, 0.4, 1, 0.4, 1] : 1, // Flicker
                                                x: error.id === 'screen' ? [0, -2, 2, -2, 2, 0] : 0, // Glitch shake
                                                y: error.id === 'keyboard' ? [0, 2, 0, 2, 0] : 0, // Typing press
                                                rotate: error.id === 'hardware' ? [0, -10, 10, -10, 10, 0] : // Mechanical shake
                                                    error.id === 'software' ? [0, 360] : 0, // Spin
                                                scale: error.id === 'connection' ? [1, 1.2, 1] : 1, // Pulse
                                            }
                                        }}
                                        transition={{
                                            duration: error.id === 'software' ? 2 : 0.5,
                                            repeat: error.id === 'software' ? Infinity : 0,
                                            ease: "easeInOut"
                                        }}
                                        whileHover="hover"
                                    >
                                        <CardIcon size={32} />
                                    </motion.div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-bold mb-2 uppercase transition-colors duration-300
                                        ${error.id === 'power' ? 'group-hover:text-yellow-600' : ''}
                                        ${error.id === 'screen' ? 'group-hover:text-blue-600' : ''}
                                        ${error.id === 'keyboard' ? 'group-hover:text-slate-600' : ''}
                                        ${error.id === 'hardware' ? 'group-hover:text-orange-600' : ''}
                                        ${error.id === 'connection' ? 'group-hover:text-green-600' : ''}
                                        ${error.id === 'software' ? 'group-hover:text-purple-600' : ''}
                                        text-gray-800
                                    `}>
                                        {error.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {error.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
