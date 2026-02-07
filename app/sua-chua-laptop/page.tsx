import {
    AlertTriangle,
    Settings,
    Zap,
    MonitorOff,
    WifiOff,
    HardDrive,
    ShieldCheck,
    Stethoscope,
    PenTool
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RepairServicePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white text-slate-800 pb-20">

                {/* --- 1. BANNER TIÊU ĐỀ --- */}
                <section className="bg-[#1e4275] text-white py-10 px-4 text-center">
                    <div className="container mx-auto space-y-3">
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
                            🛠️ Laptop gặp sự cố – Không lên nguồn – Lỗi màn hình?
                        </h1>
                        <p className="text-lg">Đừng để những hư hỏng nhỏ làm gián đoạn công việc của bạn!</p>
                        <p className="text-yellow-400 font-bold text-xl uppercase">
                            ⚡ LapLap Cần Thơ: Khắc phục mọi lỗi Laptop – Thay thế linh kiện lấy liền – Bảo hành uy tín.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto max-w-5xl px-4 py-12">

                    {/* --- 2. CÁC LỖI THƯỜNG GẶP (Grid) --- */}
                    <section className="mb-16">
                        <h2 className="text-xl font-bold flex items-center gap-2 border-l-4 border-[#1e4275] pl-3 mb-8">
                            <AlertTriangle className="text-red-500" /> Các lỗi Laptop thường gặp cần xử lý ngay
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CommonErrorCard
                                icon={<Zap size={32} />}
                                title="Lỗi Nguồn"
                                description="Máy không lên nguồn, máy tự động tắt, sạc không vào điện hoặc bị chập chờn."
                            />
                            <CommonErrorCard
                                icon={<MonitorOff size={32} />}
                                title="Lỗi Màn Hình"
                                description="Màn hình bị sọc, nhòe màu, có điểm chết hoặc không hiển thị (màn hình đen)."
                            />
                            <CommonErrorCard
                                icon={<Settings size={32} />}
                                title="Lỗi Bàn Phím/Chuột"
                                description="Bàn phím bị liệt nút, kẹt phím, nhảy chữ hoặc Touchpad không nhận."
                            />
                            <CommonErrorCard
                                icon={<HardDrive size={32} />}
                                title="Lỗi Phần Cứng"
                                description="Hư hỏng ổ cứng, RAM không nhận, quạt tản nhiệt kêu to hoặc bị gãy bản lề."
                            />
                            <CommonErrorCard
                                icon={<WifiOff size={32} />}
                                title="Lỗi Kết Nối"
                                description="Không bắt được Wifi, lỗi Bluetooth, hỏng cổng USB hoặc cổng HDMI."
                            />
                            <CommonErrorCard
                                icon={<Stethoscope size={32} />}
                                title="Lỗi Phần Mềm"
                                description="Máy bị nhiễm Virus, lỗi Windows, đứng máy khi mở ứng dụng nặng."
                            />
                        </div>
                    </section>

                    {/* --- 3. QUY TRÌNH SỬA CHỮA MINH BẠCH --- */}
                    <section className="bg-sky-50 rounded-2xl p-8 mb-16 border border-sky-200">
                        <h2 className="text-xl font-bold text-[#1e4275] text-center mb-8 uppercase">
                            Quy trình sửa chữa minh bạch tại LapLap
                        </h2>
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-[#1e4275] text-white rounded-full flex items-center justify-center mx-auto font-bold">1</div>
                                <h4 className="font-bold">Tiếp nhận</h4>
                                <p className="text-sm">Kiểm tra tình trạng máy và ghi nhận yêu cầu.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-[#1e4275] text-white rounded-full flex items-center justify-center mx-auto font-bold">2</div>
                                <h4 className="font-bold">Báo giá</h4>
                                <p className="text-sm">Xác định lỗi, đề xuất giải pháp và báo giá rõ ràng.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-[#1e4275] text-white rounded-full flex items-center justify-center mx-auto font-bold">3</div>
                                <h4 className="font-bold">Sửa chữa</h4>
                                <p className="text-sm">Tiến hành sửa chữa dưới sự giám sát nếu khách cần.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-[#1e4275] text-white rounded-full flex items-center justify-center mx-auto font-bold">4</div>
                                <h4 className="font-bold">Bàn giao</h4>
                                <p className="text-sm">Khách kiểm tra lại máy, dán tem bảo hành và thanh toán.</p>
                            </div>
                        </div>
                    </section>

                    {/* --- 4. CAM KẾT VÀ BÁO GIÁ --- */}
                    <section className="flex flex-col md:flex-row gap-8 items-center bg-[#1e4275] p-8 rounded-xl text-white shadow-xl">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold">Cam kết dịch vụ từ LapLap</h2>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2"><ShieldCheck className="text-green-400" /> Sửa đúng bệnh, báo đúng giá.</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="text-green-400" /> Linh kiện thay thế chuẩn, bảo hành dài hạn.</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="text-green-400" /> Bảo mật dữ liệu khách hàng tuyệt đối.</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="text-green-400" /> Sửa chữa lấy liền với các lỗi đơn giản.</li>
                            </ul>
                        </div>
                        <div className="w-full md:w-auto text-center space-y-4">
                            <div className="p-6 bg-white rounded-lg text-[#1e4275]">
                                <p className="text-sm font-bold uppercase">Kiểm tra lỗi máy</p>
                                <h3 className="text-3xl font-black">MIỄN PHÍ</h3>
                                <p className="text-xs mt-1 italic">* Không sửa không thu phí</p>
                            </div>
                            <button className="w-full py-4 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors uppercase tracking-wider">
                                Nhận tư vấn ngay
                            </button>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}

// --- COMPONENT CON: CARD HIỂN THỊ LỖI ---
function CommonErrorCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 border-2 border-slate-100 rounded-2xl hover:border-[#1e4275] transition-all group hover:shadow-lg">
            <div className="text-[#1e4275] mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#1e4275] uppercase">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}
