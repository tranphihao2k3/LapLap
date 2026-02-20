import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Chính sách bảo mật - LapLap',
    description: 'Cam kết bảo mật thông tin khách hàng tại LapLap Cần Thơ.',
};

export default function PrivacyPage() {
    return (
        <>
            {/* Hero Section - Standardized Height & Style */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight uppercase tracking-tight">
                        Chính Sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Bảo Mật</span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Cam kết bảo vệ sự riêng tư và thông tin cá nhân của khách hàng một cách tuyệt đối.
                    </p>
                </div>
            </section>

            <main className="min-h-screen bg-gray-50 py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                        <section className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg font-medium text-gray-800">
                                <strong>LapLap Cần Thơ</strong> cam kết bảo mật những thông tin mang tính riêng tư của bạn.
                                Quý khách vui lòng đọc bản "Chính sách bảo mật" dưới đây để hiểu hơn những cam kết mà chúng tôi thực hiện,
                                nhằm tôn trọng và bảo vệ quyền lợi của người truy cập.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">1. Mục đích và phạm vi thu thập</h2>
                            <p>
                                Để truy cập và sử dụng một số dịch vụ tại LapLap, bạn có thể sẽ được yêu cầu đăng ký với chúng tôi thông tin cá nhân (Email, Họ tên, Số ĐT liên lạc...).
                                Mọi thông tin khai báo phải đảm bảo tính chính xác và hợp pháp. Chúng tôi không chịu mọi trách nhiệm liên quan đến pháp luật của thông tin khai báo.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">2. Phạm vi sử dụng thông tin</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Hỗ trợ khách hàng khi mua sản phẩm</li>
                                <li>Giải đáp thắc mắc khách hàng</li>
                                <li>Cung cấp cho bạn thông tin mới nhất trên Website của chúng tôi</li>
                                <li>Xem xét và nâng cấp nội dung và giao diện của Website</li>
                                <li>Thực hiện các bản khảo sát khách hàng</li>
                                <li>Thực hiện các hoạt động quảng bá liên quan đến các sản phẩm và dịch vụ của LapLap.</li>
                            </ul>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">3. Thời gian lưu trữ thông tin</h2>
                            <p>
                                Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ.
                                Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của LapLap.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">4. Cam kết bảo mật thông tin cá nhân khách hàng</h2>
                            <p>
                                Thông tin cá nhân của thành viên trên LapLap được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của LapLap.
                                Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.
                            </p>
                            <p>
                                Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng ý từ thành viên.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">5. Thông tin liên hệ</h2>
                            <p>
                                Chúng tôi luôn hoan nghênh các ý kiến đóng góp, liên hệ và phản hồi thông tin từ bạn về “Chính sách bảo mật” này.
                                Nếu bạn có những thắc mắc liên quan xin vui lòng liên hệ theo địa chỉ Email: <strong>laplapcantho@gmail.com</strong>
                            </p>
                        </section>

                        <div className="mt-12 pt-8 border-t text-sm text-gray-500 text-center">
                            Cập nhật lần cuối: 18/02/2026
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
