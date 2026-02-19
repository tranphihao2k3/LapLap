"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button"; // Check the path, might be ./ui/Button.tsx
import { Star, MessageSquare } from "lucide-react";
import Image from "next/image";

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

interface ProductReviewsProps {
    productId?: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
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

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const url = productId
                ? `/api/reviews?productId=${productId}`
                : `/api/reviews?limit=50`; // General reviews: fetch recent 50

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);

                // Calculate local stats
                const total = data.data.reduce((sum: number, r: Review) => sum + r.rating, 0);
                setStats({
                    average: data.data.length ? (total / data.data.length) : 0,
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
            const payload = { ...formData, productId: productId || null };
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitSuccess(true);
                setShowForm(false);
                setFormData({ userName: "", userPhone: "", rating: 5, comment: "" });
            } else {
                alert(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="text-blue-600" />
                {productId ? "Đánh giá sản phẩm" : "Khách hàng nói về chúng tôi"}
            </h2>

            {/* Stats & Add Button */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start bg-gray-50 p-6 rounded-xl">
                <div className="text-center md:text-left">
                    <div className="text-5xl font-black text-gray-800">{stats.average.toFixed(1)}/5</div>
                    <div className="flex justify-center md:justify-start my-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill={i < Math.round(stats.average) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">Dựa trên {stats.count} đánh giá</div>
                </div>

                <div className="flex-1 w-full text-center md:text-right">
                    <p className="text-gray-600 mb-4">
                        {productId ? "Bạn đã dùng sản phẩm này? Chia sẻ cảm nhận ngay!" : "Bạn hài lòng với dịch vụ tại Laptop Cần Thơ? Hãy để lại đánh giá nhé!"}
                    </p>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Đóng biểu mẫu" : "Viết đánh giá"}
                    </Button>
                </div>
            </div>

            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-center animate-in fade-in slide-in-from-top-2">
                    ✅ Cảm ơn bạn đã đánh giá! Vui lòng chờ kiểm duyệt.
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl animate-in slide-in-from-top-4 border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Họ tên *</label>
                            <input
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                                value={formData.userName}
                                onChange={e => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại (để xác thực)</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                                value={formData.userPhone}
                                onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                                placeholder="Không bắt buộc"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Đánh giá của bạn *</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                >
                                    <Star
                                        size={28}
                                        className={star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nhận xét *</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                            placeholder={productId ? "Sản phẩm dùng tốt không? Giao hàng thế nào?..." : "Dịch vụ, chất lượng máy, nhân viên tư vấn thế nào?..."}
                        ></textarea>
                    </div>

                    <Button type="submit" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                </form>
            )}

            {/* Review List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-gray-800">{review.userName}</div>
                                    <div className="flex text-yellow-400 text-xs mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>

                            {/* Reply Block */}
                            {review.reply && (
                                <div className="mt-3 ml-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                                    <div className="font-bold text-blue-700 text-xs mb-1">Phản hồi từ Laptop Cần Thơ:</div>
                                    <p className="text-gray-700">{review.reply.content}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
