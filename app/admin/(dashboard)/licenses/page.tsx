'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Key, Monitor, Calendar, CheckCircle, XCircle, AlertCircle, Search, User, Phone, Copy, Check } from 'lucide-react';
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
    const [copiedId, setCopiedId] = useState<string | null>(null);

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
        if (!confirm(`Bạn có chắc muốn xóa license key: ${key}?`)) return;

        try {
            const res = await fetch(`/api/admin/licenses/${id}`, { method: 'DELETE' });
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

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const isExpiringSoon = (dateString: string) => {
        if (!dateString) return false;
        const diff = new Date(dateString).getTime() - Date.now();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    };

    const filteredLicenses = licenses.filter(license =>
        license.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (license.hwid && license.hwid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.softwareId?.title && license.softwareId.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.customerName && license.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (license.customerPhone && license.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const statusConfig = {
        active: { label: 'Hoạt động', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        blocked: { label: 'Đã khóa', icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
        expired: { label: 'Hết hạn', icon: AlertCircle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    };

    return (
        <div>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Bản quyền</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý License Keys và Hardware ID</p>
                </div>
                <Link
                    href="/admin/licenses/new"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Tạo License mới
                </Link>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm key, khách hàng, HWID, phần mềm..."
                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    {[
                        { value: '', label: 'Tất cả' },
                        { value: 'active', label: 'Hoạt động' },
                        { value: 'blocked', label: 'Đã khóa' },
                        { value: 'expired', label: 'Hết hạn' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilterStatus(f.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStatus === f.value
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-400 text-sm">Đang tải...</p>
                </div>
            ) : filteredLicenses.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">License Key</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Khách hàng</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">HWID</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Hết hạn</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Trạng thái</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider w-24"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLicenses.map((license) => {
                                const sc = statusConfig[license.status];
                                const StatusIcon = sc.icon;
                                return (
                                    <tr key={license._id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* License Key + Software */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <code className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                                    {license.key}
                                                </code>
                                                <button
                                                    onClick={() => handleCopy(license.key, license._id)}
                                                    className="text-slate-300 hover:text-blue-500 transition-colors"
                                                    title="Copy key"
                                                >
                                                    {copiedId === license._id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                            <div className="text-xs text-indigo-600 font-medium truncate max-w-[280px]" title={license.softwareId?.title}>
                                                {license.softwareId?.title || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-4 py-3">
                                            {license.customerName || license.customerPhone ? (
                                                <div className="space-y-0.5">
                                                    {license.customerName && (
                                                        <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
                                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                                            {license.customerName}
                                                        </div>
                                                    )}
                                                    {license.customerPhone && (
                                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            {license.customerPhone}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* HWID */}
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            {license.hwid ? (
                                                <code className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                    {license.hwid}
                                                </code>
                                            ) : (
                                                <span className="text-xs text-amber-500 italic">Chưa liên kết</span>
                                            )}
                                        </td>

                                        {/* Expiry */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className={`text-xs font-medium ${isExpiringSoon(license.expiryDate) ? 'text-amber-600' : 'text-slate-600'}`}>
                                                {formatDate(license.expiryDate)}
                                            </div>
                                            {isExpiringSoon(license.expiryDate) && (
                                                <div className="text-[10px] text-amber-500 mt-0.5">Sắp hết hạn</div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                {sc.label}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/licenses/edit/${license._id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(license._id, license.key)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <Key className="w-7 h-7 text-slate-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Chưa có license nào</h3>
                    <p className="text-slate-500 text-sm mb-6">Tạo license key đầu tiên cho phần mềm của bạn.</p>
                    <Link
                        href="/admin/licenses/new"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo License ngay
                    </Link>
                </div>
            )}

            {/* Stats */}
            {!loading && licenses.length > 0 && (
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <span>Tổng: {licenses.length}</span>
                    <span>Hoạt động: {licenses.filter(l => l.status === 'active').length}</span>
                    <span>Đã khóa: {licenses.filter(l => l.status === 'blocked').length}</span>
                </div>
            )}
        </div>
    );
}
