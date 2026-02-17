import { useState, useEffect } from "react";
import { X, Calculator, CreditCard, BadgePercent, Check, ChevronDown } from "lucide-react";
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
                        <div className="bg-[#004e9a] text-white p-4 flex items-center justify-between shadow-md z-10">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-blue-200" />
                                Tính Toán Trả Góp
                            </h2>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Valid price check */}
                        {productPrice < 4000000 || productPrice > 50000000 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BadgePercent size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Không hỗ trợ trả góp</h3>
                                <p className="text-gray-500">
                                    Sản phẩm này hiện chưa hỗ trợ tính năng trả góp online. <br />
                                    (Chỉ áp dụng cho sản phẩm từ 4 triệu - 50 triệu)
                                </p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors">
                                    Đóng
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                                {/* Product Info Summary */}
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Sản phẩm</div>
                                        <h3 className="text-lg font-black text-gray-800 line-clamp-1">{productName}</h3>
                                        <div className="text-2xl font-bold text-[#d70018] mt-1">{formatCurrency(productPrice)}</div>
                                    </div>

                                    <div className="w-full md:w-auto bg-white p-3 rounded-lg border border-blue-200 shadow-sm min-w-[200px]">
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Chọn trả trước</label>
                                        <div className="relative">
                                            <select
                                                value={prepayPercent}
                                                onChange={(e) => setPrepayPercent(Number(e.target.value))}
                                                className="w-full appearance-none bg-transparent font-bold text-gray-800 outline-none pr-8 cursor-pointer py-1 border-b border-transparent focus:border-blue-500 transition-colors"
                                            >
                                                {[0, 10, 20, 30, 40, 50, 60, 70].map(p => (
                                                    <option key={p} value={p}>{p}% - {formatCurrency((productPrice * p) / 100)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                                        <div className="text-xs text-gray-500 mb-1">Số tiền trả trước</div>
                                        <div className="font-bold text-gray-800">{formatCurrency(prepayAmount)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                                        <div className="text-xs text-gray-500 mb-1">Số tiền vay lại</div>
                                        <div className="font-bold text-blue-600">{formatCurrency(loanAmount)}</div>
                                    </div>
                                </div>

                                {/* Installment Table */}
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <CreditCard size={18} className="text-blue-600" />
                                        Gói vay tài chính (Tham khảo)
                                    </h3>

                                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-sm">
                                            <thead className="bg-[#f0f8ff] text-gray-700 font-bold border-b border-blue-100">
                                                <tr>
                                                    <th className="p-3 text-left">Kỳ hạn</th>
                                                    <th className="p-3 text-right">Góp mỗi tháng</th>
                                                    <th className="p-3 text-right hidden sm:table-cell">Tổng tiền góp</th>
                                                    <th className="p-3 text-right hidden sm:table-cell">Chênh lệch</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {[3, 6, 9, 12].map(months => {
                                                    const result = calculateMonthly(months);
                                                    return (
                                                        <tr key={months} className="hover:bg-blue-50/50 transition-colors group">
                                                            <td className="p-3 font-bold text-gray-800">
                                                                <span className="w-6 h-6 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mr-2 text-xs">
                                                                    {months}
                                                                </span>
                                                                tháng
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                <div className="font-bold text-[#d70018] text-base">
                                                                    {formatCurrency(result.monthly)}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-right text-gray-600 hidden sm:table-cell">
                                                                {formatCurrency(result.total)}
                                                            </td>
                                                            <td className="p-3 text-right text-gray-500 text-xs hidden sm:table-cell group-hover:text-gray-700">
                                                                +{formatCurrency(result.diff)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3 italic text-center">
                                        * Số liệu chỉ mang tính chất tham khảo. Lãi suất thực tế có thể thay đổi tùy thuộc vào thời điểm và hồ sơ của quý khách tại cửa hàng.
                                        Vui lòng liên hệ hotline để được tư vấn chi tiết.
                                    </p>
                                </div>

                                {/* CTA */}
                                <div className="pt-2">
                                    <a
                                        href="https://zalo.me/0978648720"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block w-full py-3 bg-[#004e9a] text-white text-center font-bold rounded-xl shadow-lg hover:bg-[#003b78] hover:shadow-blue-900/20 active:scale-[0.98] transition-all"
                                    >
                                        Liên hệ duyệt hồ sơ ngay
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
