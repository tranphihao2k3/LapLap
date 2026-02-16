'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, HardDrive, Monitor, CheckCircle, Upload, ArrowRight, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';

export default function TradeInPage() {
    const [formData, setFormData] = useState({
        model: '',
        cpu: '',
        ram: '',
        ssd: '',
        gpu: '',
        condition: '99',
        battery: '',
        notes: '',
        contact: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `
🔔 **YÊU CẦU ĐỊNH GIÁ THU CŨ**
--------------------------------
💻 **Máy**: ${formData.model}
⚙️ **Cấu hình**: ${formData.cpu} | ${formData.ram} | ${formData.ssd} | ${formData.gpu}
🔋 **Pin**: ${formData.battery}
✨ **Ngoại hình**: ${formData.condition}%
📝 **Ghi chú**: ${formData.notes}
📞 **Liên hệ**: ${formData.contact}
--------------------------------
Mong LapLap báo giá sớm ạ!
        `.trim();

        navigator.clipboard.writeText(message);
        alert('Đã sao chép thông tin! Vui lòng gửi cho Shop qua Zalo hoặc Messenger để được báo giá nhanh nhất.');
        window.open('https://zalo.me/0978648720', '_blank');
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 ">
            <Header />

            {/* Hero Section - Compact & Illustrated */}
            <section className="relative w-full min-h-[300px] md:h-[320px] bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-md py-12 md:py-0">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-400/30 text-blue-100"
                        >
                            Chương Trình Đặc Biệt
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-bold mb-3 leading-tight"
                        >
                            Thu Cũ Đổi Mới <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Lên Đời Siêu Phẩm</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm md:text-lg text-blue-100 max-w-lg mx-auto md:mx-0"
                        >
                            Trợ giá lên đến <span className="font-bold text-yellow-300">2.000.000đ</span>. Định giá chỉ trong 15 phút.
                        </motion.p>
                    </div>

                    {/* Right: Illustrative Graphics (Desktop Only) */}
                    <div className="hidden md:flex w-1/2 items-center justify-center relative">
                        {/* Old Laptop */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative z-10"
                        >
                            <div className="w-24 h-16 bg-gray-700 rounded-md transform rotate-[-10deg] border-2 border-gray-600 shadow-xl flex items-center justify-center">
                                <span className="text-gray-400 text-xs font-mono">OLD</span>
                            </div>
                            <div className="w-32 h-2 bg-gray-800 rounded-b-md transform rotate-[-10deg] -mt-1 ml-1 opacity-80"></div>
                        </motion.div>

                        {/* Exchange Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="mx-4 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-glow"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 animate-spin-slow">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 21h5v-5" />
                            </svg>
                        </motion.div>

                        {/* New Laptop */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative z-10"
                        >
                            <div className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-[5deg] shadow-2xl flex items-center justify-center border border-white/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 transform -skew-x-12 -translate-x-full"></div>
                                <span className="text-white font-bold text-sm tracking-widest">NEW</span>
                            </div>
                            <div className="w-40 h-2 bg-gray-800 rounded-b-lg transform rotate-[5deg] -mt-1 -ml-2 opacity-90"></div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                            >
                                +2 Triệu
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <main className="container mx-auto max-w-5xl px-4 py-12 space-y-8">

                {/* Step 1: Hardware Check - Compact */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">1</div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Kiểm Tra Phần Cứng</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Kiểm tra sơ bộ màn hình, loa, phím để định giá chính xác.
                            </p>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm md:text-base">
                                        <Monitor size={18} />
                                        Test Màn hình, Loa, Phím
                                    </h3>
                                </div>
                                <Button
                                    href="/test"
                                    variant="primary"
                                    size="sm"
                                    rightIcon={<ArrowRight size={14} />}
                                >
                                    Test Ngay
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="p-2 bg-green-100 text-green-600 rounded-md">
                                    <Battery size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-gray-800 text-sm">Check Pin</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <a href="/software/BatteryMon.exe" download className="text-xs text-green-600 font-semibold hover:underline flex items-center gap-1">
                                            Tải BatteryMon <Upload size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-md">
                                    <HardDrive size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">Check HDD/SSD</h4>
                                    <a href="/software/hdsentinel_setup.zip" download className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-1">
                                        Tải HDSentinel <Upload size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Step 2: Grading Scale - Compact Grid */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">2</div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Chọn Tình Trạng Máy</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { id: '99', color: 'green', title: 'Loại 1 (99%)', desc: 'Máy đẹp keng, không trầy xước.' },
                            { id: '98', color: 'blue', title: 'Loại 2 (98%)', desc: 'Màn đẹp, xước dăm rất nhẹ.' },
                            { id: '95', color: 'orange', title: 'Loại 3 (95%)', desc: 'Trầy xước rõ, cấn nhẹ.' },
                            { id: '90', color: 'red', title: 'Loại 4 (90%)', desc: 'Cấn móp, xấu, màn ám/đốm.' }
                        ].map((option) => (
                            <div
                                key={option.id}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition-all flex items-center justify-between ${formData.condition === option.id ? `border-${option.color}-500 bg-${option.color}-50` : `border-gray-200 hover:border-${option.color}-300`}`}
                                onClick={() => setFormData({ ...formData, condition: option.id })}
                            >
                                <div>
                                    <h3 className={`text-base font-bold text-${option.color}-700`}>{option.title}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                                </div>
                                {formData.condition === option.id && <CheckCircle className={`text-${option.color}-500`} size={20} />}
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Step 3: Submission Form - Compact */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Gửi Thông Tin</h2>
                            <p className="text-sm text-gray-500">Nhận báo giá ngay sau 15 phút</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Tên máy</label>
                                    <input required name="model" value={formData.model} onChange={handleChange} type="text" placeholder="VD: Dell XPS..." className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">SĐT / Zalo</label>
                                    <input required name="contact" value={formData.contact} onChange={handleChange} type="text" placeholder="VD: 09..." className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {['CPU', 'RAM', 'SSD', 'VGA'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">{field}</label>
                                        <input
                                            name={field.toLowerCase()}
                                            value={(formData as any)[field.toLowerCase() === 'vga' ? 'gpu' : field.toLowerCase()]}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Tình trạng Pin / Màn hình</label>
                                <input name="battery" value={formData.battery} onChange={handleChange} type="text" placeholder="VD: Pin chai 5%, Màn đẹp..." className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Ghi chú</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"></textarea>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                leftIcon={<Smartphone size={18} />}
                            >
                                Gửi Báo Giá Qua Zalo
                            </Button>
                        </form>
                    </div>
                </motion.section>

            </main>

            <Footer />
        </div>
    );
}
