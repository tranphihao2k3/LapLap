'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle,
  Warehouse,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit2,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface InventoryItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    category: string;
  };
  warehouseId: {
    _id: string;
    name: string;
    warehouseCode: string;
  };
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
}

interface Warehouse {
  _id: string;
  name: string;
  warehouseCode: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    minStock: 5,
    maxStock: 100,
    reorderPoint: 10
  });
  const [exportData, setExportData] = useState({
    quantity: 0,
    note: ''
  });

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedWarehouse) params.append('warehouseId', selectedWarehouse);
      if (showLowStock) params.append('lowStock', 'true');
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/inventory?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setInventory(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [selectedWarehouse, showLowStock, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=1000');
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/admin/warehouses');
      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchWarehouses();
  }, [fetchInventory]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setFormData({
          productId: '',
          warehouseId: '',
          quantity: 0,
          minStock: 5,
          maxStock: 100,
          reorderPoint: 10
        });
        fetchInventory();
      } else {
        toast.error(result.error || 'Lỗi khi tạo tồn kho');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      const response = await fetch(`/api/admin/inventory/${selectedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'export',
          exportQuantity: exportData.quantity
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsExportModalOpen(false);
        setExportData({ quantity: 0, note: '' });
        fetchInventory();
      } else {
        toast.error(result.error || 'Lỗi khi xuất kho');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tồn kho này?')) return;
    
    try {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchInventory();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQuantity <= item.reorderPoint) {
      return { label: 'Cảnh báo', color: 'text-red-600 bg-red-50' };
    }
    if (item.availableQuantity <= item.minStock) {
      return { label: 'Thấp', color: 'text-yellow-600 bg-yellow-50' };
    }
    return { label: 'Tốt', color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý tồn kho</h1>
          <p className="text-slate-500">Nhập/xuất kho và theo dõi tồn kho sản phẩm</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nhập kho
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
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả kho</option>
            {warehouses.map(w => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showLowStock 
                ? 'bg-red-50 border-red-300 text-red-700' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle size={18} />
            Tồn kho thấp
          </button>
          
          <button
            onClick={fetchInventory}
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
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-slate-800">{inventory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cảnh báo tồn kho</p>
              <p className="text-2xl font-bold text-red-600">
                {inventory.filter(i => i.availableQuantity <= i.reorderPoint).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng nhập</p>
              <p className="text-2xl font-bold text-slate-800">
                {inventory.reduce((sum, i) => sum + i.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ArrowDownCircle className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đã đặt trước</p>
              <p className="text-2xl font-bold text-slate-800">
                {inventory.reduce((sum, i) => sum + i.reservedQuantity, 0)}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kho</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Tồn kho</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Đặt trước</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Có sẵn</th>
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
            ) : inventory.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Không có dữ liệu tồn kho
                </td>
              </tr>
            ) : (
              inventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{item.productId?.name}</div>
                      <div className="text-sm text-slate-500">SKU: {item.productId?.sku}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Warehouse size={16} className="text-slate-400" />
                        <span className="text-sm">{item.warehouseId?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.reservedQuantity}</td>
                    <td className="px-4 py-3 text-center font-medium text-blue-600">{item.availableQuantity}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setExportData({ quantity: 0, note: '' });
                            setIsExportModalOpen(true);
                          }}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                          title="Xuất kho"
                        >
                          <ArrowDownCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Nhập kho mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sản phẩm</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kho hàng</label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({...formData, warehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn kho</option>
                  {warehouses.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng nhập</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đặt hàng lại</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({...formData, reorderPoint: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tồn kho tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tồn kho tối đa</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
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
                  Nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Xuất kho</h2>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleExport} className="p-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">Sản phẩm: <strong>{selectedItem.productId?.name}</strong></p>
                <p className="text-sm text-slate-600">Kho: <strong>{selectedItem.warehouseId?.name}</strong></p>
                <p className="text-sm text-slate-600">Tồn kho khả dụng: <strong className="text-blue-600">{selectedItem.availableQuantity}</strong></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng xuất</label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.availableQuantity}
                  value={exportData.quantity}
                  onChange={(e) => setExportData({...exportData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <textarea
                  value={exportData.note}
                  onChange={(e) => setExportData({...exportData, note: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Xuất kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
