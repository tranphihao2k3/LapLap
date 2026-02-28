'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Key, Monitor, Calendar, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface License {
    _id: string;
    key: string;
    hwid: string;
    softwareId: {
        _id: string;
        title: string;
    };
    expiryDate: string;
    customerName?: string;
    customerPhone?: string;
    status: 'active' | 'blocked' | 'expired';
    lastUsed: string;
    createdAt: string;
}

export default function AdminLicensesPage() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        fetchLicenses();
    }, [filterStatus]);

    const fetchLicenses = async () => {
        try {
            const url = filterStatus
                ? `/api/admin/licenses?status=${filterStatus}`
                : '/api/admin/licenses';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setLicenses(data.data);
            }
        } catch (error) {
            console.error('Error fetching licenses:', error);
            showToast('Không thể tải danh sách bản quyền', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, key: string) => {
        if (!confirm(`Bạn có chắc muốn xóa license key: ${key}?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/licenses/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                showToast('Đã xóa thành công!', 'success');
                fetchLicenses();
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting license:', error);
            showToast('Có lỗi xảy ra khi xóa', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLicenses = licenses.filter(license =>
        license.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (license.hwid && license.hwid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.softwareId?.title && license.softwareId.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.customerName && license.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.customerPhone && license.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý Bản quyền</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Quản lý License Keys và Hardware ID cho phần mềm</p>
                    </div>
                    <Link
                        href="/admin/licenses/new"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo License mới
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm: Key, Khách hàng, HWID, Phần mềm..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm overflow-x-auto no-scrollbar flex items-center gap-1.5">
                        <button
                            onClick={() => setFilterStatus('')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filterStatus === ''
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filterStatus === 'active'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            Hoạt động
                        </button>
                        <button
                            onClick={() => setFilterStatus('blocked')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filterStatus === 'blocked'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-100'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            Đã khóa
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                        <div className="relative inline-flex mb-4">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                            <Key className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredLicenses.length > 0 ? (
                    <div className="space-y-4">
                        {/* Desktop Header */}
                        <div className="hidden lg:grid grid-cols-[1.5fr_1.5fr_1.2fr_1.2fr_120px_120px] gap-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 items-center">
                            <div>License Key</div>
                            <div>Phần mềm</div>
                            <div>HWID (Hardware ID)</div>
                            <div>Ngày hết hạn</div>
                            <div className="text-center">Trạng thái</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* List Items */}
                        <div className="grid grid-cols-1 gap-3">
                            {filteredLicenses.map((license) => (
                                <div key={license._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr_1.2fr_1.2fr_120px_120px] gap-4 p-4 lg:px-6 lg:py-4 items-center">

                                        {/* Key */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                                                    {license.key}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                                                    Tạo lúc: {formatDate(license.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Software */}
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-tighter truncate max-w-full">
                                                {license.softwareId?.title || 'Unknown Software'}
                                            </div>
                                            {(license.customerName || license.customerPhone) && (
                                                <div className="text-[10px] font-medium text-slate-500 flex flex-col mt-1">
                                                    {license.customerName && <span>👤 {license.customerName}</span>}
                                                    {license.customerPhone && <span>📞 {license.customerPhone}</span>}
                                                </div>
                                            )}
                                        </div>

                                        {/* HWID */}
                                        <div className="flex items-center gap-2">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase w-20">HWID:</span>
                                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                                                {license.hwid || <span className="text-amber-500 italic">Chưa liên kết</span>}
                                            </div>
                                        </div>

                                        {/* Expiry */}
                                        <div className="flex items-center gap-2">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase w-20">Hết hạn:</span>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {formatDate(license.expiryDate)}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex lg:justify-center items-center justify-between mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Trạng thái:</span>
                                            {license.status === 'active' ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle className="w-3 h-3" /> Hoạt động
                                                </span>
                                            ) : license.status === 'blocked' ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 border border-rose-200">
                                                    <XCircle className="w-3 h-3" /> Đã khóa
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                                                    <AlertCircle className="w-3 h-3" /> Hết hạn
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-1.5 mt-4 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-none border-slate-50 relative z-10">
                                            <Link
                                                href={`/admin/licenses/edit/${license._id}`}
                                                className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(license._id, license.key)}
                                                className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Key size={48} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có license nào</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium">
                            Hãy tạo license key đầu tiên để bật tính năng bảo mật cho phần mềm của bạn.
                        </p>
                        <Link
                            href="/admin/licenses/new"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-blue-100 font-bold hover:bg-blue-700 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo License ngay
                        </Link>
                    </div>
                )}

                {/* Navigation Footer */}
                <div className="mt-10 border-t border-slate-100 pt-6">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-all group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Quay lại bảng điều khiển
                    </Link>
                </div>
            </div>
        </div>
    );
}
