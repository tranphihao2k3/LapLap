'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Save, 
  RefreshCw,
  AlertCircle,
  Loader2,
  Settings as SettingsIcon,
  Store,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// Types
// ============================================
interface Setting {
  _id: string;
  key: string;
  value: string;
  description?: string;
}

// ============================================
// API Functions
// ============================================
async function fetchSettings(): Promise<Setting[]> {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('❌ [GET /api/settings] Error:', error.message);
    throw error;
  }
}

async function saveSetting(key: string, value: string): Promise<void> {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!response.ok) throw new Error('Failed to save setting');
    console.log('✅ [POST /api/settings] Success');
  } catch (error: any) {
    console.error('❌ [POST /api/settings] Error:', error.message);
    throw error;
  }
}

// ============================================
// Default Settings
// ============================================
const defaultSettings = {
  storeName: 'LapLap Cần Thơ',
  storePhone: '0385620679',
  storeEmail: 'laplapcantho@gmail.com',
  storeAddress: '123 Đường 30 Tháng 4, Ninh Kiều, Cần Thơ',
  storeHours: '8:00 - 21:00',
  facebook: 'https://facebook.com/laplapcantho',
  zalo: '0385620679',
  hotline: '0385620679',
  shippingFee: '30000',
  freeShippingThreshold: '500000',
};

// ============================================
// Main Settings Page
// ============================================
export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    storeName: '',
    storePhone: '',
    storeEmail: '',
    storeAddress: '',
    storeHours: '',
    facebook: '',
    zalo: '',
    hotline: '',
    shippingFee: '',
    freeShippingThreshold: '',
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettings();
      const settingsObj: Record<string, string> = {};
      data.forEach((item) => {
        settingsObj[item.key] = item.value;
      });
      setSettings(settingsObj);
      
      setFormData({
        storeName: settingsObj.storeName || defaultSettings.storeName,
        storePhone: settingsObj.storePhone || defaultSettings.storePhone,
        storeEmail: settingsObj.storeEmail || defaultSettings.storeEmail,
        storeAddress: settingsObj.storeAddress || defaultSettings.storeAddress,
        storeHours: settingsObj.storeHours || defaultSettings.storeHours,
        facebook: settingsObj.facebook || defaultSettings.facebook,
        zalo: settingsObj.zalo || defaultSettings.zalo,
        hotline: settingsObj.hotline || defaultSettings.hotline,
        shippingFee: settingsObj.shippingFee || defaultSettings.shippingFee,
        freeShippingThreshold: settingsObj.freeShippingThreshold || defaultSettings.freeShippingThreshold,
      });
    } catch (err: any) {
      setError(err.message);
      setFormData({
        storeName: defaultSettings.storeName,
        storePhone: defaultSettings.storePhone,
        storeEmail: defaultSettings.storeEmail,
        storeAddress: defaultSettings.storeAddress,
        storeHours: defaultSettings.storeHours,
        facebook: defaultSettings.facebook,
        zalo: defaultSettings.zalo,
        hotline: defaultSettings.hotline,
        shippingFee: defaultSettings.shippingFee,
        freeShippingThreshold: defaultSettings.freeShippingThreshold,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const settingsToSave = [
        { key: 'storeName', value: formData.storeName },
        { key: 'storePhone', value: formData.storePhone },
        { key: 'storeEmail', value: formData.storeEmail },
        { key: 'storeAddress', value: formData.storeAddress },
        { key: 'storeHours', value: formData.storeHours },
        { key: 'facebook', value: formData.facebook },
        { key: 'zalo', value: formData.zalo },
        { key: 'hotline', value: formData.hotline },
        { key: 'shippingFee', value: formData.shippingFee },
        { key: 'freeShippingThreshold', value: formData.freeShippingThreshold },
      ];

      await Promise.all(
        settingsToSave.map(s => saveSetting(s.key, s.value))
      );
      
      toast.success('Lưu cài đặt thành công!');
      loadSettings();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (value: string) => {
    const num = parseInt(value || '0');
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cấu hình hệ thống</h1>
          <p className="text-slate-500 mt-1">Quản lý thông tin cửa hàng</p>
        </div>
        <button
          onClick={loadSettings}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Thông tin cửa hàng</h2>
              <p className="text-sm text-slate-500">Thông tin cơ bản của cửa hàng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên cửa hàng
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="storeEmail"
                value={formData.storeEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Giờ mở cửa
              </label>
              <input
                type="text"
                name="storeHours"
                value={formData.storeHours}
                onChange={handleChange}
                placeholder="8:00 - 21:00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ
              </label>
              <textarea
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
              <p className="text-sm text-slate-500">Số hotline và mạng xã hội</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hotline
              </label>
              <input
                type="tel"
                name="hotline"
                value={formData.hotline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Zalo
              </label>
              <input
                type="tel"
                name="zalo"
                value={formData.zalo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Loader2 className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Cấu hình vận chuyển</h2>
              <p className="text-sm text-slate-500">Cài đặt phí vận chuyển</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phí vận chuyển (VND)
              </label>
              <input
                type="number"
                name="shippingFee"
                value={formData.shippingFee}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Hiện tại: {formatPrice(formData.shippingFee)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Miễn phí vận chuyển đơn hàng từ (VND)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Miễn phí vận chuyển cho đơn từ {formatPrice(formData.freeShippingThreshold)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            <Save size={18} />
            Lưu cài đặt
          </button>
        </div>
      </form>
    </div>
  );
}
