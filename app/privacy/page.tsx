import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Chính sách bảo mật - LapLap',
    description: 'Cam kết bảo mật thông tin khách hàng tại LapLap Cần Thơ.',
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 border-b pb-4">Chính Sách Bảo Mật</h1>

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
