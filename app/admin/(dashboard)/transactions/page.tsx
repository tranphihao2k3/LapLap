'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit2,
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Transaction {
  _id: string;
  transactionType: 'income' | 'expense';
  category: string;
  amount: number;
  paymentMethod: string;
  description: string;
  notes: string;
  customerId?: { name: string; phone: string };
  supplierId?: { name: string };
  employeeId?: { name: string };
  createdAt: string;
}

interface Stats {
  income: number;
  expense: number;
  balance: number;
}

const CATEGORIES = {
  income: [
    { value: 'sale', label: 'Bán hàng' },
    { value: 'deposit', label: 'Đặt cọc' },
    { value: 'refund', label: 'Hoàn tiền' },
    { value: 'other', label: 'Khác' }
  ],
  expense: [
    { value: 'purchase', label: 'Mua hàng' },
    { value: 'salary', label: 'Lương' },
    { value: 'rent', label: 'Thuê mặt bằng' },
    { value: 'utility', label: 'Điện nước' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'repair', label: 'Sửa chữa' },
    { value: 'other', label: 'Khác' }
  ]
};

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'bank', label: 'Chuyển khoản' },
  { value: 'qr', label: 'QR Code' },
  { value: 'card', label: 'Thẻ' }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [formData, setFormData] = useState({
    transactionType: 'income' as 'income' | 'expense',
    category: 'sale',
    amount: 0,
    paymentMethod: 'cash',
    description: '',
    notes: ''
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterCategory) params.append('category', filterCategory);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      
      const response = await fetch(`/api/admin/transactions?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
        setStats(result.stats);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory, fromDate, toDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setFormData({
          transactionType: 'income',
          category: 'sale',
          amount: 0,
          paymentMethod: 'cash',
          description: '',
          notes: ''
        });
        fetchTransactions();
      } else {
        toast.error(result.error || 'Lỗi khi tạo giao dịch');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    
    try {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchTransactions();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (type: string, category: string) => {
    const list = CATEGORIES[type as keyof typeof CATEGORIES] || [];
    return list.find(c => c.value === category)?.label || category;
  };

  const getPaymentMethodLabel = (method: string) => {
    return PAYMENT_METHODS.find(m => m.value === method)?.label || method;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý thu chi</h1>
          <p className="text-slate-500">Ghi nhận và theo dõi thu chi hàng ngày</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormData({ ...formData, transactionType: 'income' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowUpCircle size={20} />
            Ghi thu
          </button>
          <button
            onClick={() => {
              setFormData({ ...formData, transactionType: 'expense' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <ArrowDownCircle size={20} />
            Ghi chi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng thu</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.income)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng chi</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(stats.expense)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cân bằng</p>
              <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(stats.balance)}
              </p>
            </div>
          </div>
        </div>
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
            <option value="income">Thu</option>
            <option value="expense">Chi</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {[...CATEGORIES.income, ...CATEGORIES.expense].map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Từ ngày"
          />
          
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Đến ngày"
          />
          
          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter size={18} />
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thời gian</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Danh mục</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Số tiền</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thanh toán</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mô tả</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Chưa có giao dịch nào
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      t.transactionType === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {t.transactionType === 'income' ? (
                        <><ArrowUpCircle size={12} /> Thu</>
                      ) : (
                        <><ArrowDownCircle size={12} /> Chi</>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {getCategoryLabel(t.transactionType, t.category)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    t.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.transactionType === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getPaymentMethodLabel(t.paymentMethod)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {formData.transactionType === 'income' ? 'Ghi thu' : 'Ghi chi'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại giao dịch</label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({
                      ...formData, 
                      transactionType: e.target.value as 'income' | 'expense',
                      category: e.target.value === 'income' ? 'sale' : 'purchase'
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="income">Thu</option>
                    <option value="expense">Chi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES[formData.transactionType].map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {PAYMENT_METHODS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả giao dịch..."
                  required
                />
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
                  className={`px-4 py-2 text-white rounded-lg ${
                    formData.transactionType === 'income' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {formData.transactionType === 'income' ? 'Ghi thu' : 'Ghi chi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
