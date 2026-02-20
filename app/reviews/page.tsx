"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Star, MessageSquare, Quote, Heart, CheckCircle, PenTool, Image as LucideImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    images: string[];
    reply?: {
        content: string;
        repliedAt: string;
    }
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        userPhone: "",
        rating: 5,
        comment: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(9);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?limit=50`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);

                // Calculate stats
                const total = data.data.reduce((sum: number, r: Review) => sum + r.rating, 0);
                setStats({
                    average: data.data.length ? (total / data.data.length) : 5, // Default 5 if empty
                    count: data.data.length
                });
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitSuccess(true);
                setShowForm(false);
                setFormData({ userName: "", userPhone: "", rating: 5, comment: "" });
            } else {
                alert(data.message || "Lỗi khi gửi đánh giá");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi hệ thống");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section - Standardized Height & Style */}
                <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                    {/* Background Patterns */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-blue-100 text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
                                Khách hàng nói gì?
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Niềm Tin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 uppercase">Được Khẳng Định</span>
                            </h1>
                            <p className="text-blue-100 max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-medium">
                                Tại <span className="font-bold">LapLap Cần Thơ</span>, chúng tôi không chỉ bán laptop,
                                mà còn trao gửi sự an tâm. Cảm ơn {stats.count}+ khách hàng đã tin tưởng đồng hành! ❤️
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    onClick={() => setShowForm(true)}
                                    size="lg"
                                    className="shadow-xl"
                                    leftIcon={<PenTool size={18} />}
                                >
                                    Viết đánh giá ngay
                                </Button>
                                <Button
                                    href="/laptops"
                                    variant="white"
                                    size="lg"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    Xem sản phẩm
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* OVERVIEW STATS */}
                <div className="bg-white border-y border-slate-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
                    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-slate-800 flex items-center justify-center gap-2">
                                    {stats.average.toFixed(1)} <Star className="text-yellow-400 fill-current w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Đánh giá trung bình</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-slate-800">
                                    {stats.count}+
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lượt đánh giá</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-slate-800">100%</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Hài lòng</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Review Form Modal/Section */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-12"
                            >
                                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-blue-100 border border-blue-50 max-w-3xl mx-auto relative">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Chia sẻ trải nghiệm của bạn</h3>
                                        <p className="text-slate-500">Đánh giá của bạn giúp chúng tôi phục vụ tốt hơn mỗi ngày!</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="flex justify-center mb-6">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, rating: star })}
                                                        className="focus:outline-none transition-transform active:scale-90 hover:scale-110 p-1"
                                                    >
                                                        <Star
                                                            size={40}
                                                            className={`${star <= formData.rating ? "text-yellow-400 fill-current filter drop-shadow-md" : "text-slate-200"}`}
                                                            strokeWidth={1.5}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Họ tên của bạn *</label>
                                                <input
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                                                    value={formData.userName}
                                                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                                                    placeholder="VD: Nguyễn Văn A"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại (Xác thực)</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                                                    value={formData.userPhone}
                                                    onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                                                    placeholder="VD: 090xxx (Sẽ được ẩn)"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung đánh giá *</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                                                value={formData.comment}
                                                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                                placeholder="Sản phẩm dùng tốt không? Nhân viên tư vấn có nhiệt tình không?..."
                                            ></textarea>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="lg"
                                            className="shadow-xl shadow-blue-200 py-4 text-lg"
                                        >
                                            {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {submitSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 text-green-700 p-6 rounded-2xl mb-12 text-center border border-green-100 shadow-sm max-w-2xl mx-auto"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Cảm ơn bạn đã đánh giá!</h3>
                            <p className="text-green-600">Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt. Chúng tôi trân trọng ý kiến đóng góp của bạn.</p>
                        </motion.div>
                    )}

                    {/* REVIEWS GRID (Masonry-like) */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 h-64 animate-pulse shadow-sm border border-slate-100">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa có đánh giá nào</h3>
                            <p className="text-slate-500 mb-6">Hãy là người đầu tiên chia sẻ cảm nhận về Laptop Cần Thơ!</p>
                            <Button onClick={() => setShowForm(true)} variant="outline">Viết đánh giá đầu tiên</Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                            >
                                {reviews.slice(0, visibleReviews).map((review, idx) => (
                                    <motion.div
                                        key={review._id}
                                        variants={itemVariants}
                                        className="break-inside-avoid bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col relative group"
                                    >
                                        <div className="absolute top-6 right-6 text-slate-200 group-hover:text-blue-100 transition-colors">
                                            <Quote size={40} className="fill-current" />
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shrink-0">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 line-clamp-1 text-sm">{review.userName}</div>
                                                <div className="flex text-yellow-400 text-xs mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 relative z-10">
                                            <p className="text-slate-600 leading-relaxed italic text-sm">
                                                "{review.comment}"
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
                                            <span>{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                                            {review.reply && (
                                                <span className="flex items-center gap-1 text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle size={10} /> Đã trả lời
                                                </span>
                                            )}
                                        </div>

                                        {/* Reply Tooltip/Expand */}
                                        {review.reply && (
                                            <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50 text-sm">
                                                <div className="text-[9px] font-black uppercase text-blue-400 mb-1 flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">L</span>
                                                    Laptop Cần Thơ:
                                                </div>
                                                <p className="text-slate-600 text-xs leading-relaxed">{review.reply.content}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>

                            {visibleReviews < reviews.length && (
                                <div className="text-center pt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setVisibleReviews(prev => prev + 9)}
                                        className="px-8"
                                    >
                                        Xem thêm đánh giá
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CTA BOTTOM */}
                <div className="bg-blue-600 py-16 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h2 className="text-3xl font-black mb-6">Bạn Cần Tư Vấn Thêm?</h2>
                        <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm được sản phẩm ưng ý nhất với ngân sách tốt nhất.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button href="https://zalo.me/0978648720" variant="white" size="lg" className="shadow-xl">Chat Zalo Ngay</Button>
                            <Button href="/laptops" variant="glass" size="lg">Xem Sản Phẩm</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
