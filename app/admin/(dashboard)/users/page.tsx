'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Users, UserPlus, Shield, Lock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin?: string;
}

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'admin' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/auth/register');
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                showToast('User created successfully!', 'success');
                setFormData({ email: '', password: '', name: '', role: 'admin' });
                setShowModal(false);
                fetchUsers();
            } else {
                setError(data.message || 'Failed to create user');
                showToast(data.message || 'Failed to create user', 'error');
            }
        } catch (err) {
            setError('An error occurred');
            showToast('An error occurred', 'error');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                        Quản lý thành viên
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý tài khoản quản trị và phân quyền hệ thống</p>
                </div>
                {session?.user.role === 'superadmin' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                    >
                        <UserPlus className="w-5 h-5" />
                        Thêm thành viên
                    </button>
                )}
            </div>

            {/* Success Message UI - Handled by Toast, but kept for legacy or local errors */}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-800 font-bold text-sm">{success}</p>
                </div>
            )}

            {/* Users Content Area */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Desktop Header */}
                        <div className="hidden lg:grid grid-cols-[1fr_200px_150px_150px_200px] gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
                            <div>Thông tin cá nhân</div>
                            <div>Phân quyền</div>
                            <div className="text-center">Trạng thái</div>
                            <div>Ngày tạo</div>
                            <div className="text-right">Truy cập lần cuối</div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <div key={user._id} className="group hover:bg-slate-50/50 transition-all">
                                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_150px_150px_200px] gap-4 p-5 lg:px-8 lg:py-5 items-center relative">
                                        {/* Avatar & Name Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 border-2 border-white shadow-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs font-medium text-slate-400 truncate">{user.email}</div>
                                            </div>
                                        </div>

                                        {/* Role Badge */}
                                        <div className="flex lg:items-center items-center justify-between mt-2 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-none border-slate-50">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Quyền hạn:</span>
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                ${user.role === 'superadmin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }
                                            `}>
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex lg:justify-center items-center justify-between mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Trạng thái:</span>
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                ${user.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : user.status === 'locked'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                }
                                            `}>
                                                {user.status === 'active' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </div>

                                        {/* Creation Date */}
                                        <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Ngày tạo:</span>
                                            <span className="text-[11px] font-bold text-slate-600">{formatDate(user.createdAt)}</span>
                                        </div>

                                        {/* Last Login Info */}
                                        <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0 mt-1 lg:mt-0 text-right">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Truy cập:</span>
                                            <span className="text-[11px] font-medium text-slate-500 italic">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa từng'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Optimized Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Thêm thành viên mới</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <XCircle className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tên hiển thị</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="example@domain.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-5 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                    />
                                    <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Chức vụ / Phân quyền</label>
                                <div className="relative">
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-xs uppercase tracking-widest text-slate-700 appearance-none cursor-pointer"
                                    >
                                        <option value="admin">Quản trị viên (Admin)</option>
                                        <option value="superadmin">Quản trị cao cấp (Super Admin)</option>
                                    </select>
                                    <Shield className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-100 font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                >
                                    Tạo người dùng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
