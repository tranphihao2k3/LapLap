'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, Key, Calendar, Monitor, FileText, ChevronLeft, AlertCircle, Trash2 } from 'lucide-react';
import Toast from '@/components/admin/Toast';

export default function EditLicensePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [softwareList, setSoftwareList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        key: '',
        hwid: '',
        softwareId: '',
        expiryDate: '',
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
        const loadPageData = async () => {
            await fetchSoftware();
            await fetchLicense();
            setLoading(false);
        };
        loadPageData();
    }, []);

    const fetchSoftware = async () => {
        try {
            const res = await fetch('/api/admin/software');
            const data = await res.json();
            if (data.success) {
                setSoftwareList(data.data);
            }
        } catch (error) {
            console.error('Error fetching software:', error);
        }
    };

    const fetchLicense = async () => {
        try {
            const res = await fetch(`/api/admin/licenses/${id}`);
            const data = await res.json();
            if (data.success) {
                const license = data.data;
                setFormData({
                    key: license.key,
                    hwid: license.hwid || '',
                    softwareId: typeof license.softwareId === 'object' ? license.softwareId._id : license.softwareId,
                    expiryDate: license.expiryDate ? new Date(license.expiryDate).toISOString().split('T')[0] : '',
                    status: license.status,
                    note: license.note || ''
                });
            } else {
                showToast('Không tìm thấy bản quyền', 'error');
            }
        } catch (error) {
            console.error('Error fetching license:', error);
            showToast('Lỗi khi tải thông tin bản quyền', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/licenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                showToast('Cập nhật thành công!', 'success');
                setTimeout(() => router.push('/admin/licenses'), 1500);
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error updating license:', error);
            showToast('Có lỗi xảy ra', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        );
    }

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
                            <h1 className="text-lg md:text-xl font-black text-slate-900 leading-none">Chỉnh sửa License</h1>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{formData.key}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">

                            {/* License Key (Readonly in Edit) */}
                            <div className="space-y-2 opacity-80">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Key className="w-4 h-4 text-blue-500" /> License Key
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 font-mono cursor-not-allowed"
                                    value={formData.key}
                                />
                            </div>

                            {/* Software Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-500" /> Phần mềm liên kết
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
                                {/* Expiry Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-500" /> Ngày hết hạn
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
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

                            {/* HWID (Optional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-slate-500" /> Hardware ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold font-mono text-slate-700 focus:outline-none pr-12"
                                        placeholder="Để trống để cho phép máy khác gán vào"
                                        value={formData.hwid}
                                        onChange={(e) => setFormData({ ...formData, hwid: e.target.value })}
                                    />
                                    {formData.hwid && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hwid: '' })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                                            title="Xóa liên kết máy"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 px-2">
                                    Lưu ý: Xóa Hardware ID (ID máy) sẽ cho phép Tool liên kết với một máy tính mới ở lần chạy tiếp theo.
                                </p>
                            </div>

                            {/* Ghi chú */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    Ghi chú
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
                            disabled={saving}
                            className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Đang lưu...' : 'CẬP NHẬT'}
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
