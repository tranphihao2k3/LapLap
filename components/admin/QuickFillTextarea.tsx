'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X, CheckCircle } from 'lucide-react';

interface QuickFillTextareaProps {
    onParsed: (data: any) => void;
}

export default function QuickFillTextarea({ onParsed }: QuickFillTextareaProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleParse = async () => {
        if (!text.trim()) {
            setError('Vui lòng nhập mô tả sản phẩm');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const response = await fetch('/api/parse-product-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            const result = await response.json();

            clearInterval(progressInterval);
            setProgress(100);

            if (result.success) {
                setSuccess(true);
                onParsed(result.data);

                // Auto-collapse after 1.5 seconds
                setTimeout(() => {
                    setText('');
                    setIsExpanded(false);
                    setSuccess(false);
                    setProgress(0);
                }, 1500);
            } else {
                setError(result.message || 'Không thể phân tích dữ liệu');
                setProgress(0);
            }
        } catch (err) {
            clearInterval(progressInterval);
            console.error('Parse error:', err);
            setError('Có lỗi xảy ra khi phân tích');
            setProgress(0);
        } finally {
            setLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                    <Sparkles className="w-4 h-4" />
                    AI Quick Fill
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">AI Quick Fill - Tự động điền thông tin</h3>
                </div>
                <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-white/50 rounded transition-colors"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
                Paste mô tả sản phẩm từ Facebook, Zalo, v.v. và AI sẽ tự động điền thông tin vào form
            </p>

            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    setError('');
                }}
                placeholder="Ví dụ:
💻Asus TUF FA507NUR
⚡️Cpu R7-7435Hs(16Cpus)
⚡️Ram 16G/ Ssd Nvme 512G
⚡️Màn 15.6FHD 144Hz
⚡️Vga RTX 4050 6G 140W
💵Chỉ 17.500K
⏰Bảo hành shop 3 tháng
🎁Balo + túi chống sốc + chuột"
                className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={8}
                disabled={loading}
            />

            {/* Progress Bar */}
            {loading && (
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-purple-600 font-medium">Đang phân tích...</span>
                        <span className="text-sm text-purple-600 font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Đã tự động điền thông tin thành công!</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="flex gap-2 mt-3">
                <button
                    type="button"
                    onClick={handleParse}
                    disabled={loading || !text.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang phân tích...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Parse with AI
                        </>
                    )}
                </button>

                {text && !loading && (
                    <button
                        type="button"
                        onClick={() => {
                            setText('');
                            setError('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
