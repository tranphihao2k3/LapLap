'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw,
  AlertCircle,
  Loader2,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Trash2,
  Eye
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface Feedback {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'complaint' | 'suggestion' | 'inquiry' | 'other';
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Functions
// ============================================
async function fetchFeedbacks(): Promise<Feedback[]> {
  try {
    const response = await fetch('/api/admin/feedback');
    if (!response.ok) throw new Error('Failed to fetch feedbacks');
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('❌ [GET /api/admin/feedback] Error:', error.message);
    throw error;
  }
}

async function updateFeedbackStatus(id: string, status: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update feedback');
    console.log('✅ [PATCH /api/admin/feedback/:id] Success');
  } catch (error: any) {
    console.error('❌ [PATCH /api/admin/feedback/:id] Error:', error.message);
    throw error;
  }
}

async function deleteFeedback(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/feedback/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete feedback');
    console.log('✅ [DELETE /api/admin/feedback/:id] Success');
  } catch (error: any) {
    console.error('❌ [DELETE /api/admin/feedback/:id] Error:', error.message);
    throw error;
  }
}

// ============================================
// Status Badge Component
// ============================================
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} /> },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Loader2 size={14} className="animate-spin" /> },
    resolved: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} /> },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} /> },
  };
  
  const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
  
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    rejected: 'Từ chối',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      {style.icon}
      {labels[status] || status}
    </span>
  );
}

// ============================================
// Type Badge Component
// ============================================
function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    complaint: 'Khiếu nại',
    suggestion: 'Góp ý',
    inquiry: 'Hỏi đáp',
    other: 'Khác',
  };

  const styles: Record<string, string> = {
    complaint: 'bg-red-50 text-red-600 border-red-100',
    suggestion: 'bg-blue-50 text-blue-600 border-blue-100',
    inquiry: 'bg-green-50 text-green-600 border-green-100',
    other: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${styles[type] || styles.other}`}>
      {labels[type] || type}
    </span>
  );
}

// ============================================
// Loading Table
// ============================================
function LoadingTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-24 h-6 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Empty State
// ============================================
function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có phản hồi nào</h3>
      <p className="mt-2 text-sm text-slate-500">Danh sách phản hồi sẽ hiển thị ở đây</p>
    </div>
  );
}

// ============================================
// Feedback Detail Modal
// ============================================
function FeedbackDetailModal({ 
  feedback, 
  onClose, 
  onUpdateStatus,
  onDelete
}: { 
  feedback: Feedback; 
  onClose: () => void; 
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await onUpdateStatus(feedback._id, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;
    
    try {
      await onDelete(feedback._id);
      toast.success('Đã xóa phản hồi!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold">Chi tiết phản hồi</h2>
            <p className="text-sm text-slate-500">
              Mã: #{feedback._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TypeBadge type={feedback.type} />
              <StatusBadge status={feedback.status} />
            </div>
            <p className="text-sm text-slate-500">
              {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Customer Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Thông tin người gửi</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Tên:</span>
                <span className="ml-2 font-medium">{feedback.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>
                <span className="ml-2 font-medium">{feedback.email}</span>
              </div>
              {feedback.phone && (
                <div className="col-span-2">
                  <span className="text-slate-500">SĐT:</span>
                  <span className="ml-2 font-medium">{feedback.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Tiêu đề</p>
            <p className="font-medium text-lg">{feedback.subject}</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Nội dung</p>
            <div className="bg-slate-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
              {feedback.message}
            </div>
          </div>

          {/* Status Actions */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Cập nhật trạng thái</p>
            <div className="flex flex-wrap gap-2">
              {feedback.status !== 'pending' && (
                <button
                  onClick={() => handleStatusChange('pending')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200 disabled:opacity-50"
                >
                  Chờ xử lý
                </button>
              )}
              {feedback.status !== 'processing' && (
                <button
                  onClick={() => handleStatusChange('processing')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 disabled:opacity-50"
                >
                  Đang xử lý
                </button>
              )}
              {feedback.status !== 'resolved' && (
                <button
                  onClick={() => handleStatusChange('resolved')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 disabled:opacity-50"
                >
                  Đã giải quyết
                </button>
              )}
              {feedback.status !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 disabled:opacity-50"
                >
                  Từ chối
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={16} />
            Xóa
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Feedback Page
// ============================================
export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const loadFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Không thể tải danh sách phản hồi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateFeedbackStatus(id, status);
    loadFeedbacks();
    if (selectedFeedback) {
      setSelectedFeedback({ ...selectedFeedback, status: status as any });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFeedback(id);
    loadFeedbacks();
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesStatus = !filterStatus || f.status === filterStatus;
    const matchesType = !filterType || f.type === filterType;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Phản hồi</h1>
          <p className="text-slate-500 mt-1">Quản lý phản hồi và góp ý từ khách hàng</p>
        </div>
        <button
          onClick={loadFeedbacks}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="rejected">Từ chối</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            <option value="complaint">Khiếu nại</option>
            <option value="suggestion">Góp ý</option>
            <option value="inquiry">Hỏi đáp</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-900">Đã xảy ra lỗi</p>
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={loadFeedbacks}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingTable />}

      {/* Empty State */}
      {!loading && !error && filteredFeedbacks.length === 0 && <EmptyState />}

      {/* Feedbacks Table */}
      {!loading && !error && filteredFeedbacks.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Người gửi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tiêu đề</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày gửi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{feedback.name}</div>
                      <div className="text-xs text-slate-500">{feedback.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={feedback.type} />
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">
                      {feedback.subject}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={feedback.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              Hiển thị {filteredFeedbacks.length} phản hồi
            </p>
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
