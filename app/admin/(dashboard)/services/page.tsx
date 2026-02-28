'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  RefreshCw,
  AlertCircle,
  Loader2,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface ServiceType {
  _id: string;
  serviceNumber: string;
  serviceType: string;
  customerName: string;
  customerPhone: string;
  productInfo?: {
    brand?: string;
    model?: string;
    serialNumber?: string;
  };
  status: string;
  priority: string;
  issueDescription: string;
  estimatedCost: number;
  actualCost: number;
  receivedDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

// ============================================
// API Functions
// ============================================
async function fetchServices(status?: string): Promise<ServiceType[]> {
  try {
    const url = status ? `/api/services?status=${status}` : '/api/services';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch services');
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('❌ [GET /api/services] Error:', error.message);
    throw error;
  }
}

// ============================================
// Status Badge
// ============================================
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    diagnosing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    in_progress: { bg: 'bg-purple-100', text: 'text-purple-700' },
    waiting_parts: { bg: 'bg-orange-100', text: 'text-orange-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  
  const labels: Record<string, string> = {
    pending: 'Chờ tiếp nhận',
    diagnosing: 'Đang chẩn đoán',
    in_progress: 'Đang sửa chữa',
    waiting_parts: 'Chờ linh kiện',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  const style = styles[status] || styles.pending;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      {labels[status] || status}
    </span>
  );
}

// ============================================
// Priority Badge
// ============================================
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-slate-100', text: 'text-slate-600' },
    normal: { bg: 'bg-blue-100', text: 'text-blue-600' },
    high: { bg: 'bg-orange-100', text: 'text-orange-600' },
    urgent: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  
  const labels: Record<string, string> = {
    low: 'Thấp',
    normal: 'Bình thường',
    high: 'Cao',
    urgent: 'Khẩn cấp',
  };

  const style = styles[priority] || styles.normal;
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}>
      {labels[priority] || priority}
    </span>
  );
}

// ============================================
// Service Type Badge
// ============================================
function TypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; color: string }> = {
    repair: { label: 'Sửa chữa', color: 'bg-red-100 text-red-700' },
    cleaning: { label: 'Vệ sinh', color: 'bg-cyan-100 text-cyan-700' },
    upgrade: { label: 'Nâng cấp', color: 'bg-purple-100 text-purple-700' },
    warranty: { label: 'Bảo hành', color: 'bg-green-100 text-green-700' },
    inspection: { label: 'Kiểm tra', color: 'bg-slate-100 text-slate-700' },
  };

  const t = types[type] || types.inspection;
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${t.color}`}>
      {t.label}
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
            <div className="w-20 h-6 bg-slate-200 rounded animate-pulse" />
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
      <Wrench className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có dịch vụ nào</h3>
      <p className="mt-2 text-sm text-slate-500">Danh sách dịch vụ sửa chữa sẽ hiển thị ở đây</p>
    </div>
  );
}

// ============================================
// Service Detail Modal
// ============================================
function ServiceDetailModal({ 
  service, 
  onClose 
}: { 
  service: ServiceType; 
  onClose: () => void;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold">Chi tiết dịch vụ</h2>
            <p className="text-sm text-slate-500">Mã: {service.serviceNumber}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <AlertCircle size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-3">
            <TypeBadge type={service.serviceType} />
            <StatusBadge status={service.status} />
            <PriorityBadge priority={service.priority} />
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Tên:</span>
                <span className="ml-2 font-medium">{service.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500">SĐT:</span>
                <span className="ml-2 font-medium">{service.customerPhone}</span>
              </div>
            </div>
          </div>

          {service.productInfo && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Thông tin sản phẩm</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Hãng:</span>
                  <span className="ml-2 font-medium">{service.productInfo.brand || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Model:</span>
                  <span className="ml-2 font-medium">{service.productInfo.model || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Serial:</span>
                  <span className="ml-2 font-medium">{service.productInfo.serialNumber || '-'}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Vấn đề</h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{service.issueDescription}</p>
          </div>

          {service.notes && (
            <div>
              <h3 className="font-medium mb-2">Ghi chú</h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{service.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Chi phí dự kiến</p>
              <p className="text-lg font-bold text-orange-600">{formatPrice(service.estimatedCost)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Chi phí thực tế</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(service.actualCost)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Ngày tiếp nhận</p>
              <p className="font-medium">
                {service.receivedDate ? new Date(service.receivedDate).toLocaleDateString('vi-VN') : '-'}
              </p>
            </div>
            {service.completedDate && (
              <div>
                <p className="text-slate-500">Ngày hoàn thành</p>
                <p className="font-medium">
                  {new Date(service.completedDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
          </div>
        </div>

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
// Main Services Page
// ============================================
export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const loadServices = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServices(status);
      setServices(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices(filterStatus || undefined);
  }, [filterStatus, loadServices]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Dịch vụ Sửa chữa</h1>
          <p className="text-slate-500 mt-1">Quản lý dịch vụ sửa chữa laptop</p>
        </div>
        <button
          onClick={() => loadServices(filterStatus || undefined)}
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
            <option value="pending">Chờ tiếp nhận</option>
            <option value="diagnosing">Đang chẩn đoán</option>
            <option value="in_progress">Đang sửa chữa</option>
            <option value="waiting_parts">Chờ linh kiện</option>
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
              onClick={() => loadServices(filterStatus || undefined)}
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
      {!loading && !error && services.length === 0 && <EmptyState />}

      {/* Services Table */}
      {!loading && !error && services.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã DV</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Chi phí</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày tiếp nhận</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {service.serviceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={service.serviceType} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{service.customerName}</div>
                      <div className="text-xs text-slate-500">{service.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {service.productInfo?.model || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right">
                      {formatPrice(service.actualCost || service.estimatedCost)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={service.status} />
                        <PriorityBadge priority={service.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {service.receivedDate ? new Date(service.receivedDate).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedService(service)}
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
              Hiển thị {services.length} dịch vụ
            </p>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
