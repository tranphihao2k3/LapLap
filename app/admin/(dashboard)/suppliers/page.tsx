'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  Building2,
  Star,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Eye,
  X,
  Edit2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Supplier {
  _id: string;
  supplierCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  taxCode: string;
  bankAccount: string;
  bankName: string;
  paymentTerm: number;
  totalDebt: number;
  rating: number;
  status: 'active' | 'inactive';
  notes: string;
  createdAt: string;
}

const STATUS_BADGES = {
  active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: 'Ngừng hoạt động', color: 'bg-slate-100 text-slate-700', icon: XCircle }
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    taxCode: '',
    bankAccount: '',
    bankName: '',
    paymentTerm: 0,
    rating: 5,
    status: 'active' as 'active' | 'inactive',
    notes: ''
  });

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/suppliers?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setSuppliers(result.data);
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
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        resetForm();
        fetchSuppliers();
      } else {
        toast.error(result.error || 'Lỗi khi tạo nhà cung cấp');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    
    try {
      const response = await fetch(`/api/admin/suppliers/${selectedSupplier._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedSupplier(null);
        resetForm();
        fetchSuppliers();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;
    
    try {
      const response = await fetch(`/api/admin/suppliers/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchSuppliers();
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
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      taxCode: '',
      bankAccount: '',
      bankName: '',
      paymentTerm: 0,
      rating: 5,
      status: 'active',
      notes: ''
    });
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      taxCode: supplier.taxCode,
      bankAccount: supplier.bankAccount,
      bankName: supplier.bankName,
      paymentTerm: supplier.paymentTerm,
      rating: supplier.rating,
      status: supplier.status,
      notes: supplier.notes
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nhà cung cấp</h1>
          <p className="text-slate-500">Quản lý danh sách nhà cung cấp và đánh giá</p>
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
          Thêm nhà cung cấp
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
                placeholder="Tìm kiếm tên, mã, SĐT, email..."
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
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          
          <button
            onClick={fetchSuppliers}
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
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng NCC</p>
              <p className="text-2xl font-bold text-slate-800">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đánh giá TB</p>
              <p className="text-2xl font-bold text-yellow-600">
                {suppliers.length > 0 
                  ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Building2 className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng công nợ</p>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  suppliers.reduce((sum, s) => sum + (s.totalDebt || 0), 0)
                )}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã NCC</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Liên hệ</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Đánh giá</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Công nợ</th>
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
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Chưa có nhà cung cấp nào
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => {
                const statusInfo = STATUS_BADGES[supplier.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={supplier._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{supplier.supplierCode}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(supplier.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{supplier.name}</div>
                      {supplier.taxCode && (
                        <div className="text-xs text-slate-500">MST: {supplier.taxCode}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{supplier.contactPerson || '-'}</div>
                      <div className="text-xs text-slate-500">{supplier.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderStars(supplier.rating)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`font-medium ${supplier.totalDebt > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(supplier.totalDebt || 0)}
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
                            setSelectedSupplier(supplier);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(supplier)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier._id)}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên NCC *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Người liên hệ</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã số thuế</label>
                  <input
                    type="text"
                    value={formData.taxCode}
                    onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hạn thanh toán (ngày)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.paymentTerm}
                    onChange={(e) => setFormData({...formData, paymentTerm: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số tài khoản</label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên ngân hàng</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Đánh giá (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value) || 5})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
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
                  {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chi tiết nhà cung cấp</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-600">Mã NCC:</span>
                <span className="font-bold text-blue-700 text-lg">{selectedSupplier.supplierCode}</span>
              </div>
              
              <div className="border-t pt-3">
                <span className="text-slate-500 text-sm">Tên:</span>
                <p className="font-medium">{selectedSupplier.name}</p>
              </div>
              
              {selectedSupplier.contactPerson && (
                <div>
                  <span className="text-slate-500 text-sm">Người liên hệ:</span>
                  <p className="font-medium">{selectedSupplier.contactPerson}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                {selectedSupplier.phone && (
                  <div>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Phone size={12} /> SĐT:
                    </span>
                    <p className="font-medium">{selectedSupplier.phone}</p>
                  </div>
                )}
                {selectedSupplier.email && (
                  <div>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Mail size={12} /> Email:
                    </span>
                    <p className="font-medium">{selectedSupplier.email}</p>
                  </div>
                )}
              </div>
              
              {selectedSupplier.address && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm flex items-center gap-1">
                    <MapPin size={12} /> Địa chỉ:
                  </span>
                  <p className="font-medium">{selectedSupplier.address}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                {selectedSupplier.taxCode && (
                  <div>
                    <span className="text-slate-500 text-sm">MST:</span>
                    <p className="font-medium">{selectedSupplier.taxCode}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 text-sm">Đánh giá:</span>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedSupplier.rating)}
                    <span className="text-sm">({selectedSupplier.rating}/5)</span>
                  </div>
                </div>
              </div>
              
              {(selectedSupplier.bankAccount || selectedSupplier.bankName) && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Thông tin ngân hàng:</span>
                  <p className="font-medium">{selectedSupplier.bankName}</p>
                  <p className="font-mono text-sm">{selectedSupplier.bankAccount}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <span className="text-slate-500 text-sm">Hạn thanh toán:</span>
                  <p className="font-medium">{selectedSupplier.paymentTerm} ngày</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Công nợ:</span>
                  <p className={`font-medium ${selectedSupplier.totalDebt > 0 ? 'text-red-600' : ''}`}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSupplier.totalDebt || 0)}
                  </p>
                </div>
              </div>
              
              {selectedSupplier.notes && (
                <div className="border-t pt-3">
                  <span className="text-slate-500 text-sm">Ghi chú:</span>
                  <p className="font-medium text-sm">{selectedSupplier.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
