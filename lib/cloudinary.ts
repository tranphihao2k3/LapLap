import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

  // ✅ Bảo mật - dùng HTTPS
  secure: true,
});

export default cloudinary;

/**
 * ====================================================
 * HƯỚNG DẪN GIỮ NGUYÊN CHẤT LƯỢNG ẢNH - CLOUDINARY
 * ====================================================
 *
 * ✅ KHI UPLOAD (app/api/upload/route.ts):
 *   - quality: 100          → Giữ nguyên 100% chất lượng
 *   - use_filename: true    → Giữ tên file gốc
 *   - overwrite: false      → Không ghi đè ảnh cũ
 *   - KHÔNG dùng: transformation, eager, width, height khi upload
 *
 * ✅ KHI HIỂN THỊ ẢNH (React component):
 *   - Dùng URL gốc từ secure_url (KHÔNG thêm tham số w_, h_, q_ vào URL)
 *   - Ví dụ URL đúng:
 *     https://res.cloudinary.com/your-cloud/image/upload/v123/folder/filename.jpg
 *   - Ví dụ URL SAI (có transformation - sẽ nén ảnh):
 *     https://res.cloudinary.com/your-cloud/image/upload/w_800,q_auto/v123/folder/filename.jpg
 *
 * ✅ NEXT.JS <Image> COMPONENT:
 *   - Thêm quality={100} vào mỗi component <Image>
 *   - Hoặc đã set quality: 100 trong next.config.ts (global)
 *   - Ví dụ: <Image src={url} quality={100} width={800} height={600} alt="..." />
 *
 * ✅ CLOUDINARY DASHBOARD (kiểm tra thủ công):
 *   - Vào Settings > Upload > Upload presets
 *   - Đảm bảo KHÔNG có "Incoming Transformations" nào được bật
 *   - Đảm bảo KHÔNG có "Eager Transformations" nào được bật
 *
 * ⚠️ LƯU Ý:
 *   - Cloudinary lưu ảnh gốc riêng, các transform chỉ tạo bản sao
 *   - Ảnh gốc luôn có thể truy cập qua URL không có transformation
 *   - PNG/WebP lossless giữ chất lượng tốt hơn JPEG khi quality < 100
 * ====================================================
 */
