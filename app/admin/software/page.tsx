'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, FileText, Download, Box } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Software {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    version: string;
    type: string;
    status: string;
    views: number;
    createdAt: string;
}

export default function AdminSoftwarePage() {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [loading, setLoading] = useState(true);
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
        fetchSoftware();
    }, [filterStatus]);

    const fetchSoftware = async () => {
        try {
            const url = filterStatus
                ? `/api/admin/software?status=${filterStatus}`
                : '/api/admin/software';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setSoftwareList(data.data);
            }
        } catch (error) {
            console.error('Error fetching software:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa phần mềm "${title}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/software/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                showToast('Đã xóa thành công!', 'success');
                fetchSoftware();
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting software:', error);
            showToast('Có lỗi xảy ra khi xóa', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Kho Driver & Phần mềm</h1>
                            <p className="text-gray-600 mt-1">Quản lý link tải Driver và Phần mềm tiện ích</p>
                        </div>
                        <Link
                            href="/admin/software/new"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm phần mềm mới
                        </Link>
                    </div>

                    {/* Filter */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setFilterStatus('')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === ''
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tất cả ({softwareList.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('published')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'published'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Đã xuất bản
                        </button>
                        <button
                            onClick={() => setFilterStatus('draft')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'draft'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Bản nháp
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Đang tải...</p>
                    </div>
                ) : softwareList.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700 w-[35%]">Tên phần mềm</th>
                                    <th className="text-left p-4 font-semibold text-gray-700 w-[10%]">Phiên bản</th>
                                    <th className="text-left p-4 font-semibold text-gray-700 w-[15%]">Danh mục</th>
                                    <th className="text-left p-4 font-semibold text-gray-700 w-[15%] whitespace-nowrap">Trạng thái</th>
                                    <th className="text-center p-4 font-semibold text-gray-700 w-[10%] whitespace-nowrap">Lượt xem</th>
                                    <th className="text-right p-4 font-semibold text-gray-700 w-[15%] whitespace-nowrap">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {softwareList.map((sw) => (
                                    <tr key={sw._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Box className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{sw.title}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{sw.excerpt}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">
                                                            {sw.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono text-sm">{sw.version}</td>
                                        <td className="p-4">
                                            <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                                {sw.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${sw.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {sw.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {sw.views}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {sw.status === 'published' && (
                                                    <a
                                                        href={`/cai-dat-phan-mem/${sw.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem trang"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/admin/software/edit/${sw._id}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(sw._id, sw.title)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">
                            Chưa có phần mềm nào được đăng tải.
                        </p>
                        <Link
                            href="/admin/software/new"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm phần mềm đầu tiên
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
