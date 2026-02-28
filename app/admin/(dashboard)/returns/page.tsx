'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  ArrowLeftRight,
  RotateCcw,
  Wallet,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReturnItem {
  _id: string;
  returnNumber: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
  };
  customerId: {
    _id: string;
    name: string;
    phone: string;
  };
  returnType: 'refund' | 'exchange' | 'store_credit';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'cancelled';
  refundAmount: number;
  refundMethod: string;
  processedBy?: { name: string };
  processedAt?: string;
  createdAt: string;
  notes: string;
}

const RETURN_TYPES = {
  refund: { label: 'Hoàn tiền', color: 'bg-green-100 text-green-700' },
  exchange: { label: 'Đổi hàng', color: 'bg-blue-100 text-blue-700' },
  store_credit: { label: 'Tín dụng', color: 'bg-purple-100 text-purple-700' }
};

const STATUS_BADGES = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700', icon: XCircle },
  processed: { label: 'Đã xử lý', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-slate-100 text-slate-700', icon: XCircle }
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    orderId: '',
    customerId: '',
    returnType: 'refund' as 'refund' | 'exchange' | 'store_credit',
    reason: '',
    refundAmount: 0,
    refundMethod: 'cash',
    notes: ''
  });

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('returnType', filterType);
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/returns?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setReturns(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, searchTerm]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setFormData({
          orderId: '',
          customerId: '',
          returnType: 'refund',
          reason: '',
          refundAmount: 0,
          refundMethod: 'cash',
          notes: ''
        });
        fetchReturns();
      } else {
        toast.error(result.error || 'Lỗi khi tạo đơn');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchReturns();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn này?')) return;
    
    try {
      const response = await fetch(`/api/admin/returns/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchReturns();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý đổi trả</h1>
          <p className="text-slate-500">Xử lý đơn đổi hàng, hoàn tiền, tín dụng</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo đơn đổi/trả
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            <option value="refund">Hoàn tiền</option>
            <option value="exchange">Đổi hàng</option>
            <option value="store_credit">Tín dụng</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="processed">Đã xử lý</option>
            <option value="rejected">Từ chối</option>
          </select>
          
          <button
            onClick={fetchReturns}
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
              <ArrowLeftRight className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng đơn</p>
              <p className="text-2xl font-bold text-slate-800">{returns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {returns.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng hoàn tiền</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(returns.reduce((sum, r) => sum + (r.refundAmount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RotateCcw className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đổi hàng</p>
              <p className="text-2xl font-bold text-purple-600">
                {returns.filter(r => r.returnType === 'exchange').length}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã đơn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Đơn hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Số tiền</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  Đang tải...
                </td>
              </tr>
            ) : returns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Chưa có đơn đổi/trả nào
                </td>
              </tr>
            ) : (
              returns.map((item) => {
                const typeInfo = RETURN_TYPES[item.returnType];
                const statusInfo = STATUS_BADGES[item.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{item.returnNumber}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">#{item.orderId?.orderNumber}</div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(item.orderId?.totalAmount || 0)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{item.customerId?.name}</div>
                      <div className="text-xs text-slate-500">{item.customerId?.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(item.refundAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReturn(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'approved')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Duyệt"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'rejected')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Từ chối"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {item.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'processed')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Xử lý"
                          >
                            <Package size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Tạo đơn đổi/trả</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã đơn hàng</label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ID đơn hàng"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã khách hàng</label>
                  <input
                    type="text"
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ID khách hàng"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại đổi/trả</label>
                  <select
                    value={formData.returnType}
                    onChange={(e) => setFormData({...formData, returnType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="refund">Hoàn tiền</option>
                    <option value="exchange">Đổi hàng</option>
                    <option value="store_credit">Tín dụng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức hoàn</label>
                  <select
                    value={formData.refundMethod}
                    onChange={(e) => setFormData({...formData, refundMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="bank">Chuyển khoản</option>
                    <option value="store_credit">Tín dụng cửa hàng</option>
                  </select>
                </div>
              </div>
              
              {formData.returnType === 'refund' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền hoàn</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.refundAmount}
                    onChange={(e) => setFormData({...formData, refundAmount: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lý do</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lý do đổi/trả..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tạo đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chi tiết đơn đổi/trả</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Mã đơn:</span>
                  <p className="font-medium">{selectedReturn.returnNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Ngày tạo:</span>
                  <p className="font-medium">{new Date(selectedReturn.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Đơn hàng:</span>
                <p className="font-medium">#{selectedReturn.orderId?.orderNumber}</p>
                <p className="text-sm text-slate-600">{formatCurrency(selectedReturn.orderId?.totalAmount || 0)}</p>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Khách hàng:</span>
                <p className="font-medium">{selectedReturn.customerId?.name}</p>
                <p className="text-sm text-slate-600">{selectedReturn.customerId?.phone}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Loại:</span>
                  <p className="font-medium">{RETURN_TYPES[selectedReturn.returnType].label}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Số tiền hoàn:</span>
                  <p className="font-medium text-green-600">{formatCurrency(selectedReturn.refundAmount)}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Lý do:</span>
                <p className="font-medium">{selectedReturn.reason}</p>
              </div>
              
              {selectedReturn.notes && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Ghi chú:</span>
                  <p className="font-medium">{selectedReturn.notes}</p>
                </div>
              )}
              
              {selectedReturn.processedBy && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Xử lý bởi:</span>
                  <p className="font-medium">{selectedReturn.processedBy.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedReturn.processedAt && new Date(selectedReturn.processedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
