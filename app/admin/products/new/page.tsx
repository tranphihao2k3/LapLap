// Example: Tạo trang admin để quản lý sản phẩm với upload ảnh Cloudinary
// File: app/admin/products/new/page.tsx

'use client';

import { useState } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function NewProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        price: 0,
        images: [] as string[],
        specs: {
            cpu: '',
            gpu: '',
            ram: '',
            ssd: '',
            screen: '',
            battery: '',
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Tạo product data với ảnh Cloudinary
        const productData = {
            ...formData,
            image: formData.images[0] || '', // Ảnh đầu tiên là ảnh chính
            images: formData.images, // Tất cả ảnh
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Tạo sản phẩm thành công!');
                // Reset form hoặc redirect
            } else {
                alert('Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Thêm Sản phẩm Mới</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Images */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Hình ảnh sản phẩm
                    </label>
                    <ImageUploader
                        value={formData.images}
                        onChange={(urls) => setFormData({ ...formData, images: urls })}
                        maxImages={5}
                    />
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">Tên sản phẩm</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium mb-2">Giá</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">CPU</label>
                        <input
                            type="text"
                            value={formData.specs.cpu}
                            onChange={(e) => setFormData({
                                ...formData,
                                specs: { ...formData.specs, cpu: e.target.value }
                            })}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>
                    {/* Add other spec fields similarly */}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
                >
                    Tạo Sản phẩm
                </button>
            </form>
        </div>
    );
}
