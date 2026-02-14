'use client';

import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
}

export default function ImageUploader({
    value = [],
    onChange,
    maxImages = 5
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - value.length;
        if (remainingSlots <= 0) {
            alert(`Chỉ được upload tối đa ${maxImages} ảnh`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadedUrls: string[] = [];

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.success) {
                    uploadedUrls.push(result.data.url);
                } else {
                    alert(`Lỗi upload ${file.name}: ${result.message}`);
                }

                setUploadProgress(((i + 1) / filesToUpload.length) * 100);
            }

            onChange([...value, ...uploadedUrls]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi xảy ra khi upload ảnh');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const removeImage = (index: number) => {
        const newImages = value.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center
                    transition-colors cursor-pointer
                    ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading || value.length >= maxImages}
                />

                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Kéo thả ảnh vào đây hoặc click để chọn
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WebP (tối đa 5MB) - {value.length}/{maxImages} ảnh
                        </p>
                    </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Đang upload... {Math.round(uploadProgress)}%
                        </p>
                    </div>
                )}
            </div>

            {/* Image Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="
                                    absolute top-2 right-2 
                                    bg-red-500 text-white rounded-full p-1
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity
                                    hover:bg-red-600
                                "
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Main Image Badge */}
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Ảnh chính
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {value.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có ảnh nào</p>
                </div>
            )}
        </div>
    );
}
