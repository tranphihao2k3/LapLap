'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Animated 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-[150px] md:text-[200px] font-black text-slate-200 leading-none select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-2xl rotate-12">
                            <RefreshCcw className="w-16 h-16 animate-spin-slow" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Oops! Trang không tồn tại
                    </h2>
                    <p className="text-slate-600 text-lg max-w-lg mx-auto">
                        Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển hoặc không còn tồn tại.
                        Đừng lo, hãy quay về trang chủ để tiếp tục mua sắm nhé!
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Button
                        href="/"
                        size="lg"
                        variant="primary"
                        leftIcon={<Home className="w-5 h-5" />}
                        className="min-w-[200px] shadow-lg shadow-blue-200"
                    >
                        Về Trang Chủ
                    </Button>

                    <Button
                        onClick={() => window.history.back()}
                        size="lg"
                        variant="outline"
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="min-w-[200px]"
                    >
                        Quay Lại
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}
