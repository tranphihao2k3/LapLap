import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';
import { ShieldCheck, CheckCircle, Clock, AlertTriangle, RefreshCw, Truck } from 'lucide-react';

export const metadata: Metadata = {
    title: "Chính Sách Bảo Hành | LapLap - Laptop Cần Thơ",
    description: "Chi tiết chính sách bảo hành, đổi trả và hỗ trợ kỹ thuật tại LapLap Cần Thơ. Bảo hành 12 tháng, lỗi 1 đổi 1 trong 30 ngày. Uy tín là danh dự.",
    alternates: {
        canonical: `${SITE_URL}/chinh-sach-bao-hanh`,
    },
};

export default function WarrantyPolicyPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Chính sách bảo hành', url: '/chinh-sach-bao-hanh' },
    ]);

    return (
        <>
            <JsonLd id="warranty-policy-breadcrumb" data={breadcrumbs} />
            <Header />
            <main className="min-h-screen bg-slate-50 py-12 md:py-20 font-sans">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-xl mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">CHÍNH SÁCH BẢO HÀNH</h1>
                        <p className="text-slate-500 text-lg font-medium">"Uy tín của chúng tôi đặt trên từng sản phẩm bạn sử dụng"</p>
                    </div>

                    <div className="space-y-12 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
                        {/* 1. Cam kết */}
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <CheckCircle className="text-green-500" />
                                1. Cam Kết Vàng tại LapLap
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-2">Lỗi là đổi</h3>
                                    <p className="text-slate-600 text-sm">Trong 30 ngày đầu, nếu máy phát sinh lỗi phần cứng do NSX, LapLap đổi ngay máy tương đương hoặc hoàn tiền 100%.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-2">Bảo hành linh kiện</h3>
                                    <p className="text-slate-600 text-sm">Mainboard, RAM, SSD, Màn hình... được bảo hành chính hãng từ 6 - 12 tháng tùy dòng máy.</p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Quy định */}
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Clock className="text-blue-500" />
                                2. Thời Gian Xử Lý
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                - Với các lỗi nhẹ (thay bàn phím, sạc, pin...): Xử lý lấy ngay trong <strong>15 - 30 phút</strong>.<br />
                                - Với các lỗi chuyên sâu (Mainboard): Xử lý từ <strong>2 - 5 ngày làm việc</strong>. <br />
                                - Trân trọng: Trong thời gian chờ máy bảo hành, LapLap sẽ <strong>hỗ trợ mượn máy</strong> để quý khách không bị gián đoạn công việc.
                            </p>
                        </section>

                        {/* 3. Điều kiện */}
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <AlertTriangle className="text-amber-500" />
                                3. Điều Kiện Được Bảo Hành
                            </h2>
                            <ul className="list-disc pl-6 space-y-3 text-slate-600">
                                <li>Sản phẩm còn trong thời hạn bảo hành.</li>
                                <li>Tem bảo hành của LapLap còn nguyên vẹn, không có dấu hiệu bị rách, xóa hoặc sửa chữa.</li>
                                <li>Hư hỏng được xác định là do lỗi kỹ thuật của nhà sản xuất.</li>
                            </ul>
                        </section>

                        {/* 4. Từ chối */}
                        <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
                            <h2 className="text-xl font-bold text-red-800 mb-4 uppercase tracking-wider">Trường hợp không bảo hành</h2>
                            <ul className="space-y-3 text-sm text-red-700/80 font-medium">
                                <li className="flex items-center gap-2">• Rơi vỡ, móp méo, vào nước, cháy nổ do sử dụng sai nguồn điện.</li>
                                <li className="flex items-center gap-2">• Có dấu hiệu tự thảo máy hoặc sửa chữa tại nơi khác.</li>
                                <li className="flex items-center gap-2">• Lỗi do virus, malware hoặc can thiệp sâu vào BIOS/OS không đúng cách.</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6">
                            <Truck className="mx-auto text-blue-600 mb-3" />
                            <h4 className="font-bold text-slate-900">Ship toàn quốc</h4>
                            <p className="text-xs text-slate-500">Bảo hành qua đường bưu điện</p>
                        </div>
                        <div className="text-center p-6">
                            <RefreshCw className="mx-auto text-blue-600 mb-3" />
                            <h4 className="font-bold text-slate-900">Hỗ trợ 24/7</h4>
                            <p className="text-xs text-slate-500">Zalo: 0978.648.720</p>
                        </div>
                        <div className="text-center p-6">
                            <ShieldCheck className="mx-auto text-blue-600 mb-3" />
                            <h4 className="font-bold text-slate-900">Yên tâm tuyệt đối</h4>
                            <p className="text-xs text-slate-500">Uy tín tạo nên thương hiệu</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
