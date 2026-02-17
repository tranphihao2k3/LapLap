'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Calendar, User, Phone, Laptop, Wrench, MessageSquare, Check, AlertCircle } from 'lucide-react';

interface BookingFormProps {
    title?: string;
    description?: string;
    hotline?: string;
    requestType?: 'repair' | 'cleaning';
}

export default function BookingForm({
    title = "Đặt Lịch Sửa Chữa",
    description = "Điền thông tin để được kỹ thuật viên hỗ trợ nhanh nhất. Chúng tôi sẽ liên hệ lại ngay để xác nhận.",
    hotline = "0978 648 720",
    requestType = 'repair'
}: BookingFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        model: '',
        issue: '',
        notes: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: requestType,
                    ...formData
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', contact: '', model: '', issue: '', notes: '' });
                // Reset status after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Failed to submit booking', error);
            setStatus('error');
        }
    };

    return (
        <section className="py-12 bg-gray-50 rounded-2xl my-8 md:my-16" id="booking-form">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
                    {/* Left Side: Info */}
                    <div className="md:w-2/5 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{title}</h3>
                            <p className="text-blue-100 mb-6">{description}</p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Chuyên Nghiệp</h4>
                                        <p className="text-xs text-blue-200">Kỹ thuật viên tay nghề cao</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Tiết Kiệm Thời Gian</h4>
                                        <p className="text-xs text-blue-200">Đặt lịch trước, không chờ đợi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-blue-500/30">
                            <p className="text-sm text-blue-200">Hotline hỗ trợ kỹ thuật:</p>
                            <p className="text-2xl font-bold">{hotline}</p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="md:w-3/5 p-8">
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Đã Gửi Thành Công!</h3>
                                <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt lịch. Kỹ thuật viên sẽ liên hệ với bạn trong ít phút nữa.</p>
                                <Button onClick={() => setStatus('idle')} variant="outline">Gửi yêu cầu khác</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Họ tên *</label>
                                        <div className="relative">
                                            <input
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="VD: Nguyễn Văn A"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">SĐT / Zalo *</label>
                                        <div className="relative">
                                            <input
                                                required
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="VD: 09..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Tên máy / Model</label>
                                    <div className="relative">
                                        <input
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="VD: Dell XPS 15 9500..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <Laptop className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">
                                        {requestType === 'cleaning' ? 'Tình trạng máy / Yêu cầu' : 'Vấn đề gặp phải *'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            required={requestType !== 'cleaning'}
                                            name="issue"
                                            value={formData.issue}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder={requestType === 'cleaning' ? 'VD: Máy nóng, quạt kêu to...' : 'VD: Mở không lên nguồn, vỡ màn hình...'}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <AlertCircle className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Ghi chú thêm</label>
                                    <div className="relative">
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="VD: Cần lấy máy gấp trong ngày..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        ></textarea>
                                        <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hotline.
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    size="lg"
                                    isLoading={status === 'submitting'}
                                    className="mt-2"
                                >
                                    Gửi Yêu Cầu Sửa Chữa
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
