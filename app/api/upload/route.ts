import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'Không có file được gửi lên' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'File quá lớn. Tối đa 5MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'laptop-products',
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const uploadResult = result as any;

        return NextResponse.json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                width: uploadResult.width,
                height: uploadResult.height,
            }
        });

    } catch (error) {
        console.error('❌ UPLOAD ERROR:', error);
        return NextResponse.json(
            { success: false, message: 'Lỗi khi upload ảnh' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa ảnh từ Cloudinary
export async function DELETE(request: Request) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return NextResponse.json(
                { success: false, message: 'Thiếu publicId' },
                { status: 400 }
            );
        }

        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({
            success: true,
            message: 'Xóa ảnh thành công'
        });

    } catch (error) {
        console.error('❌ DELETE ERROR:', error);
        return NextResponse.json(
            { success: false, message: 'Lỗi khi xóa ảnh' },
            { status: 500 }
        );
    }
}
