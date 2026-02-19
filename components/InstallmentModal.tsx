import { useState, useEffect } from "react";
import { X, Calculator, CreditCard, BadgePercent, Check, ChevronDown, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InstallmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    productPrice: number;
    productName: string;
}

export default function InstallmentModal({ isOpen, onClose, productPrice, productName }: InstallmentModalProps) {
    const [prepayPercent, setPrepayPercent] = useState(30);
    const [loanAmount, setLoanAmount] = useState(0);
    const [prepayAmount, setPrepayAmount] = useState(0);

    // Constants (Mock data - can be replaced with real API or props later)
    // Assume flat monthly interest rate of 1.8% for "Finance Company"
    const INTEREST_RATE = 0.018;

    // Calculate values whenever price or prepay percent changes
    useEffect(() => {
        const prepay = (productPrice * prepayPercent) / 100;
        const loan = productPrice - prepay;
        setPrepayAmount(prepay);
        setLoanAmount(loan);
    }, [productPrice, prepayPercent]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Calculation function
    const calculateMonthly = (months: number) => {
        // Formula: (Loan + (Loan * Interest * Months)) / Months
        // Or simpler flat interest: Monthly = (Loan / Months) + (Loan * InterestRate)
        const interestTotal = loanAmount * INTEREST_RATE * months;
        const totalPayable = loanAmount + interestTotal;
        const monthly = totalPayable / months;
        return {
            monthly: Math.round(monthly),
            total: Math.round(totalPayable),
            diff: Math.round(totalPayable - loanAmount) // Difference vs cash price (interest cost)
        };
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between shadow-lg z-10">
                            <h2 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                                <Calculator className="w-5 h-5 text-blue-200" />
                                Tính Toán Trả Góp
                            </h2>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Valid price check */}
                        {productPrice < 4000000 || productPrice > 50000000 ? (
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                    <BadgePercent size={40} />
                                </div>
                                <h3 className="text-xl font-black text-gray-800 mb-3">Không hỗ trợ trả góp online</h3>
                                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                                    Sản phẩm này hiện chưa hỗ trợ tính năng trả góp trực tuyến. <br />
                                    <span className="text-xs font-bold uppercase text-orange-600">(Áp dụng sản phẩm từ 4 tr - 50 tr)</span>
                                </p>
                                <button onClick={onClose} className="mt-8 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black rounded-xl transition-all active:scale-95">
                                    Đóng cửa sổ
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                                {/* Product Info Summary */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1.5 px-2 py-0.5 bg-white w-fit rounded-full shadow-sm">Sản phẩm đang xem</div>
                                        <h3 className="text-lg font-black text-gray-800 line-clamp-2 leading-tight mb-2">{productName}</h3>
                                        <div className="text-2xl font-black text-rose-600">{formatCurrency(productPrice)}</div>
                                    </div>

                                    <div className="w-full md:w-auto bg-white p-4 rounded-xl border border-blue-200 shadow-xl shadow-blue-900/5 min-w-[240px]">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Mức trả trước</label>
                                        <div className="relative group">
                                            <select
                                                value={prepayPercent}
                                                onChange={(e) => setPrepayPercent(Number(e.target.value))}
                                                className="w-full appearance-none bg-slate-50 font-black text-gray-800 outline-none pr-10 cursor-pointer py-2 px-3 border border-slate-200 rounded-lg focus:border-blue-500 transition-all"
                                            >
                                                {[0, 10, 20, 30, 40, 50, 60, 70].map(p => (
                                                    <option key={p} value={p}>{p}% - Trả trước {formatCurrency((productPrice * p) / 100)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cần trả trước</div>
                                        <div className="font-black text-gray-800 text-lg">{formatCurrency(prepayAmount)}</div>
                                    </div>
                                    <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-500/20 text-center">
                                        <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Số tiền vay lại</div>
                                        <div className="font-black text-white text-lg">{formatCurrency(loanAmount)}</div>
                                    </div>
                                </div>

                                {/* Installment Table */}
                                <div>
                                    <h3 className="font-black text-gray-800 mb-5 flex items-center gap-2 uppercase text-sm tracking-wider">
                                        <CreditCard size={18} className="text-blue-600" />
                                        Gói vay tài chính dự kiến
                                    </h3>

                                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-100">
                                                <tr>
                                                    <th className="p-4 text-left uppercase text-[10px] tracking-widest">Kỳ hạn</th>
                                                    <th className="p-4 text-right uppercase text-[10px] tracking-widest">Góp mỗi tháng</th>
                                                    <th className="p-4 text-right hidden sm:table-cell uppercase text-[10px] tracking-widest">Tổng tiền</th>
                                                    <th className="p-4 text-right hidden sm:table-cell uppercase text-[10px] tracking-widest">Chênh lệch</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 bg-white">
                                                {[3, 6, 9, 12].map(months => {
                                                    const result = calculateMonthly(months);
                                                    return (
                                                        <tr key={months} className="hover:bg-blue-50/50 transition-colors group">
                                                            <td className="p-4 font-black text-gray-800">
                                                                <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-xl mr-3 text-xs font-black">
                                                                    {months}
                                                                </span>
                                                                Tháng
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <div className="font-black text-rose-600 text-lg">
                                                                    {formatCurrency(result.monthly)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right text-gray-600 font-bold hidden sm:table-cell">
                                                                {formatCurrency(result.total)}
                                                            </td>
                                                            <td className="p-4 text-right text-rose-400 font-medium text-xs hidden sm:table-cell group-hover:text-rose-600 transition-colors">
                                                                +{formatCurrency(result.diff)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-5 italic text-center leading-relaxed">
                                        * Số liệu chỉ mang tính chất tham khảo dựa trên lãi suất cơ bản 1.8%/tháng. <br />
                                        Lãi suất thực tế có thể thay đổi tùy thuộc vào thời điểm và hồ sơ của quý khách.
                                    </p>
                                </div>

                                {/* CTA */}
                                <div className="pt-4 pb-2">
                                    <a
                                        href="https://zalo.me/0978648720"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="relative group flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all overflow-hidden uppercase tracking-widest"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                        <MessageCircle size={22} className="relative z-10" />
                                        <span className="relative z-10">Liên hệ duyệt hồ sơ ngay</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
