'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  X,
  Edit2,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WarrantyCard {
  _id: string;
  warrantyNumber: string;
  productId: {
    _id: string;
    name: string;
    model: string;
  };
  customerId: {
    _id: string;
    name: string;
    phone: string;
  };
  orderId?: {
    orderNumber: string;
  };
  serialNumber: string;
  warrantyType: 'manufacturer' | 'store';
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyMonths: number;
  warrantyTerms?: string;
  status: 'active' | 'expired' | 'voided' | 'claimed';

  notes: string;
  createdAt: string;
}

const WARRANTY_TYPES = {
  manufacturer: { label: 'Hãng', color: 'bg-blue-100 text-blue-700' },
  store: { label: 'Cửa hàng', color: 'bg-purple-100 text-purple-700' }
};

const STATUS_BADGES = {
  active: { label: 'Còn hiệu lực', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Hết hạn', color: 'bg-slate-100 text-slate-700', icon: Clock },
  voided: { label: 'Vô hiệu', color: 'bg-red-100 text-red-700', icon: XCircle },
  claimed: { label: 'Đã sử dụng', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle }
};

export default function WarrantyCardsPage() {
  const [warrantyCards, setWarrantyCards] = useState<WarrantyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<WarrantyCard | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    customerId: '',
    orderId: '',
    serialNumber: '',
    warrantyType: 'store' as 'manufacturer' | 'store',
    warrantyMonths: 12,
    warrantyTerms: '',
    purchaseDate: '',
    warrantyStartDate: '',
    notes: ''
  });

  const fetchWarrantyCards = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('warrantyType', filterType);
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/warranty-cards?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setWarrantyCards(result.data);
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
    fetchWarrantyCards();
  }, [fetchWarrantyCards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/warranty-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setFormData({
          productId: '',
          customerId: '',
          orderId: '',
          serialNumber: '',
          warrantyType: 'store',
          warrantyMonths: 12,
          warrantyTerms: '',
          purchaseDate: '',
          warrantyStartDate: '',
          notes: ''
        });
        fetchWarrantyCards();
      } else {
        toast.error(result.error || 'Lỗi khi tạo thẻ');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/warranty-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchWarrantyCards();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thẻ bảo hành này?')) return;
    
    try {
      const response = await fetch(`/api/admin/warranty-cards/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchWarrantyCards();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý bảo hành</h1>
          <p className="text-slate-500">Tạo và quản lý thẻ bảo hành sản phẩm</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo thẻ bảo hành
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
                placeholder="Tìm kiếm thẻ, serial, khách hàng..."
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
            <option value="manufacturer">Bảo hành hãng</option>
            <option value="store">Bảo hành cửa hàng</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Còn hiệu lực</option>
            <option value="expired">Hết hạn</option>
            <option value="claimed">Đã sử dụng</option>
          </select>
          
          <button
            onClick={fetchWarrantyCards}
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
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng thẻ</p>
              <p className="text-2xl font-bold text-slate-800">{warrantyCards.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Còn hiệu lực</p>
              <p className="text-2xl font-bold text-green-600">
                {warrantyCards.filter(w => w.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sắp hết hạn ({'<'}30 ngày)</p>

              <p className="text-2xl font-bold text-yellow-600">
                {warrantyCards.filter(w => w.status === 'active' && getDaysRemaining(w.warrantyEndDate) <= 30).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Clock className="text-slate-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đã hết hạn</p>
              <p className="text-2xl font-bold text-slate-600">
                {warrantyCards.filter(w => w.status === 'expired').length}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã thẻ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Serial</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thời hạn</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  Đang tải...
                </td>
              </tr>
            ) : warrantyCards.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  Chưa có thẻ bảo hành nào
                </td>
              </tr>
            ) : (
              warrantyCards.map((card) => {
                const typeInfo = WARRANTY_TYPES[card.warrantyType];
                const statusInfo = STATUS_BADGES[card.status];
                const StatusIcon = statusInfo.icon;
                const daysRemaining = getDaysRemaining(card.warrantyEndDate);
                
                return (
                  <tr key={card._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{card.warrantyNumber}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(card.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{card.productId?.name}</div>
                      <div className="text-xs text-slate-500">{card.productId?.model}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">
                      {card.serialNumber || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{card.customerId?.name}</div>
                      <div className="text-xs text-slate-500">{card.customerId?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm font-medium">{card.warrantyMonths} tháng</div>
                      <div className={`text-xs ${daysRemaining <= 30 && card.status === 'active' ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                        {card.status === 'active' ? `${daysRemaining} ngày còn` : 'Hết hạn'}
                      </div>
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
                            setSelectedCard(card);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {card.status === 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(card._id, 'claimed')}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Đánh dấu đã sử dụng"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(card._id)}
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
              <h2 className="text-lg font-semibold">Tạo thẻ bảo hành</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã sản phẩm</label>
                  <input
                    type="text"
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ID sản phẩm"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã đơn hàng (tùy chọn)</label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ID đơn hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số serial</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Serial number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại bảo hành</label>
                  <select
                    value={formData.warrantyType}
                    onChange={(e) => setFormData({...formData, warrantyType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="store">Bảo hành cửa hàng</option>
                    <option value="manufacturer">Bảo hành hãng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thời hạn (tháng)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({...formData, warrantyMonths: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày mua</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu BH</label>
                  <input
                    type="date"
                    value={formData.warrantyStartDate}
                    onChange={(e) => setFormData({...formData, warrantyStartDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Điều khoản bảo hành</label>
                <input
                  type="text"
                  value={formData.warrantyTerms}
                  onChange={(e) => setFormData({...formData, warrantyTerms: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Bảo hành 1 đổi 1 trong 30 ngày..."
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
                  Tạo thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chi tiết thẻ bảo hành</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-600">Mã thẻ:</span>
                <span className="font-bold text-blue-700 text-lg">{selectedCard.warrantyNumber}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Sản phẩm:</span>
                  <p className="font-medium">{selectedCard.productId?.name}</p>
                  <p className="text-xs text-slate-600">{selectedCard.productId?.model}</p>
                </div>
                <div>
                  <span className="text-slate-500">Serial:</span>
                  <p className="font-medium font-mono">{selectedCard.serialNumber || '-'}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Khách hàng:</span>
                <p className="font-medium">{selectedCard.customerId?.name}</p>
                <p className="text-sm text-slate-600">{selectedCard.customerId?.phone}</p>
              </div>
              
              {selectedCard.orderId && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Đơn hàng:</span>
                  <p className="font-medium">#{selectedCard.orderId.orderNumber}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Loại:</span>
                  <p className="font-medium">{WARRANTY_TYPES[selectedCard.warrantyType].label}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Thời hạn:</span>
                  <p className="font-medium">{selectedCard.warrantyMonths} tháng</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Bắt đầu:</span>
                  <p className="font-medium">
                    {new Date(selectedCard.warrantyStartDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Kết thúc:</span>
                  <p className={`font-medium ${isExpired(selectedCard.warrantyEndDate) ? 'text-red-600' : ''}`}>
                    {new Date(selectedCard.warrantyEndDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {selectedCard.warrantyTerms && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Điều khoản:</span>
                  <p className="font-medium text-sm">{selectedCard.warrantyTerms}</p>
                </div>
              )}
              
              {selectedCard.notes && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Ghi chú:</span>
                  <p className="font-medium text-sm">{selectedCard.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
