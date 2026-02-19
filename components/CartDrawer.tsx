'use client';

import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";

export default function CartDrawer() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        totalAmount,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-800">Giỏ hàng ({cart.length})</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
                                        <p className="text-gray-400 text-sm">Hãy chọn thêm sản phẩm nhé!</p>
                                    </div>
                                    <Button
                                        onClick={() => setIsCartOpen(false)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 flex-shrink-0 relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <p className="font-bold text-blue-600">
                                                    {formatPrice(item.price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100"
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-5 border-t bg-gray-50 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-800">
                                        <span>Tổng cộng:</span>
                                        <span className="text-blue-600">{formatPrice(totalAmount)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full"
                                >
                                    <Button
                                        fullWidth
                                        size="lg"
                                        variant="primary"
                                        className="shadow-blue-200 shadow-lg"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Tiến hành đặt hàng
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
