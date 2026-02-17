'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle, AlertTriangle, ChevronRight, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
    }
};

export default function RecruitmentPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 font-sans overflow-hidden">
                {/* HERO SECTION */}
                <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2084&q=80"
                            alt="Recruitment Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-sm font-semibold tracking-wider mb-4 backdrop-blur-md"
                        >
                            TUYỂN DỤNG
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
                        >
                            Gia nhập đội ngũ <span className="text-blue-500">LapLap</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto"
                        >
                            Cùng nhau kiến tạo những giá trị công nghệ đích thực và phát triển sự nghiệp của bạn.
                        </motion.p>
                    </div>
                </section>

                {/* PAUSE NOTIFICATION */}
                <section className="relative -mt-8 z-20 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border-l-4 border-orange-500 rounded-r-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                        <div className="flex-shrink-0 bg-orange-100 p-4 rounded-full text-orange-600 animate-pulse">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Thông báo tạm ngưng tuyển dụng</h3>
                            <p className="text-slate-600">
                                Hiện tại LapLap <strong>đã tuyển đủ nhân sự</strong> cho các vị trí trong quý này.
                                Tuy nhiên, chúng tôi luôn chào đón những hồ sơ tiềm năng cho các đợt tuyển dụng tiếp theo.
                                Bạn vẫn có thể tham khảo mô tả công việc bên dưới và gửi CV để được lưu vào 'Talent Pool'.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg font-medium text-sm">
                                <XCircle size={16} /> Trạng thái: Đóng
                            </span>
                        </div>
                    </motion.div>
                </section>

                {/* JOB LISTINGS */}
                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-3xl font-black text-slate-900 mb-12 text-center"
                        >
                            Vị trí thường tuyển
                        </motion.h2>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {/* Job 1: Technical */}
                            <JobCard
                                title="Kỹ thuật viên Sửa chữa Laptop"
                                type="Toàn thời gian"
                                salary="8.000.000 - 15.000.000 VNĐ"
                                tags={["Phần cứng", "Phần mềm", "Có kinh nghiệm"]}
                                description="Chịu trách nhiệm kiểm tra, chẩn đoán và sửa chữa các lỗi phần cứng/phần mềm của laptop. Tư vấn giải pháp kỹ thuật tối ưu cho khách hàng."
                                requirements={[
                                    "Kinh nghiệm sửa chữa phần cứng laptop từ 1 năm.",
                                    "Thành thạo tháo lắp, vệ sinh, cài đặt phần mềm/hệ điều hành.",
                                    "Biết đo đạc, sửa chữa mainboard là một lợi thế lớn.",
                                    "Trung thực, cẩn thận và có tinh thần trách nhiệm cao."
                                ]}
                            />

                            {/* Job 2: Sales */}
                            <JobCard
                                title="Nhân viên Tư vấn Bán hàng"
                                type="Xoay ca / Toàn thời gian"
                                salary="6.000.000 - 12.000.000 VNĐ"
                                tags={["Kinh doanh", "CSKH", "Không yêu cầu KN"]}
                                description="Tư vấn, giới thiệu các dòng sản phẩm laptop phù hợp với nhu cầu của khách hàng. Chăm sóc khách hàng và duy trì hình ảnh chuyên nghiệp của showroom."
                                requirements={[
                                    "Ngoại hình ưa nhìn, giọng nói dễ nghe.",
                                    "Yêu thích công nghệ và các sản phẩm điện tử.",
                                    "Kỹ năng giao tiếp tốt, xử lý tình huống linh hoạt.",
                                    "Có kinh nghiệm bán hàng là một lợi thế (sẽ được đào tạo)."
                                ]}
                            />
                        </motion.div>
                    </div>
                </section>

                {/* WHY JOIN US */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl font-black text-slate-900 mb-4"
                            >
                                Tại sao chọn LapLap?
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500"
                            >
                                Môi trường làm việc lý tưởng để phát triển bản thân.
                            </motion.p>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <BenefitItem
                                icon={DollarSign}
                                title="Thu nhập hấp dẫn"
                                desc="Lương cứng + Thưởng doanh số + Thưởng hiệu quả công việc. Review lương định kỳ 6 tháng/lần."
                            />
                            <BenefitItem
                                icon={Briefcase}
                                title="Đào tạo chuyên sâu"
                                desc="Được đào tạo bài bản về kiến thức sản phẩm và kỹ năng mềm từ các chuyên gia trong ngành."
                            />
                            <BenefitItem
                                icon={CheckCircle}
                                title="Môi trường mở"
                                desc="Văn hóa làm việc trẻ trung, năng động, tôn trọng ý kiến cá nhân và khuyến khích sự sáng tạo."
                            />
                        </motion.div>
                    </div>
                </section>

                {/* CTA - PAUSED STATE */}
                <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bạn vẫn muốn ứng tuyển?</h2>
                            <p className="text-slate-500 mb-8">
                                Mặc dù đang tạm ngưng tuyển dụng, chúng tôi vẫn luôn tìm kiếm những mảnh ghép phù hợp cho tương lai.
                                Hãy gửi CV của bạn về email bên dưới, chúng tôi sẽ liên hệ ngay khi có đợt tuyển dụng mới.
                            </p>

                            <div className="inline-flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">Gửi CV về Email</div>
                                <a href="mailto:laplapcantho@gmail.com" className="text-2xl font-black text-blue-600 hover:text-blue-700 transition-colors">
                                    laplapcantho@gmail.com
                                </a>
                                <div className="text-sm text-slate-500">Tiêu đề: [Vị trí ứng tuyển] - [Họ tên]</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}

function JobCard({ title, type, salary, tags, description, requirements }: { title: string, type: string, salary: string, tags: string[], description: string, requirements: string[] }) {
    return (
        <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
            {/* Overlay for paused state - visual cue */}
            <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase border border-slate-200">Đã đóng</span>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1"><Clock size={16} className="text-blue-500" /> {type}</div>
                    <div className="flex items-center gap-1"><DollarSign size={16} className="text-green-500" /> {salary}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-medium border border-slate-100">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="space-y-4 mb-8">
                <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">Mô tả công việc</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">Yêu cầu</h4>
                    <ul className="space-y-2">
                        {requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                <ChevronRight size={16} className="text-blue-500 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Button disabled variant="outline" fullWidth className="opacity-50 cursor-not-allowed group-hover:opacity-75 transition-opacity">
                Đã ngưng nhận hồ sơ
            </Button>
        </motion.div>
    );
}

function BenefitItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <motion.div
            variants={scaleIn}
            className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300 group"
        >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Icon size={32} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
