import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Điều khoản sử dụng - LapLap',
    description: 'Các điều khoản và điều kiện sử dụng dịch vụ tại LapLap Cần Thơ.',
};

export default function TermsPage() {
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
                        Điều Khoản <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Sử Dụng</span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Quy định và hướng dẫn dành cho khách hàng khi giao dịch tại LapLap.
                    </p>
                </div>
            </section>

            <main className="min-h-screen bg-gray-50 py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                        <section className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Chào mừng bạn đến với <strong>LapLap Cần Thơ</strong>. Khi bạn truy cập vào trang web của chúng tôi, bạn đồng ý với các điều khoản này.
                                Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều kiện sử dụng này, vào bất cứ lúc nào.
                                Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">1. Hướng dẫn sử dụng web</h2>
                            <p>
                                Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.
                                Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">2. Ý kiến khách hàng</h2>
                            <p>
                                Tất cả nội dung trang web và ý kiến phê bình của quý khách đều là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông tin giả mạo nào,
                                chúng tôi sẽ khóa tài khoản của quý khách ngay lập tức hoặc áp dụng các biện pháp khác theo quy định của pháp luật Việt Nam.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">3. Chấp nhận đơn hàng và giá cả</h2>
                            <p>
                                Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì bất kỳ lý do gì liên quan đến lỗi kỹ thuật, hệ thống một cách khách quan vào bất kỳ lúc nào.
                                Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính xác trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho quý khách.
                            </p>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">4. Thay đổi hoặc hủy bỏ giao dịch</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Thông báo cho chúng tôi về việc hủy giao dịch qua đường dây nóng.</li>
                                <li>Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng bất kỳ lợi ích nào từ hàng hóa đó.</li>
                            </ul>

                            <h2 className="text-xl font-bold text-blue-600 mt-8">5. Giải quyết hậu quả do lỗi nhập liệu sai thông tin</h2>
                            <p>
                                Khách hàng có trách nhiệm cung cấp thông tin đầy đủ và chính xác khi tham gia giao dịch tại LapLap. Trong trường hợp khách hàng nhập sai thông tin gửi vào trang thông tin điện tử bán hàng LapLap, chúng tôi có quyền từ chối thực hiện giao dịch.
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
