'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  customerId?: {
    _id: string;
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Functions
// ============================================
async function fetchOrders(status?: string): Promise<Order[]> {
  try {
    const url = status ? `/api/orders?status=${status}` : '/api/orders';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('❌ [GET /api/orders] Error:', error.message);
    throw error;
  }
}

async function updateOrderStatus(id: string, status: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    console.log('✅ [PATCH /api/admin/orders/:id] Success');
  } catch (error: any) {
    console.error('❌ [PATCH /api/admin/orders/:id] Error:', error.message);
    throw error;
  }
}


async function deleteOrder(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
    console.log('✅ [DELETE /api/orders/:id] Success');
  } catch (error: any) {
    console.error('❌ [DELETE /api/orders/:id] Error:', error.message);
    throw error;
  }
}

// ============================================
// Status Badge Component
// ============================================
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} /> },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Package size={14} /> },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Truck size={14} /> },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} /> },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} /> },
  };
  
  const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
  
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đã giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      {style.icon}
      {labels[status] || status}
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
      <Package className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có đơn hàng nào</h3>
      <p className="mt-2 text-sm text-slate-500">Danh sách đơn hàng sẽ hiển thị ở đây</p>
    </div>
  );
}

// ============================================
// Order Detail Modal
// ============================================
function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdateStatus 
}: { 
  order: Order; 
  onClose: () => void; 
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>
            <p className="text-sm text-slate-500">Mã đơn: #{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <AlertCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Trạng thái</p>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-slate-500">
              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
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
            <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Tên:</span>
                <span className="ml-2 font-medium">{order.customer?.name}</span>
              </div>
              <div>
                <span className="text-slate-500">SĐT:</span>
                <span className="ml-2 font-medium">{order.customer?.phone}</span>
              </div>
              {order.customer?.email && (
                <div className="col-span-2">
                  <span className="text-slate-500">Email:</span>
                  <span className="ml-2 font-medium">{order.customer.email}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-slate-500">Địa chỉ:</span>
                <span className="ml-2 font-medium">{order.customer?.address}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-medium mb-3">Sản phẩm</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Sản phẩm</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">SL</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Giá</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">Tổng cộng:</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Phương thức thanh toán</p>
              <p className="font-medium">
                {order.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}
              </p>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div>
              <p className="text-sm text-slate-500">Ghi chú</p>
              <p className="font-medium">{order.note}</p>
            </div>
          )}

          {/* Status Actions */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Cập nhật trạng thái</p>
            <div className="flex flex-wrap gap-2">
              {order.status !== 'pending' && (
                <button
                  onClick={() => handleStatusChange('pending')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200 disabled:opacity-50"
                >
                  Chờ xử lý
                </button>
              )}
              {order.status !== 'processing' && (
                <button
                  onClick={() => handleStatusChange('processing')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 disabled:opacity-50"
                >
                  Đang xử lý
                </button>
              )}
              {order.status !== 'shipped' && (
                <button
                  onClick={() => handleStatusChange('shipped')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 disabled:opacity-50"
                >
                  Đã giao
                </button>
              )}
              {order.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 disabled:opacity-50"
                >
                  Hoàn thành
                </button>
              )}
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 disabled:opacity-50"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Orders Page
// ============================================
export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(status);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(filterStatus || undefined);
  }, [filterStatus, loadOrders]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    loadOrders(filterStatus || undefined);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
          <p className="text-slate-500 mt-1">Quản lý đơn hàng của khách hàng</p>
        </div>
        <button
          onClick={() => loadOrders(filterStatus || undefined)}
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
            <option value="shipped">Đã giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
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
              onClick={() => loadOrders(filterStatus || undefined)}
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
      {!loading && !error && orders.length === 0 && <EmptyState />}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã đơn</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày tạo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{order.customer?.name}</div>
                      <div className="text-xs text-slate-500">{order.customer?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.items?.length} sản phẩm
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
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
              Hiển thị {orders.length} đơn hàng
            </p>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
