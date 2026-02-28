'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Employee {
    _id: string;
    name: string;
    email: string;
    position: string;
}

interface Attendance {
    _id: string;
    employeeId: Employee;
    date: string;
    checkIn: string;
    checkOut: string;
    status: string;
    notes: string;
    createdAt: string;
}

export default function AttendancePage() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState({
        employeeId: '',
        date: '',
        checkIn: '',
        checkOut: '',
        status: 'present',
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
        fetchAttendances();
        fetchEmployees();
    }, [pagination.page, searchQuery, filterStatus, dateFrom, dateTo]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees?limit=100');
            const data = await res.json();
            if (data.success) setEmployees(data.data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchAttendances = async () => {
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (searchQuery) params.append('search', searchQuery);
            if (filterStatus) params.append('status', filterStatus);
            if (dateFrom) params.append('dateFrom', dateFrom);
            if (dateTo) params.append('dateTo', dateTo);

            const res = await fetch(`/api/admin/attendance?${params}`);
            const data = await res.json();
            if (data.success) {
                setAttendances(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching attendances:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingAttendance
                ? `/api/admin/attendance/${editingAttendance._id}`
                : '/api/admin/attendance';

            const method = editingAttendance ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchAttendances();
                handleCloseModal();
                showToast(editingAttendance ? 'Cập nhật thành công!' : 'Tạo mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            showToast('Lỗi lưu dữ liệu', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

        try {
            const res = await fetch(`/api/admin/attendance/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchAttendances();
                showToast('Xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting attendance:', error);
            showToast('Lỗi xóa dữ liệu', 'error');
        }
    };

    const handleEdit = (attendance: Attendance) => {
        setEditingAttendance(attendance);
        setFormData({
            employeeId: typeof attendance.employeeId === 'object' ? attendance.employeeId._id : attendance.employeeId,
            date: attendance.date ? attendance.date.split('T')[0] : '',
            checkIn: attendance.checkIn || '',
            checkOut: attendance.checkOut || '',
            status: attendance.status || 'present',
            notes: attendance.notes || '',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAttendance(null);
        setFormData({ employeeId: '', date: '', checkIn: '', checkOut: '', status: 'present', notes: '' });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            present: 'bg-green-100 text-green-700',
            absent: 'bg-red-100 text-red-700',
            late: 'bg-yellow-100 text-yellow-700',
            leave: 'bg-blue-100 text-blue-700',
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            present: 'Có mặt',
            absent: 'Vắng',
            late: 'Đi muộn',
            leave: 'Nghỉ phép',
        };
        return labels[status] || status;
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
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Chấm công nhân viên</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý chấm công và điểm danh hàng ngày</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm bản ghi
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-medium"
                    />
                </div>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="present">Có mặt</option>
                    <option value="absent">Vắng</option>
                    <option value="late">Đi muộn</option>
                    <option value="leave">Nghỉ phép</option>
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
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Ngày</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Giờ vào</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Giờ ra</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendances.map((attendance) => (
                                    <tr key={attendance._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {typeof attendance.employeeId === 'object' ? attendance.employeeId.name : 'N/A'}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {typeof attendance.employeeId === 'object' ? attendance.employeeId.position : ''}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {attendance.date ? new Date(attendance.date).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                            {attendance.checkIn || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                            {attendance.checkOut || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(attendance.status)}`}>
                                                {getStatusLabel(attendance.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(attendance)}
                                                    className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(attendance._id)}
                                                    className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {attendances.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                            Chưa có bản ghi chấm công nào.
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
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingAttendance ? 'Chỉnh sửa chấm công' : 'Thêm bản ghi chấm công'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nhân viên *</label>
                                <select
                                    required
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="">Chọn nhân viên</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name} - {emp.position}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ngày *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Giờ vào</label>
                                    <input
                                        type="time"
                                        value={formData.checkIn}
                                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Giờ ra</label>
                                    <input
                                        type="time"
                                        value={formData.checkOut}
                                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="present">Có mặt</option>
                                    <option value="absent">Vắng</option>
                                    <option value="late">Đi muộn</option>
                                    <option value="leave">Nghỉ phép</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ghi chú</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm font-medium h-20 resize-none"
                                    placeholder="Ghi chú thêm..."
                                />
                            </div>

                            <div className="flex gap-3 pt-6">
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
                                    {editingAttendance ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
