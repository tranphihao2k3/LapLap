'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw,
  Facebook,
  ExternalLink,
  Trash2,
  Eye,
  X,
  Edit2,
  CheckCircle,
  XCircle,
  GripVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FacebookGroup {
  _id: string;
  name: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function FacebookGroupsPage() {
  const [groups, setGroups] = useState<FacebookGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FacebookGroup | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    order: 0,
    isActive: true
  });

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/facebook-groups');
      const result = await response.json();
      
      if (result.success) {
        setGroups(result.data);
      } else {
        toast.error(result.error || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/facebook-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Thêm nhóm thành công');
        setIsModalOpen(false);
        resetForm();
        fetchGroups();
      } else {
        toast.error(result.error || 'Lỗi khi thêm nhóm');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    
    try {
      const response = await fetch(`/api/admin/facebook-groups/${selectedGroup._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật thành công');
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedGroup(null);
        resetForm();
        fetchGroups();
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhóm này?')) return;
    
    try {
      const response = await fetch(`/api/admin/facebook-groups/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa thành công');
        fetchGroups();
      } else {
        toast.error(result.error || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      order: 0,
      isActive: true
    });
  };

  const openEditModal = (group: FacebookGroup) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      url: group.url,
      order: group.order,
      isActive: group.isActive
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nhóm Facebook</h1>
          <p className="text-slate-500">Quản lý các nhóm Facebook liên kết</p>
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
          Thêm nhóm
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
                placeholder="Tìm kiếm tên nhóm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={fetchGroups}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Facebook className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng nhóm</p>
              <p className="text-2xl font-bold text-slate-800">{groups.length}</p>
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
                {groups.filter(g => g.isActive).length}
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
                {groups.filter(g => !g.isActive).length}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thứ tự</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên nhóm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Link</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  Đang tải...
                </td>
              </tr>
            ) : filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Chưa có nhóm Facebook nào
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => (
                <tr key={group._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-slate-400" />
                      <span className="font-medium">{group.order}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{group.name}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(group.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={group.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      {group.url.substring(0, 40)}...
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {group.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <a
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Mở link"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => openEditModal(group)}
                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Sửa nhóm' : 'Thêm nhóm Facebook'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên nhóm *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Laptop Cũ Giá Rẻ"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Facebook *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/groups/..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Hiển thị</option>
                    <option value="false">Ẩn</option>
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
