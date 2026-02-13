import {
    Clock,
    ShieldCheck,
    Flame
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CleaningProcess from "./components/CleaningProcess";
import CleaningBenefits from "./components/CleaningBenefits";

export default function CleaningServicePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">

                {/* ================= BANNER ================= */}
                <section className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white py-14 px-4">
                    <div className="container mx-auto max-w-4xl text-center space-y-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-3">
                            <Flame className="text-yellow-400" />
                            Laptop nóng – lag – giật – treo máy?
                        </h1>

                        <p className="text-lg text-slate-200">
                            Đã bao lâu rồi bạn chưa vệ sinh laptop?
                        </p>

                        <div className="bg-yellow-400 text-[var(--color-secondary)] font-bold text-xl py-3 px-6 rounded-lg inline-block shadow-lg">
                            Vệ sinh – bảo dưỡng laptop chỉ từ <span className="text-2xl">150K</span>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto max-w-4xl px-4 py-16 space-y-20">

                    {/* ================= QUY TRÌNH ================= */}
                    <CleaningProcess />

                    {/* ================= ƯU ĐÃI ================= */}
                    <CleaningBenefits />

                    {/* ================= CAM KẾT ================= */}
                    <section className="bg-white rounded-xl p-8 shadow-md border-l-4 border-[var(--color-secondary)] text-center space-y-4">
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
