"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Facebook, MessageCircle } from "lucide-react";

export default function ServiceCommitment() {
    return (
        <section className="flex flex-col md:flex-row gap-8 items-center bg-[var(--color-secondary)] p-8 rounded-xl text-white shadow-xl overflow-hidden">
            <motion.div
                className="flex-1 space-y-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold">Cam kết dịch vụ từ LapLap</h2>
                <ul className="space-y-4">
                    {[
                        "Sửa đúng bệnh, báo đúng giá.",
                        "Linh kiện thay thế chuẩn, bảo hành dài hạn.",
                        "Bảo mật dữ liệu khách hàng tuyệt đối.",
                        "Sửa chữa lấy liền với các lỗi đơn giản."
                    ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <ShieldCheck className="text-green-400 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                className="w-full md:w-auto flex flex-col gap-4 min-w-[280px]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <div className="text-center mb-1">
                    <p className="text-sm font-medium text-white/90">Bạn đang gặp sự cố?</p>
                    <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-wide drop-shadow-sm animate-pulse">
                        Kiểm tra lỗi miễn phí
                    </h3>
                    <p className="text-xs text-white/70 italic">* Không sửa không thu phí</p>
                </div>

                <a
                    href="https://facebook.com/profile.php?id=61582947329036"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#1877F2] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-bold group"
                >
                    <Facebook className="w-6 h-6 group-hover:animate-bounce" />
                    <span>Chat Facebook</span>
                </a>

                <a
                    href="https://zalo.me/0978648720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3.5 bg-white text-[#0068FF] rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-bold border-2 border-white hover:bg-gray-50"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span>Chat Zalo: 0978.648.720</span>
                </a>
            </motion.div>
        </section>
    );
}
