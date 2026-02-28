"use client";

import { useEffect, useState, useCallback } from "react";
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
  Truck,
  Trash2,
  X,
  User,
  MessageCircle,
} from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Toaster, toast } from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";
import { searchMatch } from "@/lib/normalize";

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
  images?: string[];
  status: string;
  priority: string;
  issueDescription: string;
  estimatedCost: number;
  actualCost: number;
  receivedDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  quotedPrice?: number;
}

// ============================================
// API Functions
// ============================================
async function fetchServices(status?: string): Promise<ServiceType[]> {
  try {
    const url = status ? `/api/services?status=${status}` : "/api/services";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch services");
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error("❌ [GET /api/services] Error:", error.message);
    throw error;
  }
}

// ============================================
// Status Badge
// ============================================
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    diagnosing: { bg: "bg-blue-100", text: "text-blue-700" },
    in_progress: { bg: "bg-purple-100", text: "text-purple-700" },
    waiting_parts: { bg: "bg-orange-100", text: "text-orange-700" },
    completed: { bg: "bg-green-100", text: "text-green-700" },
    cancelled: { bg: "bg-red-100", text: "text-red-700" },
  };

  const labels: Record<string, string> = {
    pending: "Chờ tiếp nhận",
    diagnosing: "Đang chẩn đoán",
    in_progress: "Đang sửa chữa",
    waiting_parts: "Chờ linh kiện",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const style = styles[status] || styles.pending;

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}
    >
      {labels[status] || status}
    </span>
  );
}

// ============================================
// Priority Badge
// ============================================
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    low: { bg: "bg-slate-100", text: "text-slate-600" },
    normal: { bg: "bg-blue-100", text: "text-blue-600" },
    high: { bg: "bg-orange-100", text: "text-orange-600" },
    urgent: { bg: "bg-red-100", text: "text-red-600" },
  };

  const labels: Record<string, string> = {
    low: "Thấp",
    normal: "Bình thường",
    high: "Cao",
    urgent: "Khẩn cấp",
  };

  const style = styles[priority] || styles.normal;

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}
    >
      {labels[priority] || priority}
    </span>
  );
}

// ============================================
// Service Type Badge
// ============================================
function TypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; color: string }> = {
    repair: { label: "Sửa chữa", color: "bg-red-100 text-red-700" },
    cleaning: { label: "Vệ sinh", color: "bg-cyan-100 text-cyan-700" },
    upgrade: { label: "Nâng cấp", color: "bg-purple-100 text-purple-700" },
    warranty: { label: "Bảo hành", color: "bg-green-100 text-green-700" },
    inspection: { label: "Kiểm tra", color: "bg-slate-100 text-slate-700" },
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
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        Chưa có dịch vụ nào
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Danh sách dịch vụ sửa chữa sẽ hiển thị ở đây
      </p>
    </div>
  );
}

// ============================================
// Service Detail Modal
// ============================================
function ServiceDetailModal({
  service,
  onClose,
}: {
  service: ServiceType;
  onClose: () => void;
}) {
  const [quotedPriceInput, setQuotedPriceInput] = useState<string>(
    service.quotedPrice ? String(service.quotedPrice) : "",
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const handleSaveQuotedPrice = async () => {
    try {
      const res = await fetch(`/api/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotedPrice: Number(quotedPriceInput || 0),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã lưu giá báo thành công!");
        onClose();
      } else {
        toast.error(data.error || "Không thể lưu giá báo");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi lưu giá báo");
    }
  };

  const openZaloQuote = () => {
    if (!service.customerPhone) {
      toast.error("Không có số điện thoại khách hàng");
      return;
    }

    const quoted = Number(quotedPriceInput || 0);
    if (!quoted || quoted <= 0) {
      toast.error("Vui lòng nhập giá báo trước khi gửi Zalo");
      return;
    }

    const message = `LapLap xin báo giá sửa chữa ${service.productInfo?.model || "máy"}: ${formatPrice(quoted)}. Nếu đồng ý, bạn phản hồi giúp shop để chốt đơn nhé.`;
    const zaloUrl = `https://zalo.me/${service.customerPhone}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold">Chi tiết dịch vụ</h2>
            <p className="text-sm text-slate-500">
              Mã: {service.serviceNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
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
                <span className="ml-2 font-medium">
                  {service.customerPhone}
                </span>
              </div>
            </div>
          </div>

          {service.productInfo && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Thông tin sản phẩm</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Hãng:</span>
                  <span className="ml-2 font-medium">
                    {service.productInfo.brand || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Model:</span>
                  <span className="ml-2 font-medium">
                    {service.productInfo.model || "-"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Serial:</span>
                  <span className="ml-2 font-medium">
                    {service.productInfo.serialNumber || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {service.images && service.images.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Hình ảnh lỗi / sửa chữa</h3>
              <PhotoProvider>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {service.images.map((img, index) => (
                    <PhotoView key={`${img}-${index}`} src={img}>
                      <img
                        src={img}
                        alt={`Ảnh dịch vụ ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-zoom-in hover:opacity-90 transition"
                      />
                    </PhotoView>
                  ))}
                </div>
              </PhotoProvider>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Vấn đề</h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              {service.issueDescription}
            </p>
          </div>

          {service.notes && (
            <div>
              <h3 className="font-medium mb-2">Ghi chú</h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                {service.notes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Chi phí dự kiến</p>
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(service.estimatedCost)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Chi phí thực tế</p>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(service.actualCost)}
              </p>
            </div>
          </div>

          {/* Giá báo và gửi Zalo */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Báo giá khách hàng
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Giá báo (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={quotedPriceInput}
                  onChange={(e) => setQuotedPriceInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="Nhập giá báo cho khách"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSaveQuotedPrice}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Lưu giá báo
                </button>
                <button
                  type="button"
                  onClick={openZaloQuote}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={16} />
                  Gửi báo giá qua Zalo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Ngày tiếp nhận</p>
              <p className="font-medium">
                {service.receivedDate
                  ? new Date(service.receivedDate).toLocaleDateString("vi-VN")
                  : "-"}
              </p>
            </div>
            {service.completedDate && (
              <div>
                <p className="text-slate-500">Ngày hoàn thành</p>
                <p className="font-medium">
                  {new Date(service.completedDate).toLocaleDateString("vi-VN")}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null,
  );
  const [formData, setFormData] = useState({
    serviceType: "repair",
    customerName: "",
    customerPhone: "",
    productInfo: {
      brand: "",
      model: "",
      serialNumber: "",
    },
    images: [] as string[],
    status: "pending",
    priority: "normal",
    issueDescription: "",
    notes: "",
    estimatedCost: 0,
    actualCost: 0,
  });

  const loadServices = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServices(status);
      console.log("📦 [Services] Loaded data:", data);
      console.log("📦 [Services] First service images:", data[0]?.images);
      setServices(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices(filterStatus || undefined);
  }, [filterStatus, loadServices]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !searchTerm ||
      searchMatch(searchTerm, service.serviceNumber) ||
      searchMatch(searchTerm, service.customerName) ||
      searchMatch(searchTerm, service.customerPhone) ||
      searchMatch(searchTerm, service.productInfo?.model || "") ||
      searchMatch(searchTerm, service.issueDescription);

    const matchesStatus = !filterStatus || service.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const handleOpenModal = (service?: ServiceType) => {
    if (service) {
      setEditingService(service);
      setFormData({
        serviceType: service.serviceType,
        customerName: service.customerName,
        customerPhone: service.customerPhone,
        productInfo: {
          brand: service.productInfo?.brand || "",
          model: service.productInfo?.model || "",
          serialNumber: service.productInfo?.serialNumber || "",
        },
        images: service.images || [],
        status: service.status,
        priority: service.priority,
        issueDescription: service.issueDescription,
        notes: service.notes || "",
        estimatedCost: service.estimatedCost || 0,
        actualCost: service.actualCost || 0,
      });
    } else {
      setEditingService(null);
      setFormData({
        serviceType: "repair",
        customerName: "",
        customerPhone: "",
        productInfo: {
          brand: "",
          model: "",
          serialNumber: "",
        },
        images: [],
        status: "pending",
        priority: "normal",
        issueDescription: "",
        notes: "",
        estimatedCost: 0,
        actualCost: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService
        ? `/api/services/${editingService._id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          editingService ? "Cập nhật thành công!" : "Tạo mới thành công!",
        );
        handleCloseModal();
        loadServices(filterStatus || undefined);
      } else {
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa thành công!");
        loadServices(filterStatus || undefined);
      } else {
        toast.error(data.error || "Lỗi khi xóa");
      }
    } catch (err) {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý Dịch vụ Sửa chữa
          </h1>
          <p className="text-slate-500 mt-1">Quản lý dịch vụ sửa chữa laptop</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadServices(filterStatus || undefined)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tạo dịch vụ</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã, tên, SĐT, model, lỗi..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Mã DV
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Chi phí
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Ngày tiếp nhận
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {service.serviceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={service.serviceType} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {service.customerName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {service.customerPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {service.productInfo?.model || "-"}
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
                      {service.receivedDate
                        ? new Date(service.receivedDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              Hiển thị {filteredServices.length} / {services.length} dịch vụ
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">
                {editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ mới"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form
                id="service-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Loại dịch vụ *
                    </label>
                    <select
                      required
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    >
                      <option value="repair">Sửa chữa</option>
                      <option value="cleaning">Vệ sinh</option>
                      <option value="upgrade">Nâng cấp</option>
                      <option value="warranty">Bảo hành</option>
                      <option value="inspection">Kiểm tra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Trạng thái *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    >
                      <option value="pending">Chờ tiếp nhận</option>
                      <option value="diagnosing">Đang chẩn đoán</option>
                      <option value="in_progress">Đang sửa chữa</option>
                      <option value="waiting_parts">Chờ linh kiện</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                {/* Khách hàng */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                  <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                    <User size={16} /> Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                        Tên khách hàng *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="VD: Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                        Số điện thoại *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="VD: 09..."
                      />
                    </div>
                  </div>
                </div>

                {/* Thiết bị */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Package size={16} /> Thông tin thiết bị
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                        Thương hiệu
                      </label>
                      <input
                        type="text"
                        value={formData.productInfo.brand}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productInfo: {
                              ...formData.productInfo,
                              brand: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="VD: Dell"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                        Model
                      </label>
                      <input
                        type="text"
                        value={formData.productInfo.model}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productInfo: {
                              ...formData.productInfo,
                              model: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="VD: XPS 15 9520"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                        Số Serial
                      </label>
                      <input
                        type="text"
                        value={formData.productInfo.serialNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productInfo: {
                              ...formData.productInfo,
                              serialNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="S/N..."
                      />
                    </div>
                  </div>
                </div>

                {/* Hình ảnh */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Hình ảnh (Lỗi, tình trạng máy)
                  </label>
                  <ImageUploader
                    value={formData.images}
                    onChange={(urls) =>
                      setFormData({ ...formData, images: urls })
                    }
                    maxImages={5}
                  />
                </div>

                {/* Vấn đề */}
                <div>
                  <div className="flex gap-4 mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase flex-1">
                      Mô tả lỗi / Yêu cầu *
                    </label>
                    <label className="block text-xs font-semibold text-slate-500 uppercase w-32">
                      Độ ưu tiên
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <textarea
                      required
                      value={formData.issueDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issueDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none"
                      placeholder="Mô tả chi tiết tình trạng máy..."
                    />
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-32 h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    >
                      <option value="low">Thấp</option>
                      <option value="normal">Bình thường</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                  </div>
                </div>

                {/* Chi phí */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Chi phí dự kiến (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.estimatedCost || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedCost: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Chi phí thực tế (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.actualCost || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actualCost: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-green-600"
                    />
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Ghi chú nội bộ
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none"
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="service-form"
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
              >
                {editingService ? "Lưu thay đổi" : "Tạo dịch vụ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
