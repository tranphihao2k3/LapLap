'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Bell, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  CreditCard,
  Shield,
  Package,
  Megaphone,
  Settings,
  Trash2,
  Eye,
  Check,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Notification {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  type: 'order' | 'payment' | 'warranty' | 'inventory' | 'system' | 'promotion';
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

const TYPE_CONFIG = {
  order: { label: 'Đơn hàng', color: 'bg-blue-100 text-blue-700', icon: ShoppingCart },
  payment: { label: 'Thanh toán', color: 'bg-green-100 text-green-700', icon: CreditCard },
  warranty: { label: 'Bảo hành', color: 'bg-purple-100 text-purple-700', icon: Shield },
  inventory: { label: 'Tồn kho', color: 'bg-orange-100 text-orange-700', icon: Package },
  system: { label: 'Hệ thống', color: 'bg-slate-100 text-slate-700', icon: Settings },
  promotion: { label: 'Khuyến mãi', color: 'bg-pink-100 text-pink-700', icon: Megaphone }
};

const PRIORITY_CONFIG = {
  low: { label: 'Thấp', color: 'bg-slate-100 text-slate-600' },
  normal: { label: 'Bình thường', color: 'bg-blue-100 text-blue-600' },
  high: { label: 'Cao', color: 'bg-orange-100 text-orange-600' },
  urgent: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-600' }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'system' as Notification['type'],
    title: '',
    message: '',
    priority: 'normal' as Notification['priority'],
    referenceType: '',
    referenceId: ''
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterRead) params.append('isRead', filterRead);
      
      const response = await fetch(`/api/admin/notifications?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterPriority, filterRead]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Tạo thông báo thành công');
        setIsModalOpen(false);
        resetForm();
        fetchNotifications();
      } else {
        toast.error(result.error || 'Lỗi khi tạo');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Đã đánh dấu đã đọc');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa thành công');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'system',
      title: '',
      message: '',
      priority: 'normal',
      referenceType: '',
      referenceId: ''
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thông báo</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `Có ${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo thông báo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            <option value="order">Đơn hàng</option>
            <option value="payment">Thanh toán</option>
            <option value="warranty">Bảo hành</option>
            <option value="inventory">Tồn kho</option>
            <option value="system">Hệ thống</option>
            <option value="promotion">Khuyến mãi</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả mức độ</option>
            <option value="low">Thấp</option>
            <option value="normal">Bình thường</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </select>
          
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="false">Chưa đọc</option>
            <option value="true">Đã đọc</option>
          </select>
          
          <button
            onClick={fetchNotifications}
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
              <Bell className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng thông báo</p>
              <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Chưa đọc</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ưu tiên cao</p>
              <p className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đã đọc</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.isRead).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="mx-auto mb-2 text-slate-300" size={48} />
            <p>Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => {
              const typeConfig = TYPE_CONFIG[notification.type];
              const priorityConfig = PRIORITY_CONFIG[notification.priority];
              const TypeIcon = typeConfig.icon;
              
              return (
                <div 
                  key={notification._id} 
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <TypeIcon size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-medium ${
                            !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.color}`}>
                            {priorityConfig.label}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>{typeConfig.label}</span>
                          <span>{new Date(notification.createdAt).toLocaleString('vi-VN')}</span>
                          {notification.userId && (
                            <span>Bởi: {notification.userId.name}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Đánh dấu đã đọc"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Tạo thông báo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="order">Đơn hàng</option>
                    <option value="payment">Thanh toán</option>
                    <option value="warranty">Bảo hành</option>
                    <option value="inventory">Tồn kho</option>
                    <option value="system">Hệ thống</option>
                    <option value="promotion">Khuyến mãi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Thấp</option>
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
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
                  Tạo thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
