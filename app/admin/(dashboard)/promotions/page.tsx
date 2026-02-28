'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  Megaphone,
  Percent,
  DollarSign,
  Calendar,
  Package,
  FolderTree,
  Trash2,
  Eye,
  X,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Promotion {
  _id: string;
  name: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount: number;
  applicableProducts: any[];
  applicableCategories: any[];
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  status: 'draft' | 'active' | 'scheduled' | 'expired' | 'cancelled';
  notes: string;
  createdAt: string;
}

const DISCOUNT_TYPES = {
  percentage: { label: 'Phần trăm', color: 'bg-blue-100 text-blue-700', icon: Percent },
  fixed: { label: 'Cố định', color: 'bg-green-100 text-green-700', icon: DollarSign }
};

const STATUS_BADGES = {
  draft: { label: 'Bản nháp', color: 'bg-slate-100 text-slate-700', icon: Clock },
  active: { label: 'Đang chạy', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  scheduled: { label: 'Đã lên lịch', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  expired: { label: 'Hết hạn', color: 'bg-slate-100 text-slate-700', icon: XCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    maxDiscountAmount: 0,
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
    minOrderAmount: 0,
    startDate: '',
    endDate: '',
    maxUses: 0,
    notes: ''
  });

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/promotions?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPromotions(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        resetForm();
        fetchPromotions();
      } else {
        toast.error(result.error || 'Lỗi khi tạo');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromotion) return;
    
    try {
      const response = await fetch(`/api/admin/promotions/${selectedPromotion._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedPromotion(null);
        resetForm();
        fetchPromotions();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchPromotions();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchPromotions();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscountAmount: 0,
      applicableProducts: [],
      applicableCategories: [],
      minOrderAmount: 0,
      startDate: '',
      endDate: '',
      maxUses: 0,
      notes: ''
    });
  };

  const openEditModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name,
      code: promotion.code,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      maxDiscountAmount: promotion.maxDiscountAmount,
      applicableProducts: promotion.applicableProducts?.map((p: any) => p._id || p) || [],
      applicableCategories: promotion.applicableCategories?.map((c: any) => c._id || c) || [],
      minOrderAmount: promotion.minOrderAmount,
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
      maxUses: promotion.maxUses,
      notes: promotion.notes
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Khuyến mãi</h1>
          <p className="text-slate-500">Quản lý chương trình khuyến mãi và ưu đãi</p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo khuyến mãi
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
                placeholder="Tìm kiếm tên, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="active">Đang chạy</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="expired">Hết hạn</option>
          </select>
          
          <button
            onClick={fetchPromotions}
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
              <Megaphone className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng CTKM</p>
              <p className="text-2xl font-bold text-slate-800">{promotions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đang chạy</p>
              <p className="text-2xl font-bold text-green-600">
                {promotions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Bản nháp</p>
              <p className="text-2xl font-bold text-yellow-600">
                {promotions.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Percent className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đã sử dụng</p>
              <p className="text-2xl font-bold text-purple-600">
                {promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0)}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên/Mã</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Giảm giá</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thời gian</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Sử dụng</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
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
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Chưa có chương trình khuyến mãi nào
                </td>
              </tr>
            ) : (
              promotions.map((promo) => {
                const typeInfo = DISCOUNT_TYPES[promo.discountType];
                const statusInfo = STATUS_BADGES[promo.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={promo._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{promo.name}</div>
                      {promo.code && (
                        <div className="text-xs font-mono text-blue-600">{promo.code}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {promo.discountType === 'percentage' 
                          ? `${promo.discountValue}%` 
                          : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.discountValue)}
                      </span>
                      {promo.maxDiscountAmount > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          Tối đa: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.maxDiscountAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm">
                        {new Date(promo.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-xs text-slate-500">
                        đến {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                      </div>
                      {isExpired(promo.endDate) && (
                        <span className="text-xs text-red-500">(Đã hết hạn)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm font-medium">
                        {promo.usedCount || 0}
                        {promo.maxUses > 0 && ` / ${promo.maxUses}`}
                      </div>
                      {promo.maxUses > 0 && (
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, ((promo.usedCount || 0) / promo.maxUses) * 100)}%` }}
                          />
                        </div>
                      )}
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
                            setSelectedPromotion(promo);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {promo.status === 'draft' && (
                          <button
                            onClick={() => handleUpdateStatus(promo._id, 'active')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Kích hoạt"
                          >
                            <Play size={16} />
                          </button>
                        )}
                        {promo.status === 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(promo._id, 'cancelled')}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Tạm dừng"
                          >
                            <Pause size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(promo)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo._id)}
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

      {/* Create/Edit Modal - Simplified */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên CTKM *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã CTKM</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="VD: SUMMER2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giá trị {formData.discountType === 'percentage' ? '(%)' : '(VNĐ)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({...formData, maxDiscountAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giới hạn sử dụng (0 = không giới hạn)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({...formData, maxUses: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                  {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chi tiết khuyến mãi</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-600">{selectedPromotion.code || 'Không có mã'}</span>
                <span className="font-bold text-blue-700">{selectedPromotion.name}</span>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Mô tả:</span>
                <p className="font-medium">{selectedPromotion.description || '-'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Giảm giá:</span>
                  <p className="font-medium">
                    {selectedPromotion.discountType === 'percentage' 
                      ? `${selectedPromotion.discountValue}%` 
                      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPromotion.discountValue)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Tối đa:</span>
                  <p className="font-medium">
                    {selectedPromotion.maxDiscountAmount > 0 
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPromotion.maxDiscountAmount)
                      : 'Không giới hạn'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Bắt đầu:</span>
                  <p className="font-medium">
                    {new Date(selectedPromotion.startDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Kết thúc:</span>
                  <p className={`font-medium ${isExpired(selectedPromotion.endDate) ? 'text-red-600' : ''}`}>
                    {new Date(selectedPromotion.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Đơn tối thiểu:</span>
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPromotion.minOrderAmount || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Đã sử dụng:</span>
                  <p className="font-medium">
                    {selectedPromotion.usedCount || 0}
                    {selectedPromotion.maxUses > 0 && ` / ${selectedPromotion.maxUses}`}
                  </p>
                </div>
              </div>
              
              {selectedPromotion.notes && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Ghi chú:</span>
                  <p className="font-medium text-sm">{selectedPromotion.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
