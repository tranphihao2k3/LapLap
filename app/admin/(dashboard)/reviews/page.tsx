"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Star, MessageSquare, Check, X, Trash } from "lucide-react";

interface Review {
    _id: string;
    productId: {
        id: string;
        name: string;
    } | null;
    userName: string;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reviews?status=${filter}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch("/api/admin/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId: id, status }),
            });
            fetchReviews();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="text-blue-600" /> Quản lý Đánh giá
            </h1>

            {/* Filters */}
            <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filter === status
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-600 border hover:bg-gray-50"
                            }`}
                    >
                        {status === "all" ? "Tất cả" : status === "pending" ? "Chờ duyệt" : status === "approved" ? "Đã duyệt" : "Đã hủy"}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
                        <tr>
                            <th className="p-4">Sản phẩm</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Đánh giá</th>
                            <th className="p-4">Nội dung</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">Đang tải...</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">Không có đánh giá nào.</td></tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm font-medium text-gray-800 line-clamp-2 max-w-[200px]">
                                        {review.productId?.name || "Sản phẩm đã xóa"}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="font-bold text-gray-700">{review.userName}</div>
                                        <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={review.comment}>
                                        {review.comment}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${review.status === "approved" ? "bg-green-100 text-green-700" :
                                                review.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        {review.status === "pending" && (
                                            <>
                                                <button onClick={() => updateStatus(review._id, "approved")} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Duyệt">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => updateStatus(review._id, "rejected")} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Từ chối">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
                                        {review.status !== "pending" && (
                                            <button onClick={() => updateStatus(review._id, "pending")} className="text-xs text-blue-600 hover:underline">
                                                Đặt lại
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
