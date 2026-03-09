'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJWTAuth } from '@/context/JWTAuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Laptop, BarChart3, Users, Package } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useJWTAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
            });

            if (result.success) {
                setFormData({ email: '', password: '' });
                setTimeout(() => {
                    router.push('/admin');
                    router.refresh();
                }, 500);
            } else {
                setError(result.error || 'Email hoặc mật khẩu không đúng');
            }
        } catch {
            setError('Đã xảy ra lỗi, vui lòng thử lại. Kiểm tra xem NexGear API có chạy không.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        setFormData({
            email: 'admin@nexgear.vn',
            password: 'password123',
        });
        setError('');
    };

    const stats = [
        { icon: Laptop, label: 'Laptop đang bán', value: '120+' },
        { icon: Users, label: 'Khách hàng', value: '500+' },
        { icon: Package, label: 'Đơn hàng', value: '1.2K+' },
        { icon: BarChart3, label: 'Doanh thu tháng', value: '85tr' },
    ];

    return (
        <div className="min-h-screen flex bg-[#0f172a]">
            {/* ── LEFT PANEL ──────────────────────────────── */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
                {/* Background glow orbs */}
                <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[380px] h-[380px] bg-violet-600 rounded-full opacity-20 blur-[100px]" />

                <div className="relative z-10 flex flex-col h-full justify-between p-14">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-black text-xl tracking-tight">LapLap</span>
                            <span className="text-blue-400 text-xs block -mt-0.5">Admin Dashboard</span>
                        </div>
                    </div>

                    {/* Main copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-300 text-xs font-medium">Hệ thống đang hoạt động</span>
                        </div>

                        <h1 className="text-5xl font-black text-white leading-tight mb-4">
                            Quản lý<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                thông minh
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Toàn bộ dữ liệu kinh doanh của LapLap Cần Thơ — ngay trên một màn hình.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-10">
                            {stats.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                                    <Icon className="w-5 h-5 text-blue-400 mb-2" />
                                    <div className="text-2xl font-bold text-white">{value}</div>
                                    <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom */}
                    <p className="text-slate-600 text-sm">© 2026 LapLap Cần Thơ. All rights reserved.</p>
                </div>
            </div>

            {/* ── RIGHT PANEL — LOGIN FORM ─────────────────── */}
            <div className="flex-1 lg:max-w-[480px] flex flex-col items-center justify-center p-8 relative">
                {/* subtle grid bg */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-xl">LapLap Admin</span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-black text-white mb-1">Đăng nhập</h2>
                    <p className="text-slate-400 text-sm mb-8">Chào mừng quay lại 👋</p>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 pl-11 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:bg-blue-500/5 focus:ring-0 outline-none transition-all text-sm"
                                    placeholder="admin@laplap.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 pl-11 pr-12 py-3.5 rounded-xl focus:border-blue-500 focus:bg-blue-500/5 focus:ring-0 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang xác thực...
                                </span>
                            ) : (
                                'Đăng nhập →'
                            )}
                        </button>
                    </form>

                    {/* Security notice & Demo credentials */}
                    <div className="mt-8 space-y-4">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <p className="text-xs font-semibold text-blue-300 mb-2">Demo Credentials (Test):</p>
                            <div className="space-y-1 text-xs text-blue-200 font-mono mb-3">
                                <p>Email: admin@nexgear.vn</p>
                                <p>Password: password123</p>
                            </div>
                            <button
                                type="button"
                                onClick={fillDemoCredentials}
                                className="w-full text-xs font-medium text-blue-300 hover:text-blue-100 bg-blue-500/20 hover:bg-blue-500/30 py-2 rounded-lg transition-colors"
                            >
                                Điền thông tin demo
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
                            <Lock className="w-3 h-3" />
                            <span>NexGear API · Phase 4 JWT Auth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
