"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Facebook, MessageCircle } from "lucide-react";

export default function ServiceCommitment() {
    return (
        <section className="relative overflow-hidden bg-[#0f172a] rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10 group">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent)] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                {/* Left: Commitments */}
                <motion.div
                    className="flex-1 space-y-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            Cam Kết Vàng
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                            Dịch vụ từ tâm, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Uy tín tới cùng
                            </span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { text: "Sửa đúng bệnh, báo đúng giá", color: "text-blue-400" },
                            { text: "Linh kiện thay thế chính hãng", color: "text-indigo-400" },
                            { text: "Bảo mật dữ liệu tuyệt đối", color: "text-cyan-400" },
                            { text: "Sửa chữa lấy liền nhanh chóng", color: "text-sky-400" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-lg ${item.color.replace('text', 'bg')}/10 flex items-center justify-center shrink-0`}>
                                    <ShieldCheck className={item.color} size={18} />
                                </div>
                                <span className="text-sm font-medium text-gray-300">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: CTA */}
                <motion.div
                    className="w-full md:w-auto min-w-[320px] p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center mb-6">
                        <p className="text-blue-400 font-bold text-sm mb-1">Cần hỗ trợ gấp?</p>
                        <h3 className="text-2xl font-black text-white uppercase mb-2">
                            Kiểm Tra Lỗi <span className="text-yellow-400">Miễn Phí</span>
                        </h3>
                        <p className="text-xs text-gray-400">Không sửa, không mất bất kỳ chi phí nào</p>
                    </div>

                    <div className="space-y-3">
                        <a
                            href="https://facebook.com/profile.php?id=61582947329036"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-bold group"
                        >
                            <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Nhắn Facebook</span>
                        </a>

                        <a
                            href="https://zalo.me/0978648720"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-2xl shadow-lg transition-all font-bold"
                        >
                            <MessageCircle size={20} />
                            <span>Zalo: 0978.648.720</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
