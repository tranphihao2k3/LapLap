'use client';

import { motion, Variants } from 'framer-motion';
import { Briefcase, Clock, DollarSign, CheckCircle, AlertTriangle, ChevronRight, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function RecruitmentClient() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Hero Section */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-blue-100 border border-white/20 text-sm font-semibold tracking-wider mb-4">TUYỂN DỤNG</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Gia nhập đội ngũ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">LapLap</span></motion.h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">Cùng nhau kiến tạo những giá trị công nghệ đích thực và phát triển sự nghiệp của bạn.</p>
                </div>
            </section>

            {/* PAUSE NOTIFICATION */}
            <section className="relative -mt-8 z-20 container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-l-4 border-orange-500 rounded-r-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0 bg-orange-100 p-4 rounded-full text-orange-600 animate-pulse"><AlertTriangle size={32} /></div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Thông báo tạm ngưng tuyển dụng</h3>
                        <p className="text-slate-600">Hiện tại LapLap <strong>đã tuyển đủ nhân sự</strong>. Tuy nhiên chúng tôi luôn lưu trữ hồ sơ tiềm năng.</p>
                    </div>
                </motion.div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <JobCard title="Kỹ thuật viên Sửa chữa Laptop" type="Toàn thời gian" salary="8 - 15 triệu" tags={["Phần cứng", "Phần mềm"]} requirements={["KN sửa chữa phần cứng > 1 năm", "Thành thạo tháo lắp", "Trung thực"]} />
                        <JobCard title="Nhân viên Tư vấn Bán hàng" type="Xoay ca" salary="6 - 12 triệu" tags={["Kinh doanh", "CSKH"]} requirements={["Giao tiếp tốt", "Yêu thích công nghệ", "Sẵn sàng học hỏi"]} />
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

function JobCard({ title, type, salary, tags, requirements }: any) {
    return (
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <div className="flex gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1"><Clock size={16} /> {type}</span>
                <span className="flex items-center gap-1"><DollarSign size={16} /> {salary}</span>
            </div>
            <ul className="space-y-2 mb-8">
                {requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ChevronRight size={16} className="text-blue-500 shrink-0" /> {req}</li>
                ))}
            </ul>
            <Button disabled variant="outline" fullWidth>Đã đóng</Button>
        </motion.div>
    );
}
