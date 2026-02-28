'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  HelpCircle,
  MessageCircle,
  Trash2,
  Eye,
  X,
  Edit2,
  CheckCircle,
  XCircle,
  GripVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Chung',
  product: 'Sản phẩm',
  order: 'Đơn hàng',
  payment: 'Thanh toán',
  shipping: 'Vận chuyển',
  warranty: 'Bảo hành',
  return: 'Đổi trả'
};

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    order: 0,
    isActive: true
  });

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      
      const response = await fetch(`/api/admin/faqs?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setFaqs(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Thêm FAQ thành công');
        setIsModalOpen(false);
        resetForm();
        fetchFaqs();
      } else {
        toast.error(result.error || 'Lỗi khi thêm FAQ');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaq) return;
    
    try {
      const response = await fetch(`/api/admin/faqs/${selectedFaq._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật thành công');
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedFaq(null);
        resetForm();
        fetchFaqs();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa FAQ này?')) return;
    
    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa thành công');
        fetchFaqs();
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order: 0,
      isActive: true
    });
  };

  const openEditModal = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.isActive
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">FAQ - Câu hỏi thường gặp</h1>
          <p className="text-slate-500">Quản lý các câu hỏi và câu trả lời phổ biến</p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm FAQ
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
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <button
            onClick={fetchFaqs}
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
              <HelpCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng FAQ</p>
              <p className="text-2xl font-bold text-slate-800">{faqs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đang hiển thị</p>
              <p className="text-2xl font-bold text-green-600">
                {faqs.filter(f => f.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <XCircle className="text-slate-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đã ẩn</p>
              <p className="text-2xl font-bold text-slate-600">
                {faqs.filter(f => !f.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Danh mục</p>
              <p className="text-2xl font-bold text-purple-600">
                {Object.keys(CATEGORY_LABELS).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            Đang tải...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <HelpCircle className="mx-auto mb-2 text-slate-300" size={48} />
            <p>Chưa có FAQ nào</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredFaqs.map((faq) => (
              <div key={faq._id} className="p-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GripVertical size={16} />
                    <span className="text-sm font-medium">{faq.order}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-slate-800 flex items-center gap-2">
                          {faq.question}
                          {!faq.isActive && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">
                              Đã ẩn
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        {CATEGORY_LABELS[faq.category] || faq.category}
                      </span>
                      <span>
                        {new Date(faq.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Sửa FAQ' : 'Thêm FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Câu hỏi *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Laptop có bảo hành bao lâu?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Câu trả lời *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Nhập câu trả lời chi tiết..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Hiển thị</span>
                </label>
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
                  {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
