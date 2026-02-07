import {
    Wrench,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Gift,
    Flame
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CleaningServicePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">

                {/* ================= BANNER ================= */}
                <section className="bg-gradient-to-r from-[#1e4275] to-[#16345f] text-white py-14 px-4">
                    <div className="container mx-auto max-w-4xl text-center space-y-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-3">
                            <Flame className="text-yellow-400" />
                            Laptop nóng – lag – giật – treo máy?
                        </h1>

                        <p className="text-lg text-slate-200">
                            Đã bao lâu rồi bạn chưa vệ sinh laptop?
                        </p>

                        <div className="bg-yellow-400 text-[#1e4275] font-bold text-xl py-3 px-6 rounded-lg inline-block shadow-lg">
                            Vệ sinh – bảo dưỡng laptop chỉ từ <span className="text-2xl">150K</span>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto max-w-4xl px-4 py-16 space-y-20">

                    {/* ================= QUY TRÌNH ================= */}
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-3 mb-10">
                            <Wrench className="text-[#1e4275]" />
                            Quy trình vệ sinh laptop chuyên sâu
                        </h2>

                        <div className="grid gap-6">
                            <ProcessItem
                                index={1}
                                title="Vệ sinh ngoại quan A – B – C – D"
                                description="Làm sạch toàn bộ vỏ ngoài, bản lề, khe tản nhiệt."
                            />
                            <ProcessItem
                                index={2}
                                title="Vệ sinh bên trong máy"
                                description="Thổi bụi main, quạt, RAM, SSD – loại bỏ bụi gây nóng."
                            />
                            <ProcessItem
                                index={3}
                                title="Thay keo tản nhiệt CPU – GPU"
                                description="Giảm 10–25°C, máy mát – bền – chạy ổn định hơn."
                                highlight
                            />
                            <ProcessItem
                                index={4}
                                title="Làm sạch hệ thống tản nhiệt"
                                description="Quạt – ống đồng – khe gió được vệ sinh kỹ."
                            />
                            <ProcessItem
                                index={5}
                                title="Vệ sinh bàn phím – khe phím"
                                description="Loại bỏ bụi, tóc, mồ hôi – phím nhạy hơn."
                            />
                            <ProcessItem
                                index={6}
                                title="Test tổng thể & tư vấn miễn phí"
                                description="Kiểm tra nhiệt độ – hiệu năng sau vệ sinh."
                            />
                        </div>
                    </section>

                    {/* ================= ƯU ĐÃI ================= */}
                    <section className="bg-[#1e4275] rounded-2xl p-8 text-white shadow-xl">
                        <h2 className="text-xl font-bold flex items-center gap-3 justify-center mb-8">
                            <Gift className="text-yellow-400" />
                            Ưu đãi khi vệ sinh laptop tại LapLap Cần Thơ
                        </h2>

                        <ul className="grid md:grid-cols-2 gap-5">
                            <BenefitItem text="Miễn phí kiểm tra tình trạng laptop" />
                            <BenefitItem text="Tư vấn nâng cấp SSD – RAM phù hợp" />
                            <BenefitItem text="Bảo hành keo tản nhiệt theo gói" />
                            <BenefitItem
                                text="Giảm 10% cho học sinh – sinh viên"
                                highlight
                            />
                        </ul>
                    </section>

                    {/* ================= CAM KẾT ================= */}
                    <section className="bg-white rounded-xl p-8 shadow-md border-l-4 border-[#1e4275] text-center space-y-4">
                        <p className="text-lg font-bold text-[#1e4275]">
                            LapLap Cần Thơ – Vệ sinh laptop uy tín – sạch – nhanh – giá tốt
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div className="flex items-center gap-3 justify-center font-semibold">
                                <Clock className="text-[#1e4275]" />
                                Thời gian: 30 phút – 1 tiếng
                            </div>
                            <div className="flex items-center gap-3 justify-center font-semibold text-green-700">
                                <ShieldCheck className="text-green-600" />
                                Phòng kỹ thuật riêng – an toàn
                            </div>
                        </div>
                    </section>

                    {/* ================= GIÁ ================= */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <PriceCard
                            title="Laptop văn phòng"
                            price="150.000đ"
                            note="Máy mỏng nhẹ – học tập – làm việc"
                        />
                        <PriceCard
                            title="Laptop Gaming"
                            price="200.000đ – 250.000đ"
                            note="Máy tản nhiệt lớn – CPU & GPU"
                            highlight
                        />
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}

/* ================= SUB COMPONENTS ================= */

function ProcessItem({
    index,
    title,
    description,
    highlight = false
}: {
    index: number;
    title: string;
    description: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex gap-4 p-5 rounded-xl border transition-all
            ${highlight
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-white hover:shadow-md"
                }`}
        >
            <div className="text-[#1e4275] font-black text-xl">
                {index}
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{title}</h4>
                <p className="text-slate-600">{description}</p>
            </div>
        </div>
    );
}

function BenefitItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <li className={`flex items-center gap-3 ${highlight ? "font-bold text-yellow-300" : ""}`}>
            <CheckCircle2 className="text-green-400 flex-shrink-0" />
            {text}
        </li>
    );
}

function PriceCard({
    title,
    price,
    note,
    highlight = false
}: {
    title: string;
    price: string;
    note: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl p-6 text-center font-bold shadow-lg transition-transform hover:scale-105
            ${highlight
                    ? "bg-[#1e4275] text-white border-2 border-[#124A84]"
                    : "bg-white text-[#1e4275]"
                }`}
        >
            <h3 className="text-lg mb-2">{title}</h3>
            <div className="text-2xl mb-1">{price}</div>
            <p className={`text-sm ${highlight ? "text-slate-200" : "text-slate-600"}`}>
                {note}
            </p>
        </div>
    );
}
