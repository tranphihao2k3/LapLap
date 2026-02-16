
import { Software } from '@/models/Software';

export const softwareList = [
    {
        title: "Unikey - Bộ Gõ Tiếng Việt",
        slug: "unikey-bo-go-tieng-viet",
        excerpt: "Unikey là phần mềm gõ tiếng Việt phổ biến nhất hiện nay, hỗ trợ nhiều bảng mã và kiểu gõ, nhẹ và không cần cài đặt.",
        content: `
            <h2>Giới thiệu Unikey</h2>
            <p>Unikey là chương trình bàn phím tiếng Việt miễn phí, gọn nhẹ, đơn giản và dễ sử dụng...</p>
            <h3>Tính năng nổi bật</h3>
            <ul>
                <li>Hỗ trợ nhiều bảng mã: Unicode, TCVN3 (ABC), VNI Windows...</li>
                <li>Hỗ trợ nhiều kiểu gõ: Telex, VNI, VIQR...</li>
                <li>Chạy ngay không cần cài đặt (phiên bản Portable).</li>
                <li>Hỗ trợ phím tắt chuyển đổi nhanh.</li>
            </ul>
        `,
        category: "Tiện ích",
        type: "Free",
        platform: "Windows",
        version: "4.3 RC5",
        fileSize: "500KB",
        developer: "Pham Kim Long",
        status: "published",
        tags: ["unikey", "tiếng việt", "bộ gõ"]
    },
    {
        title: "Google Chrome - Trình Duyệt Web",
        slug: "google-chrome-trinh-duyet-web",
        excerpt: "Google Chrome là trình duyệt web nhanh, an toàn và dễ sử dụng, được phát triển bởi Google.",
        content: `
            <h2>Về Google Chrome</h2>
            <p>Google Chrome là trình duyệt web phổ biến nhất thế giới hiện nay...</p>
            <h3>Tại sao nên dùng Chrome?</h3>
            <ul>
                <li>Tốc độ tải trang nhanh.</li>
                <li>Kho tiện ích mở rộng (Extension) khổng lồ.</li>
                <li>Tích hợp sâu với các dịch vụ Google.</li>
                <li>Bảo mật cao, cảnh báo trang web độc hại.</li>
            </ul>
        `,
        category: "Tiện ích",
        type: "Free",
        platform: "Windows",
        version: "Latest",
        fileSize: "2MB (Installer)",
        developer: "Google",
        status: "published",
        tags: ["chrome", "trình duyệt", "internet"]
    },
    {
        title: "WinRAR - Nén và Giải Nén File",
        slug: "winrar-nen-va-giai-nen",
        excerpt: "WinRAR là phần mềm nén và giải nén file mạnh mẽ, hỗ trợ nhiều định dạng như RAR, ZIP, 7Z, ISO...",
        content: `
            <h2>Giới thiệu WinRAR</h2>
            <p>WinRAR là công cụ không thể thiếu trên mọi máy tính Windows để xử lý các file nén...</p>
            <h3>Tính năng chính</h3>
            <ul>
                <li>Tỷ lệ nén cao với định dạng RAR.</li>
                <li>Hỗ trợ giải nén hầu hết các định dạng phổ biến.</li>
                <li>Bảo vệ file nén bằng mật khẩu và mã hóa AES-256.</li>
                <li>Tự động sửa lỗi file nén bị hỏng.</li>
            </ul>
        `,
        category: "Tiện ích",
        type: "Trial",
        platform: "Windows",
        version: "6.24",
        fileSize: "3MB",
        developer: "Rarlab",
        status: "published",
        tags: ["winrar", "giải nén", "zip"]
    },
    {
        title: "Microsoft Office 2021",
        slug: "microsoft-office-2021",
        excerpt: "Bộ ứng dụng văn phòng Microsoft Office 2021 mới nhất với Word, Excel, PowerPoint cải tiến hiệu suất và giao diện.",
        content: `
            <h2>Tổng quan Office 2021</h2>
            <p>Microsoft Office 2021 là phiên bản mua một lần (vĩnh viễn) dành cho người dùng không muốn đăng ký gói Microsoft 365...</p>
            <h3>Bộ ứng dụng bao gồm:</h3>
            <ul>
                <li>Microsoft Word 2021</li>
                <li>Microsoft Excel 2021</li>
                <li>Microsoft PowerPoint 2021</li>
                <li>Outlook, Access, Publisher...</li>
            </ul>
        `,
        category: "Văn phòng",
        type: "Repack",
        platform: "Windows",
        version: "2021 Pro Plus",
        fileSize: "4GB",
        developer: "Microsoft",
        status: "published",
        tags: ["office", "word", "excel"]
    },
    {
        title: "Adobe Photoshop 2024",
        slug: "adobe-photoshop-2024",
        excerpt: "Phần mềm chỉnh sửa ảnh chuyên nghiệp nhất thế giới với các tính năng AI mới tíc hợp.",
        content: `
            <h2>Adobe Photoshop 2024 có gì mới?</h2>
            <p>Phiên bản 2024 mang đến sức mạnh của Generative Fill và Generative Expand...</p>
            <h3>Tính năng nổi bật</h3>
            <ul>
                <li>Generative Fill: Thêm, xóa, mở rộng hình ảnh bằng văn bản.</li>
                <li>Remove Tool: Xóa vật thể thông minh.</li>
                <li>Cải thiện hiệu suất và giao diện người dùng.</li>
            </ul>
        `,
        category: "Đồ họa",
        type: "Repack",
        platform: "Windows",
        version: "2024 v25.0",
        fileSize: "3GB",
        developer: "Adobe",
        status: "published",
        tags: ["photoshop", "adobe", "edit ảnh"]
    },
    {
        title: "Internet Download Manager (IDM)",
        slug: "internet-download-manager-idm",
        excerpt: "Công cụ hỗ trợ tăng tốc độ tải xuống lên đến 5 lần, khôi phục và tiếp tục quy trình tải xuống bị lỗi.",
        content: `
            <h2>Tại sao cần IDM?</h2>
            <p>IDM là phần mềm hỗ trợ download tốt nhất hiện nay, giúp bắt link tải nhạc, video, tài liệu tự động...</p>
            <h3>Ưu điểm</h3>
            <ul>
                <li>Tăng tốc độ tải file nhờ chia nhỏ dữ liệu.</li>
                <li>Tự động bắt link từ trình duyệt (Youtube, Facebook...).</li>
                <li>Lên lịch tải xuống, tắt máy sau khi tải xong.</li>
            </ul>
        `,
        category: "Tiện ích",
        type: "Repack",
        platform: "Windows",
        version: "6.42",
        fileSize: "10MB",
        developer: "Tonec Inc",
        status: "published",
        tags: ["idm", "download", "tăng tốc"]
    },
    {
        title: "AutoCAD 2024",
        slug: "autocad-2024",
        excerpt: "Phần mềm thiết kế hỗ trợ CAD cho kiến trúc sư, kỹ sư và chuyên gia xây dựng tạo ra các bản vẽ 2D và 3D chính xác.",
        content: `
            <h2>Giới thiệu AutoCAD</h2>
            <p>AutoCAD là phần mềm tiêu chuẩn nghành cho thiết kế kỹ thuật, bản vẽ kiến trúc...</p>
            <h3>Điểm mới trong AutoCAD 2024</h3>
            <ul>
                <li>Hiệu suất đồ họa 2D nhanh hơn gấp 2 lần.</li>
                <li>Smart Blocks: Tự động đặt block thông minh.</li>
                <li>Activity Insights: Theo dõi lịch sử bản vẽ.</li>
            </ul>
        `,
        category: "Đồ họa",
        type: "Repack",
        platform: "Windows",
        version: "2024",
        fileSize: "2.5GB",
        developer: "Autodesk",
        status: "published",
        tags: ["autocad", "cad", "thiết kế"]
    },
    {
        title: "TeamViewer - Điều Khiển Từ Xa",
        slug: "teamviewer-remote",
        excerpt: "Giải pháp truy cập, điều khiển và hỗ trợ máy tính từ xa hàng đầu, an toàn và dễ sử dụng.",
        content: `
            <h2>Về TeamViewer</h2>
            <p>TeamViewer cho phép bạn kết nối đến bất kỳ máy tính hay máy chủ nào trên thế giới chỉ trong vài giây...</p>
            <h3>Ứng dụng</h3>
            <ul>
                <li>Hỗ trợ kỹ thuật từ xa.</li>
                <li>Truy cập máy tính làm việc tại nhà.</li>
                <li>Họp trực tuyến và chia sẻ màn hình.</li>
            </ul>
        `,
        category: "Hệ thống",
        type: "Free",
        platform: "Windows/Mac",
        version: "Latest",
        fileSize: "50MB",
        developer: "TeamViewer AG",
        status: "published",
        tags: ["teamviewer", "remote", "điều khiển"]
    }
];

export async function seedSoftware() {
    console.log("Seeding software...");
    const results = [];
    for (const sw of softwareList) {
        const result = await Software.findOneAndUpdate(
            { slug: sw.slug },
            sw,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        results.push(result);
    }
    console.log(`Seeded ${results.length} software items.`);
    return results;
}
