'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Cpu, HardDrive, Zap,
    CheckCircle2, AlertCircle, ArrowRight,
    Settings, ShieldCheck, Wrench, Smartphone, X
} from 'lucide-react';
import Button from '@/components/ui/Button';

/* ================= TYPES ================= */

interface LaptopSpecs {
    modelName: string;
    ram: {
        type: string;
        bus: string;
        slots: number;
        maxCapacity: string;
    };
    ssd: {
        type: string;
        slots: number;
        maxCapacity: string;
    };
    message?: string;
}

interface Component {
    _id: string;
    name: string;
    type: string;
    price: number;
    specs: any;
}

export default function UpgradePage() {
    const [modelInput, setModelInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [specs, setSpecs] = useState<LaptopSpecs | null>(null);
    const [error, setError] = useState('');
    const [dbComponents, setDbComponents] = useState<Component[]>([]);

    useEffect(() => {
        // Fetch pricing data from DB
        fetch('/api/components')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDbComponents(data.data);
            })
            .catch(err => console.error('Failed to fetch pricing:', err));
    }, []);

    // Selection State
    const [selectedRamCapacity, setSelectedRamCapacity] = useState('');
    const [selectedRamType, setSelectedRamType] = useState('');
    const [selectedRamBus, setSelectedRamBus] = useState('');

    const [selectedSSDCapacity, setSelectedSSDCapacity] = useState('');
    const [selectedSSDType, setSelectedSSDType] = useState('');

    const [showManualInput, setShowManualInput] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelInput.trim()) return;

        setLoading(true);
        setError('');
        setSpecs(null);

        // Reset selections
        setSelectedRamCapacity('');
        setSelectedRamType('');
        setSelectedRamBus('');
        setSelectedSSDCapacity('');
        setSelectedSSDType('');

        setShowManualInput(false);

        try {
            const res = await fetch('/api/laptop-specs-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: modelInput })
            });
            const data = await res.json();

            if (data.success) {
                setSpecs(data.data);
                // Auto-fill types from specs if possible, or leave blank for user to choose?
                // Better to let user choose or default to what AI says:
                const aiRamType = data.data.ram.type.includes('DDR5') ? 'DDR5' : data.data.ram.type.includes('DDR3') ? 'DDR3' : 'DDR4';
                setSelectedRamType(aiRamType);

                const aiSSDType = data.data.ssd.type.includes('SATA') ? 'SATA' : 'NVMe';
                setSelectedSSDType(aiSSDType); // Note: AI might return generic 'SATA', simplified logic here.

            } else {
                setError(data.message || 'Không tìm thấy thông tin máy này.');
                setShowManualInput(true);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi kết nối máy chủ.');
            setShowManualInput(true);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Prices
    const getRamPrice = () => {
        if (!selectedRamCapacity) return 0;

        // Default type if not selected (fallback logic from original code)
        const type = selectedRamType || 'DDR4';

        // 1. Try exact match (Capacity + Type + Bus)
        let found = dbComponents.find(c =>
            c.type === 'RAM' &&
            c.specs.capacity === selectedRamCapacity &&
            c.specs.ramType === type &&
            (selectedRamBus ? c.specs.bus === selectedRamBus : true)
        );

        // 2. Fallback: Relax bus constraint if no exact match
        if (!found && selectedRamBus) {
            found = dbComponents.find(c =>
                c.type === 'RAM' &&
                c.specs.capacity === selectedRamCapacity &&
                c.specs.ramType === type
            );
        }

        // 3. Fallback: If no type selected, try DDR4? (Already handled by const type = ...)

        return found ? found.price : 0;
    };

    const getSSDPrice = () => {
        if (!selectedSSDCapacity) return 0;

        // 1. Clean up type string
        // Frontend uses '2.5" SATA', DB uses '2.5 SATA'. Remove quotes.
        let type = selectedSSDType ? selectedSSDType.replace(/"/g, '') : 'NVMe';

        const found = dbComponents.find(c =>
            c.type === 'SSD' &&
            c.specs.capacity === selectedSSDCapacity &&
            c.specs.ssdType === type
        );

        return found ? found.price : 0;
    };

    const totalPrice = getRamPrice() + getSSDPrice();

    const handleBooking = () => {
        // Allow booking even if specs are manual/dummy
        const modelName = specs?.modelName || modelInput || "Khách chưa nhập tên máy";

        const message = `
🛎 **ĐẶT LỊCH NÂNG CẤP**
-----------------------
💻 Máy: ${modelName}
🛠 RAM: ${selectedRamCapacity || 'Không'} - ${selectedRamType} - ${selectedRamBus}
💾 SSD: ${selectedSSDCapacity || 'Không'} - ${selectedSSDType}
💰 Tổng tiền: ${totalPrice.toLocaleString()}đ
-----------------------
Mong shop tư vấn thêm ạ!
        `.trim();

        // Encode properly for URL
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://zalo.me/0978648720?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
            <Header />

            {/* HERO SECTION */}
            <div className="relative bg-gradient-to-br from-[#0B1120] via-[#1e293b] to-[#0f172a] text-white pt-10 pb-20 md:pt-20 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-sm text-blue-200"
                    >
                        <Zap size={16} className="text-yellow-400" fill="currentColor" />
                        <span>Công nghệ AI tra cứu thông số chính xác</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight"
                    >
                        Nâng Cấp Laptop <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Mượt Mà Tức Thì
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto px-4"
                    >
                        Chỉ cần nhập tên máy, AI sẽ cho bạn biết máy nâng cấp được gì. <br className="hidden md:block" />
                        Báo giá minh bạch, linh kiện chính hãng.
                    </motion.p>

                    {/* SEARCH BOX */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-xl mx-auto px-4"
                    >
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2">
                                <Search className="w-6 h-6 text-gray-400 ml-3 shrink-0" />
                                <input
                                    type="text"
                                    value={modelInput}
                                    onChange={(e) => setModelInput(e.target.value)}
                                    placeholder="Nhập tên máy (VD: Dell XPS 9560...)"
                                    className="w-full bg-transparent px-3 md:px-4 py-3 text-gray-800 placeholder-gray-500 text-base md:text-lg outline-none min-w-0"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    size="md"
                                    isLoading={loading}
                                    rightIcon={<Zap size={18} fill="currentColor" />}
                                    className="shrink-0 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] border-none"
                                >
                                    <span className="hidden md:inline">Kiểm Tra</span>
                                </Button>
                            </div>
                        </form>
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-2 justify-center text-sm">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}
                    </motion.div>

                    {showManualInput && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 flex justify-center"
                        >
                            <Button
                                onClick={() => {
                                    setSpecs({
                                        modelName: modelInput || "Máy của bạn",
                                        ram: { type: "Tùy chọn", bus: "Tùy chọn", slots: 0, maxCapacity: "Liên hệ" },
                                        ssd: { type: "Tùy chọn", slots: 0, maxCapacity: "Liên hệ" },
                                        message: "Chế độ chọn thủ công. Vui lòng chọn linh kiện bên dưới để xem giá."
                                    });
                                    setShowManualInput(false);
                                    setError('');
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-yellow-300 hover:text-white hover:bg-white/10 decoration-yellow-300/50"
                            >
                                ⚠️ Không tìm thấy? Chuyển sang chọn thủ công &rarr;
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* CONTENT AREA */}
            <main className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <AnimatePresence>
                    {specs && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* LEFT: SPECS CARD */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                            <Settings size={28} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Thông số kỹ thuật</p>
                                            <h2 className="text-xl md:text-2xl font-black text-gray-800">{specs.modelName}</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* RAM SPECS */}
                                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Cpu className="text-blue-600" size={24} />
                                                <h3 className="font-bold text-lg text-blue-900">Khả năng nâng RAM</h3>
                                            </div>
                                            <ul className="space-y-3 text-sm md:text-base">
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Loại RAM:</span>
                                                    <span className="font-bold text-gray-900">{specs.ram.type}</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Bus:</span>
                                                    <span className="font-bold text-gray-900">{specs.ram.bus}</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Số khe:</span>
                                                    <span className="font-bold text-gray-900">{specs.ram.slots} khe</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Tối đa:</span>
                                                    <span className="font-bold text-blue-600">{specs.ram.maxCapacity}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* SSD SPECS */}
                                        <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-4">
                                                <HardDrive className="text-purple-600" size={24} />
                                                <h3 className="font-bold text-lg text-purple-900">Khả năng nâng SSD</h3>
                                            </div>
                                            <ul className="space-y-3 text-sm md:text-base">
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Chuẩn:</span>
                                                    <span className="font-bold text-gray-900">{specs.ssd.type}</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Số khe:</span>
                                                    <span className="font-bold text-gray-900">{specs.ssd.slots} khe</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Tối đa:</span>
                                                    <span className="font-bold text-purple-600">{specs.ssd.maxCapacity}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {specs.message && (
                                        <div className="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            <p>{specs.message}</p>
                                        </div>
                                    )}
                                </div>

                                {/* UPGRADE OPTIONS */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Wrench className="text-green-500" /> Tùy chọn nâng cấp
                                    </h3>

                                    <div className="space-y-8">
                                        {/* RAM SELECTION */}
                                        <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Cpu className="text-blue-600" size={20} />
                                                <h4 className="font-bold text-gray-800">Nâng cấp RAM</h4>
                                            </div>

                                            {/* Capacity */}
                                            <div className="mb-4">
                                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Dung lượng</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['4GB', '8GB', '16GB', '32GB'].map(cap => (
                                                        <Button
                                                            key={cap}
                                                            onClick={() => setSelectedRamCapacity(cap === selectedRamCapacity ? '' : cap)}
                                                            variant={selectedRamCapacity === cap ? 'primary' : 'outline'}
                                                            size="sm"
                                                            className={selectedRamCapacity === cap ? '' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'}
                                                        >
                                                            {cap}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Type & Bus */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Loại RAM</label>
                                                    <select
                                                        value={selectedRamType}
                                                        onChange={(e) => setSelectedRamType(e.target.value)}
                                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm font-medium focus:border-blue-500 outline-none bg-white"
                                                    >
                                                        <option value="">-- Chọn --</option>
                                                        <option value="DDR3">DDR3</option>
                                                        <option value="DDR3L">DDR3L</option>
                                                        <option value="DDR4">DDR4</option>
                                                        <option value="DDR5">DDR5</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Bus RAM</label>
                                                    <select
                                                        value={selectedRamBus}
                                                        onChange={(e) => setSelectedRamBus(e.target.value)}
                                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm font-medium focus:border-blue-500 outline-none bg-white"
                                                    >
                                                        <option value="">-- Chọn --</option>
                                                        <option value="1600MHz">1600MHz</option>
                                                        <option value="2133MHz">2133MHz</option>
                                                        <option value="2400MHz">2400MHz</option>
                                                        <option value="2666MHz">2666MHz</option>
                                                        <option value="3200MHz">3200MHz</option>
                                                        <option value="4800MHz">4800MHz</option>
                                                        <option value="5600MHz">5600MHz</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SSD SELECTION */}
                                        <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <HardDrive className="text-purple-600" size={20} />
                                                <h4 className="font-bold text-gray-800">Nâng cấp SSD</h4>
                                            </div>

                                            {/* Capacity */}
                                            <div className="mb-4">
                                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Dung lượng</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['128GB', '256GB', '512GB', '1TB'].map(cap => (
                                                        <Button
                                                            key={cap}
                                                            onClick={() => setSelectedSSDCapacity(cap === selectedSSDCapacity ? '' : cap)}
                                                            variant={selectedSSDCapacity === cap ? 'secondary' : 'outline'}
                                                            size="sm"
                                                            className={selectedSSDCapacity === cap ? 'bg-purple-600 shadow-purple-500/30' : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'}
                                                        >
                                                            {cap}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* SSD Type */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Chuẩn kết nối</label>
                                                <div className="flex gap-2">
                                                    {['2.5" SATA', 'M.2 SATA', 'NVMe'].map(type => (
                                                        <Button
                                                            key={type}
                                                            onClick={() => setSelectedSSDType(type === selectedSSDType ? '' : type)}
                                                            variant={selectedSSDType === type ? 'secondary' : 'outline'}
                                                            size="xs"
                                                            className={`flex-1 ${selectedSSDType === type ? 'bg-purple-100 text-purple-700 shadow-none border-purple-500' : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'}`}
                                                        >
                                                            {type}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: SUMMARY CARD */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Chi phí dự kiến</h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                            <span className="text-gray-600 text-sm">Công lắp đặt</span>
                                            <span className="font-bold text-green-600 text-sm">Miễn phí</span>
                                        </div>

                                        <AnimatePresence>
                                            {selectedRamCapacity && (
                                                <motion.div
                                                    key="ram-row"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 overflow-hidden"
                                                >
                                                    <span className="text-gray-600 text-sm">RAM {selectedRamCapacity}</span>
                                                    <span className="font-bold text-sm">{getRamPrice().toLocaleString()}đ</span>
                                                </motion.div>
                                            )}

                                            {selectedSSDCapacity && (
                                                <motion.div
                                                    key="ssd-row"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 overflow-hidden"
                                                >
                                                    <span className="text-gray-600 text-sm">SSD {selectedSSDCapacity}</span>
                                                    <span className="font-bold text-sm">{getSSDPrice().toLocaleString()}đ</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-black text-gray-800 text-lg">Tổng cộng</span>
                                            <span className="font-black text-2xl text-blue-600">
                                                {totalPrice.toLocaleString()}đ
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleBooking}
                                        disabled={totalPrice === 0}
                                        variant="facebook"
                                        size="lg"
                                        fullWidth
                                        leftIcon={<Smartphone size={20} />}
                                        className={totalPrice > 0 ? 'bg-[#1877F2]' : ''}
                                    >
                                        Đặt Lịch Qua Zalo
                                    </Button>

                                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 justify-center">
                                        <ShieldCheck className="text-green-500" size={14} />
                                        Bảo hành 36 tháng 1 đổi 1
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!specs && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block p-6 rounded-full bg-gray-100 mb-6">
                            <Search className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-400">Bạn chưa tìm kiếm</h3>
                        <p className="text-gray-400 mt-2 mb-8 max-w-md mx-auto">
                            Hãy nhập mã máy vào ô tìm kiếm ở trên, hoặc tự chọn linh kiện bên dưới để xem báo giá.
                        </p>

                        <Button
                            onClick={() => {
                                setSpecs({
                                    modelName: "Máy của bạn (Tự chọn)",
                                    ram: { type: "Tùy chọn", bus: "Tùy chọn", slots: 0, maxCapacity: "Liên hệ" },
                                    ssd: { type: "Tùy chọn", slots: 0, maxCapacity: "Liên hệ" },
                                    message: "Chế độ chọn thủ công. Vui lòng chọn linh kiện để xem giá."
                                });
                            }}
                            variant="outline"
                            size="lg"
                            leftIcon={<Settings size={20} />}
                            className="border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 bg-white"
                        >
                            Tự chọn cấu hình thủ công
                        </Button>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
