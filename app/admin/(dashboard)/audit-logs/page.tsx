'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  RefreshCw,
  History,
  Plus,
  Pencil,
  Trash2,
  FileText,
  User,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AuditLog {
  _id: string;
  collectionName: string;
  documentId: string;
  action: 'create' | 'update' | 'delete';
  changes: {
    before: any;
    after: any;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  ipAddress: string;
  description: string;
  createdAt: string;
}

const ACTION_CONFIG = {
  create: { label: 'Tạo mới', color: 'bg-green-100 text-green-700', icon: Plus },
  update: { label: 'Cập nhật', color: 'bg-blue-100 text-blue-700', icon: Pencil },
  delete: { label: 'Xóa', color: 'bg-red-100 text-red-700', icon: Trash2 }
};

const COLLECTION_LABELS: Record<string, string> = {
  Product: 'Sản phẩm',
  Order: 'Đơn hàng',
  Customer: 'Khách hàng',
  User: 'Người dùng',
  Category: 'Danh mục',
  Brand: 'Thương hiệu',
  Coupon: 'Mã giảm giá',
  Banner: 'Banner',
  Supplier: 'Nhà cung cấp',
  Promotion: 'Khuyến mãi'
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterAction) params.append('action', filterAction);
      if (filterCollection) params.append('collection', filterCollection);
      params.append('page', currentPage.toString());
      params.append('limit', '50');
      
      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setLogs(result.data);
        setTotalPages(result.pagination.pages);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterAction, filterCollection, currentPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatChanges = (changes: any) => {
    if (!changes) return null;
    return JSON.stringify(changes, null, 2);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Lịch sử thao tác</h1>
        <p className="text-slate-500">Theo dõi các thay đổi trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả hành động</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
          </select>
          
          <select
            value={filterCollection}
            onChange={(e) => {
              setFilterCollection(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả bảng dữ liệu</option>
            {Object.entries(COLLECTION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <History className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng logs</p>
              <p className="text-2xl font-bold text-slate-800">{logs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Plus className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tạo mới</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.action === 'create').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Pencil className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cập nhật</p>
              <p className="text-2xl font-bold text-blue-600">
                {logs.filter(l => l.action === 'update').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Xóa</p>
              <p className="text-2xl font-bold text-red-600">
                {logs.filter(l => l.action === 'delete').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thời gian</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hành động</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bảng dữ liệu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Người thực hiện</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mô tả</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  Đang tải...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Chưa có lịch sử thao tác nào
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const actionConfig = ACTION_CONFIG[log.action];
                const ActionIcon = actionConfig.icon;
                
                return (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${actionConfig.color}`}>
                        <ActionIcon size={12} />
                        {actionConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                        {COLLECTION_LABELS[log.collectionName] || log.collectionName}
                      </span>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        ID: {log.documentId.slice(-8)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {log.userId ? (
                        <div>
                          <div className="font-medium text-sm">{log.userId.name}</div>
                          <div className="text-xs text-slate-500">{log.userId.email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Hệ thống</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                      {log.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setIsDetailOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết thay đổi"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chi tiết thay đổi</h2>
              <button 
                onClick={() => setIsDetailOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Bảng:</span>
                  <p className="font-medium">{COLLECTION_LABELS[selectedLog.collectionName] || selectedLog.collectionName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Document ID:</span>
                  <p className="font-medium font-mono">{selectedLog.documentId}</p>
                </div>
                <div>
                  <span className="text-slate-500">Hành động:</span>
                  <p className="font-medium">{ACTION_CONFIG[selectedLog.action].label}</p>
                </div>
                <div>
                  <span className="text-slate-500">Thời gian:</span>
                  <p className="font-medium">
                    {new Date(selectedLog.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {selectedLog.changes?.before && (
                <div>
                  <h3 className="font-medium text-red-600 mb-2">Trước khi thay đổi:</h3>
                  <pre className="bg-red-50 p-3 rounded-lg text-xs overflow-x-auto">
                    {formatChanges(selectedLog.changes.before)}
                  </pre>
                </div>
              )}
              
              {selectedLog.changes?.after && (
                <div>
                  <h3 className="font-medium text-green-600 mb-2">Sau khi thay đổi:</h3>
                  <pre className="bg-green-50 p-3 rounded-lg text-xs overflow-x-auto">
                    {formatChanges(selectedLog.changes.after)}
                  </pre>
                </div>
              )}
              
              {selectedLog.description && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Mô tả:</span>
                  <p className="font-medium">{selectedLog.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
