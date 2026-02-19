"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Search, Loader2, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Customer {
    _id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    totalSpent: number;
    loyaltyPoints: number;
    orders: any[];
    tags: string[];
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const fetchCustomers = async (page = 1, searchQuery = "") => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/admin/customers?page=${page}&limit=${pagination.limit}&search=${searchQuery}`
            );
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCustomers(1, search);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-blue-600" /> Quản lý Khách hàng
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Danh sách khách hàng và lịch sử mua sắm
                    </p>
                </div>
            </div>

            {/* Filter / Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, SĐT, Email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </form>

                <div className="text-sm text-gray-500">
                    Tổng cộng: <span className="font-bold text-gray-800">{pagination.total}</span> khách hàng
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Liên hệ</th>
                                <th className="p-4 text-center">Đơn hàng</th>
                                <th className="p-4 text-right">Tổng chi tiêu</th>
                                <th className="p-4 text-center">Điểm</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5" /> Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        Không tìm thấy khách hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{customer.name}</div>
                                            <div className="text-xs text-gray-400">ID: {customer._id.slice(-6)}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="font-medium">{customer.phone}</div>
                                            <div className="text-xs text-gray-400">{customer.email || "Chưa có email"}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[150px]" title={customer.address}>
                                                {customer.address || "Chưa có địa chỉ"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                <ShoppingBag size={12} /> {customer.orders?.length || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-800">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(customer.totalSpent)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 text-xs">
                                                {customer.loyaltyPoints}★
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {customer.tags?.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${tag === "VIP"
                                                                ? "bg-purple-50 text-purple-600 border-purple-100"
                                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                                            }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Button size="xs" variant="outline" className="rounded-lg">
                                                Chi tiết
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button
                        onClick={() => fetchCustomers(pagination.page - 1, search)}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                        Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => fetchCustomers(pagination.page + 1, search)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
