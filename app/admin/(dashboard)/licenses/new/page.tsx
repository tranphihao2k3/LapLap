'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, Key, Calendar, Monitor, FileText, ChevronLeft, RefreshCw, AlertCircle, Phone, User } from 'lucide-react';
import Toast from '@/components/admin/Toast';

export default function NewLicensePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [softwareList, setSoftwareList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        key: '',
        hwid: '',
        softwareId: '',
        duration: '12',
        customExpiryDate: '',
        customerName: '',
        customerPhone: '',
        status: 'active',
        note: ''
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        fetchSoftware();
        // Default is handled via duration calculation in handleSubmit
    }, []);

    const fetchSoftware = async () => {
        try {
            const res = await fetch('/api/admin/software');
            const data = await res.json();
            if (data.success) {
                setSoftwareList(data.data);
                if (data.data.length > 0) {
                    setFormData(prev => ({ ...prev, softwareId: data.data[0]._id }));
                }
            }
        } catch (error) {
            console.error('Error fetching software:', error);
            showToast('Không thể tải danh sách phần mềm', 'error');
        }
    };

    const generateKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'LAPLAP-';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) result += '-';
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, key: result }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate actual expiry date
        let calculatedExpiryDate = new Date();
        if (formData.duration === 'custom') {
            if (!formData.customExpiryDate) {
                showToast('Vui lòng chọn ngày hết hạn', 'error');
                return;
            }
            calculatedExpiryDate = new Date(formData.customExpiryDate);
        } else {
            calculatedExpiryDate.setMonth(calculatedExpiryDate.getMonth() + parseInt(formData.duration));
        }

        if (!formData.key || !formData.softwareId) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                expiryDate: calculatedExpiryDate.toISOString()
            };

            const res = await fetch('/api/admin/licenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });
            const data = await res.json();

            if (data.success) {
                showToast('Tạo license thành công!', 'success');
                setTimeout(() => router.push('/admin/licenses'), 1500);
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error creating license:', error);
            showToast('Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/licenses"
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-slate-900 leading-none">Tạo License Mới</h1>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cấp mã bản quyền cho phần mềm</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Settings */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">

                            {/* License Key */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Key className="w-4 h-4 text-blue-500" /> License Key <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all font-mono"
                                        placeholder="LAPLAP-XXXX-XXXX-XXXX-XXXX"
                                        value={formData.key}
                                        onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                                    />
                                    <button
                                        type="button"
                                        onClick={generateKey}
                                        className="bg-blue-50 text-blue-600 px-4 rounded-2xl hover:bg-blue-100 transition-all border border-blue-100 font-bold text-xs flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Ngẫu nhiên
                                    </button>
                                </div>
                            </div>

                            {/* Software Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-500" /> Chọn phần mềm <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none appearance-none"
                                    value={formData.softwareId}
                                    onChange={(e) => setFormData({ ...formData, softwareId: e.target.value })}
                                >
                                    {softwareList.map(sw => (
                                        <option key={sw._id} value={sw._id}>{sw.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Duration / Expiry Date */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-500" /> Gói bản quyền <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none appearance-none"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        >
                                            <option value="1">1 Tháng</option>
                                            <option value="3">3 Tháng</option>
                                            <option value="6">6 Tháng</option>
                                            <option value="12">1 Năm (12 Tháng)</option>
                                            <option value="24">2 Năm (24 Tháng)</option>
                                            <option value="120">10 Năm (Trọn đời)</option>
                                            <option value="custom">Tùy chọn ngày...</option>
                                        </select>
                                    </div>

                                    {formData.duration === 'custom' && (
                                        <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Chọn ngày hết hạn tùy chỉnh
                                            </label>
                                            <input
                                                type="date"
                                                required={formData.duration === 'custom'}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none"
                                                value={formData.customExpiryDate}
                                                onChange={(e) => setFormData({ ...formData, customExpiryDate: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500" /> Trạng thái
                                    </label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none appearance-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="blocked">Đã khóa</option>
                                        <option value="expired">Hết hạn</option>
                                    </select>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-500" /> Tên Khách Hàng (Tùy Chọn)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none"
                                        placeholder="Tên khách hàng"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>

                                {/* Customer Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-500" /> Số điện thoại (Tùy Chọn)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none"
                                        placeholder="09xx..."
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* HWID (Optional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-slate-500" /> Hardware ID (Để trống để tự động gán khi tool chạy)
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold font-mono text-slate-700 focus:outline-none"
                                    placeholder="Có thể bỏ trống"
                                    value={formData.hwid}
                                    onChange={(e) => setFormData({ ...formData, hwid: e.target.value })}
                                />
                            </div>

                            {/* Ghi chú */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    Ghi chú (Tên khách hàng, thông tin bổ sung...)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none"
                                    rows={3}
                                    placeholder="Nhập tên khách máy hoặc ghi chú tại đây..."
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Đang lưu...' : 'LƯU LICENSE'}
                        </button>
                        <Link
                            href="/admin/licenses"
                            className="w-full sm:w-auto bg-white text-slate-400 hover:text-slate-600 font-bold px-8 py-4 rounded-2xl transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <X className="w-5 h-5" />
                            HỦY
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
