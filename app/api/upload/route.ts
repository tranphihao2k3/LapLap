import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Không có file được gửi lên" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)" },
        { status: 400 },
      );
    }

    // ✅ Tăng giới hạn lên 20MB để hỗ trợ ảnh chất lượng cao
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File quá lớn. Tối đa 20MB" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Lấy tên file gốc (bỏ phần mở rộng)
    const originalName = file.name.replace(/\.[^/.]+$/, "");

    // Upload to Cloudinary - giữ nguyên chất lượng ảnh gốc
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "laptop-products",
            resource_type: "image",

            // ✅ Giữ nguyên chất lượng 100% - không nén
            quality: 100,

            // ✅ Không áp dụng bất kỳ transformation nào khi upload
            // (transformation chỉ nên dùng khi fetch qua URL)

            // ✅ Giữ tên file gốc
            use_filename: true,
            unique_filename: true,
            display_name: originalName,

            // ✅ Không overwrite ảnh cũ cùng tên
            overwrite: false,

            // ✅ Bật phân tích metadata để lưu thông tin ảnh gốc
            phash: true,
            image_metadata: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    const uploadResult = result as any;

    return NextResponse.json({
      success: true,
      message: "Upload ảnh thành công",
      data: {
        // ✅ secure_url không có transformation = ảnh gốc chất lượng cao
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi khi upload ảnh: ${(error as Error).message}`,
      },
      { status: 500 },
    );
  }
}

// DELETE - Xóa ảnh từ Cloudinary
export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "Thiếu publicId" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa ảnh" },
      { status: 500 },
    );
  }
}
