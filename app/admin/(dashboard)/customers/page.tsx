'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  Loader2,
  Users,
  Phone,
  Mail,
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalSpent?: number;
  orders?: string[];
  tags?: string[];
  status?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Functions
// ============================================
async function fetchCustomers(search?: string): Promise<Customer[]> {
  try {
    const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : '/api/customers';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch customers');
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('❌ [GET /api/customers] Error:', error.message);
    throw error;
  }
}

async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create customer');
    }
    const result = await response.json();
    console.log('✅ [POST /api/customers] Success');
    return result.data;
  } catch (error: any) {
    console.error('❌ [POST /api/customers] Error:', error.message);
    throw error;
  }
}

async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    console.log('✅ [PUT /api/customers/:id] Success');
  } catch (error: any) {
    console.error('❌ [PUT /api/customers/:id] Error:', error.message);
    throw error;
  }
}

async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    console.log('✅ [DELETE /api/customers/:id] Success');
  } catch (error: any) {
    console.error('❌ [DELETE /api/customers/:id] Error:', error.message);
    throw error;
  }
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
            <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
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
function EmptyState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <Users className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có khách hàng nào</h3>
      <p className="mt-2 text-sm text-slate-500">Hãy thêm khách hàng đầu tiên của bạn</p>
      <button
        onClick={onAddNew}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
      >
        <Plus size={18} />
        Thêm khách hàng
      </button>
    </div>
  );
}

// ============================================
// Customer Form Modal
// ============================================
function CustomerFormModal({ 
  customer, 
  onClose, 
  onSuccess 
}: { 
  customer?: Customer | null; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    status: customer?.status || 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Vui lòng nhập tên và số điện thoại');
      return;
    }

    setSubmitting(true);
    try {
      if (customer) {
        await updateCustomer(customer._id, formData);
        toast.success('Cập nhật khách hàng thành công!');
      } else {
        await createCustomer(formData);
        toast.success('Thêm khách hàng thành công!');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">
            {customer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <AlertCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0385620679"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ khách hàng"
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {customer ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Delete Confirmation Modal
// ============================================
function DeleteConfirmModal({ 
  customer, 
  onClose, 
  onConfirm 
}: { 
  customer: Customer; 
  onClose: () => void; 
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      toast.success('Xóa khách hàng thành công!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p className="mt-2 text-slate-600">
              Bạn có chắc chắn muốn xóa khách hàng <strong>{customer.name}</strong>?
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Customers Page
// ============================================
export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const loadCustomers = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers(searchTerm);
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers(search);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;
    await deleteCustomer(deletingCustomer._id);
    loadCustomers(search);
  };

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Khách hàng</h1>
          <p className="text-slate-500 mt-1">Quản lý thông tin khách hàng</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm khách hàng
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => loadCustomers()}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-900">Đã xảy ra lỗi</p>
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => loadCustomers()}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingTable />}

      {!loading && !error && customers.length === 0 && (
        <EmptyState onAddNew={handleAddNew} />
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Liên hệ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Tổng chi tiêu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Đơn hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày tạo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {customer.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          {customer.tags && customer.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {customer.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                            <Mail size={14} />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {customer.orders?.length || 0} đơn
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              Hiển thị {customers.length} khách hàng
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingCustomer(null);
            loadCustomers(search);
          }}
        />
      )}

      {deletingCustomer && (
        <DeleteConfirmModal
          customer={deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
