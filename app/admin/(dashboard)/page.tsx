'use client';

import { useEffect, useState } from 'react';
import { 
  Laptop, 
  Wrench, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// Types
// ============================================
interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

// ============================================
// API Functions - Debug & Error Handling
// ============================================
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'API returned failure');
    }
    return data;
  } catch (error: any) {
    console.error(`❌ API Error [${url}]:`, error.message);
    throw error;
  }
}

// ============================================
// Stat Card Component
// ============================================
function StatCard({ title, value, change, trend, icon, color }: StatCard) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Quick Action Card
// ============================================
function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon, 
  buttonText 
}: { 
  title: string; 
  description: string; 
  href: string; 
  icon: React.ReactNode;
  buttonText: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
          <Link 
            href={href}
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Recent Orders Table
// ============================================
function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-lg">Đơn hàng gần đây</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã đơn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium">{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// Loading Skeleton
// ============================================
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-slate-200 rounded mt-3 animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="mt-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Error State Component
// ============================================
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Đã xảy ra lỗi</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>
  );
}

// ============================================
// Main Dashboard Page
// ============================================
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    services: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Parallel API calls for better performance
      const [laptopsRes, ordersRes, customersRes, servicesRes] = await Promise.allSettled([
        fetch('/api/admin/laptops').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
      ]);

      const laptops = laptopsRes.status === 'fulfilled' ? laptopsRes.value : { data: [] };
      const orders  = ordersRes.status  === 'fulfilled' ? ordersRes.value  : { data: [] };
      const customers = customersRes.status === 'fulfilled' ? customersRes.value : { data: [] };
      const services  = servicesRes.status  === 'fulfilled' ? servicesRes.value  : { data: [] };

      setStats({
        products:  laptops.data?.length   || 0,
        orders:    orders.data?.length    || 0,
        customers: customers.data?.length || 0,
        services:  services.data?.length  || 0,
      });

      // Lấy 5 đơn hàng gần nhất
      if (orders.data && orders.data.length > 0) {
        setRecentOrders(
          orders.data.slice(0, 5).map((order: any) => ({
            id: order._id,
            customerName: order.customerId?.name || order.customer?.name || 'Khách vãng lai',
            total: order.totalAmount || order.total || 0,
            status: order.status || 'pending',
            createdAt: order.createdAt,
          }))
        );
      }
    } catch (err: any) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
        <p className="text-slate-500 mt-1">Chào mừng đến với trang quản trị LapLap Cần Thơ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng sản phẩm"
          value={stats.products}
          icon={<Laptop className="text-blue-600" size={24} />}
          color="bg-blue-50"
        />
        <StatCard
          title="Đơn hàng"
          value={stats.orders}
          icon={<ShoppingCart className="text-green-600" size={24} />}
          color="bg-green-50"
        />
        <StatCard
          title="Khách hàng"
          value={stats.customers}
          icon={<Users className="text-purple-600" size={24} />}
          color="bg-purple-50"
        />
        <StatCard
          title="Dịch vụ sửa chữa"
          value={stats.services}
          icon={<Wrench className="text-orange-600" size={24} />}
          color="bg-orange-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Thêm sản phẩm mới"
          description="Nhập laptop mới vào kho hàng"
          href="/admin/laptops?action=add"
          icon={<Package size={24} />}
          buttonText="Thêm ngay"
        />
        <QuickActionCard
          title="Xem đơn hàng"
          description="Quản lý đơn hàng của khách"
          href="/admin/orders"
          icon={<ShoppingCart size={24} />}
          buttonText="Xem chi tiết"
        />
        <QuickActionCard
          title="Cấu hình hệ thống"
          description="Cài đặt thông tin cửa hàng"
          href="/admin/settings"
          icon={<DollarSign size={24} />}
          buttonText="Cài đặt"
        />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
