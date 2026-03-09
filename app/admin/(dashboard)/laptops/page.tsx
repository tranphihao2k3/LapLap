'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Laptop,
  Search,
  Plus,
  Pencil,
  Trash2,
  Filter,
  AlertCircle,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  getProducts,
  getBrands,
  getCategories,
  deleteProduct as deleteProductApi
} from '@/lib/api/products';
import { Product, Brand, Category } from '@/types/api';


// Local wrappers removed in favor of @/lib/api/products imports

// ============================================
// Loading Skeleton
// ============================================
function LoadingTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-slate-200">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
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
      <Laptop className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Chưa có sản phẩm nào</h3>
      <p className="mt-2 text-sm text-slate-500">Hãy thêm sản phẩm laptop đầu tiên của bạn</p>
      <button
        onClick={onAddNew}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
      >
        <Plus size={18} />
        Thêm sản phẩm
      </button>
    </div>
  );
}

// ============================================
// Product Table Row
// ============================================
function ProductRow({
  product,
  onEdit,
  onDelete
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'inactive') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Ngừng bán</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Còn hàng</span>;
  };

  const getSpec = (keys: string[]) => {
    const specs: any = product.specs || {};
    for (const key of keys) {
      if (specs[key]) return specs[key];
    }
    return '-';
  };

  const currentPrice = product.salePrice || product.basePrice || product.price || 0;
  const brandName = typeof product.brand === 'object' ? product.brand?.name : (typeof product.brandId === 'object' ? product.brandId?.name : '-');

  return (
    <tr className="hover:bg-slate-50">
      {/* Image */}
      <td className="px-4 py-3">
        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
          {product.image || product.images?.[0] ? (
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Laptop size={20} className="text-slate-400" />
            </div>
          )}
        </div>
      </td>

      {/* Name & Model */}
      <td className="px-4 py-3">
        <div className="font-medium text-slate-900">{product.name}</div>
        <div className="text-sm text-slate-500">{product.slug}</div>
      </td>

      {/* Brand */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {brandName}
      </td>

      {/* CPU */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {getSpec(['CPU', 'cpu', 'Vi xử lý'])}
      </td>

      {/* RAM */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {getSpec(['RAM', 'ram', 'Bộ nhớ'])}
      </td>

      {/* SSD */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {getSpec(['Ổ cứng', 'SSD', 'ssd', 'SSD/HDD'])}
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <span className="font-medium text-slate-900">{formatPrice(currentPrice)}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {getStatusBadge(product.status)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Sửa"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// Main Laptops Page
// ============================================
export default function LaptopsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCPU, setFilterCPU] = useState('');
  const [filterRAM, setFilterRAM] = useState('');
  const [filterGPU, setFilterGPU] = useState('');
  const [filterSSD, setFilterSSD] = useState('');
  const [filterScreen, setFilterScreen] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Delete modal state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);



  // Fetch products
  const loadProducts = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({
        search: searchTerm,
        limit: 100,
        categorySlug: 'laptop'
      });
      if (res.success && res.data) {
        setProducts(res.data);
      } else {
        throw new Error(res.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load brands & categories
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          getBrands({ limit: 100 }),
          getCategories()
        ]);

        if (brandsRes.success && brandsRes.data) setBrands(brandsRes.data);
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);

        await loadProducts();
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, [loadProducts]);


  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(search);
  };

  // Add new product
  const handleAddNew = () => {
    router.push('/admin/laptops/new');
  };

  // Edit product
  const handleEdit = (product: Product) => {
    router.push(`/admin/laptops/${product._id}`);
  };


  // Delete product
  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingProduct) return;

    setSubmitting(true);
    try {
      const res = await deleteProductApi(deletingProduct._id);
      if (res.success) {
        toast.success('Xóa sản phẩm thành công!');
        setDeletingProduct(null);
        loadProducts(search); // Refresh data
      } else {
        throw new Error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };


  // Filter products
  const filteredProducts = products.filter(p => {
    const pBrandId = typeof p.brand === 'object' ? p.brand?._id : (typeof p.brandId === 'object' ? p.brandId?._id : p.brandId);
    if (filterBrand && pBrandId !== filterBrand) return false;

    if (filterStatus === 'active' && p.status !== 'active') return false;
    if (filterStatus === 'inactive' && p.status !== 'inactive') return false;

    const specs: any = p.specs || {};
    const getS = (keys: string[]) => {
      for (const k of keys) if (specs[k]) return specs[k];
      return '';
    };

    // Advanced filters
    if (filterCPU && !getS(['CPU', 'cpu', 'Vi xử lý']).toLowerCase().includes(filterCPU.toLowerCase())) return false;
    if (filterRAM && !getS(['RAM', 'ram', 'Bộ nhớ']).toLowerCase().includes(filterRAM.toLowerCase())) return false;
    if (filterGPU && !getS(['Card đồ họa', 'GPU', 'gpu', 'VGA']).toLowerCase().includes(filterGPU.toLowerCase())) return false;
    if (filterSSD && !getS(['Ổ cứng', 'SSD', 'ssd', 'SSD/HDD']).toLowerCase().includes(filterSSD.toLowerCase())) return false;
    if (filterScreen && !getS(['Màn hình', 'screen', 'Kích thước màn hình']).toLowerCase().includes(filterScreen.toLowerCase())) return false;

    // Price range filter
    const currentPrice = p.salePrice || p.basePrice || p.price || 0;
    if (filterMinPrice && currentPrice < parseInt(filterMinPrice)) return false;
    if (filterMaxPrice && currentPrice > parseInt(filterMaxPrice)) return false;

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setFilterBrand('');
    setFilterStatus('');
    setFilterCPU('');
    setFilterRAM('');
    setFilterGPU('');
    setFilterSSD('');
    setFilterScreen('');
    setFilterMinPrice('');
    setFilterMaxPrice('');
  };

  // Extract unique filter options from actual data
  const getOptions = (keys: string[]) => {
    const opts = new Set<string>();
    products.forEach(p => {
      const specs: any = p.specs || {};
      for (const k of keys) {
        if (specs[k]) {
          opts.add(specs[k]);
          break;
        }
      }
    });
    return Array.from(opts).sort();
  };

  const cpuOptions = getOptions(['CPU', 'cpu', 'Vi xử lý']);
  const ramOptions = getOptions(['RAM', 'ram', 'Bộ nhớ']);
  const gpuOptions = getOptions(['Card đồ họa', 'GPU', 'gpu', 'VGA']);
  const ssdOptions = getOptions(['Ổ cứng', 'SSD', 'ssd', 'SSD/HDD']);
  const screenOptions = getOptions(['Màn hình', 'screen', 'Kích thước màn hình']);



  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Kho Laptop</h1>
          <p className="text-slate-500 mt-1">Quản lý danh sách laptop trong cửa hàng</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Basic Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Còn hàng</option>
              <option value="inactive">Ngừng bán</option>
            </select>

            {/* Search Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 inline-flex items-center gap-2"
            >
              <Search size={18} />
              Tìm
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => loadProducts(search)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <Filter size={16} />
              {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
            </button>

            {(filterCPU || filterRAM || filterGPU || filterSSD || filterScreen || filterMinPrice || filterMaxPrice) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
              >
                <X size={16} />
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Advanced Filters Row */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 pt-2 border-t border-slate-100">
              {/* CPU Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">CPU ({cpuOptions.length})</label>
                <select
                  value={filterCPU}
                  onChange={(e) => setFilterCPU(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Tất cả CPU</option>
                  {cpuOptions.map(cpu => (
                    <option key={cpu} value={cpu}>{cpu}</option>
                  ))}
                </select>
              </div>


              {/* RAM Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">RAM ({ramOptions.length})</label>
                <select
                  value={filterRAM}
                  onChange={(e) => setFilterRAM(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Tất cả RAM</option>
                  {ramOptions.map(ram => (
                    <option key={ram} value={ram}>{ram}</option>
                  ))}
                </select>
              </div>


              {/* GPU Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">GPU ({gpuOptions.length})</label>
                <select
                  value={filterGPU}
                  onChange={(e) => setFilterGPU(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Tất cả GPU</option>
                  {gpuOptions.map(gpu => (
                    <option key={gpu} value={gpu}>{gpu}</option>
                  ))}
                </select>
              </div>


              {/* SSD Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">SSD ({ssdOptions.length})</label>
                <select
                  value={filterSSD}
                  onChange={(e) => setFilterSSD(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Tất cả SSD</option>
                  {ssdOptions.map(ssd => (
                    <option key={ssd} value={ssd}>{ssd}</option>
                  ))}
                </select>
              </div>


              {/* Screen Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Màn hình ({screenOptions.length})</label>
                <select
                  value={filterScreen}
                  onChange={(e) => setFilterScreen(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Tất cả size</option>
                  {screenOptions.map(screen => (
                    <option key={screen} value={screen}>{screen}</option>
                  ))}
                </select>
              </div>


              {/* Min Price */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Giá từ</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filterMinPrice}
                  onChange={(e) => setFilterMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Giá đến</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </form>
      </div>


      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-900">Đã xảy ra lỗi</p>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => loadProducts(search)}
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
      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState onAddNew={handleAddNew} />
      )}

      {/* Products Table */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ảnh</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thương hiệu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">CPU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">RAM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">SSD</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giá bán</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map(product => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              Hiển thị {filteredProducts.length} sản phẩm
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}

      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeletingProduct(null)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                <p className="mt-2 text-slate-600">
                  Bạn có chắc chắn muốn xóa sản phẩm <strong>{deletingProduct.name}</strong>?
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
