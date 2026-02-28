'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, DollarSign, CheckCircle } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Employee {
    _id: string;
    name: string;
    email: string;
    position: string;
    baseSalary: number;
}

interface Salary {
    _id: string;
    employeeId: Employee;
    month: number;
    year: number;
    baseSalary: number;
    allowances: number;
    bonuses: number;
    deductions: number;
    netSalary: number;
    status: string;
    paymentDate: string;
    notes: string;
    createdAt: string;
}

export default function SalaryPage() {
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState({
        employeeId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: 0,
        allowances: 0,
        bonuses: 0,
        deductions: 0,
        status: 'pending',
        paymentDate: '',
        notes: '',
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
        fetchSalaries();
        fetchEmployees();
    }, [pagination.page, filterStatus, filterMonth, filterYear]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees?limit=100');
            const data = await res.json();
            if (data.success) setEmployees(data.data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchSalaries = async () => {
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (filterStatus) params.append('status', filterStatus);
            if (filterMonth) params.append('month', filterMonth);
            if (filterYear) params.append('year', filterYear);

            const res = await fetch(`/api/admin/salary?${params}`);
            const data = await res.json();
            if (data.success) {
                setSalaries(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching salaries:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateNetSalary = () => {
        return formData.baseSalary + formData.allowances + formData.bonuses - formData.deductions;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const netSalary = calculateNetSalary();
        const payload = { ...formData, netSalary };

        try {
            const url = editingSalary
                ? `/api/admin/salary/${editingSalary._id}`
                : '/api/admin/salary';

            const method = editingSalary ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                fetchSalaries();
                handleCloseModal();
                showToast(editingSalary ? 'Cập nhật thành công!' : 'Tạo mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving salary:', error);
            showToast('Lỗi lưu dữ liệu', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

        try {
            const res = await fetch(`/api/admin/salary/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchSalaries();
                showToast('Xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting salary:', error);
            showToast('Lỗi xóa dữ liệu', 'error');
        }
    };

    const handleEdit = (salary: Salary) => {
        setEditingSalary(salary);
        const empId = typeof salary.employeeId === 'object' ? salary.employeeId._id : salary.employeeId;
        setFormData({
            employeeId: empId,
            month: salary.month,
            year: salary.year,
            baseSalary: salary.baseSalary,
            allowances: salary.allowances || 0,
            bonuses: salary.bonuses || 0,
            deductions: salary.deductions || 0,
            status: salary.status || 'pending',
            paymentDate: salary.paymentDate ? salary.paymentDate.split('T')[0] : '',
            notes: salary.notes || '',
        });
        setShowModal(true);
    };

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find(e => e._id === employeeId);
        setFormData({
            ...formData,
            employeeId,
            baseSalary: employee?.baseSalary || 0,
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSalary(null);
        setFormData({
            employeeId: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            baseSalary: 0,
            allowances: 0,
            bonuses: 0,
            deductions: 0,
            status: 'pending',
            paymentDate: '',
            notes: '',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
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
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý lương</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý lương và thanh toán cho nhân viên</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Tính lương
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select
                    value={filterMonth}
                    onChange={(e) => { setFilterMonth(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả tháng</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                </select>
                <select
                    value={filterYear}
                    onChange={(e) => { setFilterYear(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả năm</option>
                    {[2023, 2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-purple-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Nhân viên</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Tháng/Năm</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Lương cơ bản</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Phụ cấp</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Thưởng</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Khấu trừ</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Lương thực nhận</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {salaries.map((salary) => (
                                    <tr key={salary._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">
                                                {typeof salary.employeeId === 'object' ? salary.employeeId.name : 'N/A'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {typeof salary.employeeId === 'object' ? salary.employeeId.position : ''}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                            Tháng {salary.month}/{salary.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatCurrency(salary.baseSalary)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600">
                                            +{formatCurrency(salary.allowances || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600">
                                            +{formatCurrency(salary.bonuses || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-red-600">
                                            -{formatCurrency(salary.deductions || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-purple-600">
                                            {formatCurrency(salary.netSalary)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(salary.status)}`}>
                                                {salary.status === 'pending' ? 'Chờ thanh toán' : 
                                                 salary.status === 'paid' ? 'Đã thanh toán' : 'Đã hủy'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(salary)}
                                                    className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(salary._id)}
                                                    className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {salaries.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                            Chưa có bản ghi lương nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Trang {pagination.page} / {pagination.pages} ({pagination.total} records)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 my-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingSalary ? 'Chỉnh sửa lương' : 'Tính lương tháng'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nhân viên *</label>
                                <select
                                    required
                                    value={formData.employeeId}
                                    onChange={(e) => handleEmployeeChange(e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="">Chọn nhân viên</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name} - {emp.position}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tháng *</label>
                                    <select
                                        required
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Năm *</label>
                                    <select
                                        required
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        {[2023, 2024, 2025, 2026].map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Lương cơ bản</label>
                                <input
                                    type="number"
                                    value={formData.baseSalary}
                                    onChange={(e) => setFormData({ ...formData, baseSalary: parseInt(e.target.value) || 0 })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Phụ cấp</label>
                                    <input
                                        type="number"
                                        value={formData.allowances}
                                        onChange={(e) => setFormData({ ...formData, allowances: parseInt(e.target.value) || 0 })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Thưởng</label>
                                    <input
                                        type="number"
                                        value={formData.bonuses}
                                        onChange={(e) => setFormData({ ...formData, bonuses: parseInt(e.target.value) || 0 })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Khấu trừ</label>
                                    <input
                                        type="number"
                                        value={formData.deductions}
                                        onChange={(e) => setFormData({ ...formData, deductions: parseInt(e.target.value) || 0 })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-red-600"
                                    />
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-purple-600">Lương thực nhận:</span>
                                    <span className="text-xl font-black text-purple-600">{formatCurrency(calculateNetSalary())}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="pending">Chờ thanh toán</option>
                                    <option value="paid">Đã thanh toán</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ngày thanh toán</label>
                                <input
                                    type="date"
                                    value={formData.paymentDate}
                                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-lg shadow-purple-100 font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                >
                                    {editingSalary ? 'Cập nhật' : 'Tính lương'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
