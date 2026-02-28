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
  Package,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  status: string;
  stock?: number;
  images?: string[];
  image?: string;
  brandId?: { _id: string; name: string };
  categoryId?: { _id: string; name: string };
  createdAt: string;
}

// ============================================
// Helpers
// ============================================
const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// ============================================
// Loading Skeleton
// ============================================
function LoadingTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Main Products Page
// ============================================
export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '200');

      const res = await fetch(`/api/admin/laptops?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/laptops/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Đã xóa sản phẩm');
        loadProducts(search);
      } else {
        toast.error(data.message || 'Lỗi khi xóa');
      }
    } catch {
      toast.error('Lỗi kết nối');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.brandId?.name?.toLowerCase().includes(q) ||
      p.categoryId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 mt-1">
            {products.length} sản phẩm trong kho
          </p>
        </div>
        <Link
          href="/admin/laptops"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, thương hiệu, danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => { setSearch(''); loadProducts(); }}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 inline-flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingTable />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">Không có sản phẩm nào</h3>
          <p className="mt-2 text-sm text-slate-500">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
          <Link
            href="/admin/laptops"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Thêm sản phẩm
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Danh mục / Thương hiệu
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Giá bán
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const img = product.images?.[0] || product.image;
                  return (
                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            {img ? (
                              <img
                                src={img}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm line-clamp-2 leading-tight">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">
                              {product._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category / Brand */}
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {product.categoryId?.name && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {product.categoryId.name}
                            </span>
                          )}
                          {product.brandId?.name && (
                            <p className="text-slate-500 text-xs mt-1">{product.brandId.name}</p>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {formatPrice(product.salePrice || product.price)}
                          </p>
                          {product.salePrice && product.salePrice < product.price && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : product.status === 'out_of_stock'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {product.status === 'active'
                            ? 'Đang bán'
                            : product.status === 'out_of_stock'
                            ? 'Hết hàng'
                            : 'Ngừng bán'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {product.slug && (
                            <a
                              href={`/laptops/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                              title="Xem trang"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <Link
                            href={`/admin/laptops/${product._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Sửa"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Xóa"
                          >
                            {deleting === product._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị <span className="font-medium">{filtered.length}</span> / {products.length} sản phẩm
            </p>
            <Link
              href="/admin/laptops"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Quản lý chi tiết →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
