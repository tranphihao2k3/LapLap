import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
    try {
        const { product, style = 'persuasive' } = await request.json();

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Thiếu thông tin sản phẩm' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'Chưa cấu hình Gemini API key' },
                { status: 500 }
            );
        }

        const client = new GoogleGenAI({ apiKey });

        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        const link = `https://laplapcantho.store/laptops/${product.slug || product._id}`;

        let stylePrompt = '';
        if (style === 'urgency') {
            stylePrompt = 'Tập trung vào sự khan hiếm, giới hạn số lượng, ưu đãi chỉ trong hôm nay, hối thúc khách hàng.';
        } else if (style === 'technical') {
            stylePrompt = 'Tập trung vào sức mạnh phần cứng, hiệu năng thực tế cho đồ họa/gaming, thông số kỹ thuật ấn tượng.';
        } else {
            stylePrompt = 'Phong cách dẫn dắt, lôi cuốn, nêu bật đặc quyền khi mua hàng tại LapLap Cần Thơ.';
        }

        const prompt = `
        Bạn là một chuyên gia Content Marketing cho cửa hàng bán laptop "LapLap Cần Thơ". 
        Hãy viết một bài đăng Facebook cực kỳ hấp dẫn để bán sản phẩm sau:
        Tên: ${product.name}
        Giá: ${price}
        Cấu hình: CPU ${product.specs.cpu}, RAM ${product.specs.ram}, SSD ${product.specs.ssd}, Màn hình ${product.specs.screen}
        Link sản phẩm: ${link}
        
        Yêu cầu:
        1. Sử dụng nhiều emoji bắt mắt nhưng chuyên nghiệp.
        2. ${stylePrompt}
        3. Phải có Call to Action (CTA) cực mạnh dẫn dắt khách click vào link sản phẩm.
        4. Bao gồm các hashtag: #LaptopCanTho #LaptopGiaRe #LapLapCanTho #${product.name.replace(/\s+/g, '')}
        5. Nội dung phải tự nhiên, không giống robot, mang tính chất chia sẻ giá trị.
        6. Đừng ghi "Giá: [số tiền]", hãy ghi linh hoạt như "Chốt ngay chỉ với...", "Đầu tư ngay...".
        
        Chỉ trả về nội dung bài viết, không kèm theo lời nhận xét nào khác.
        `;

        const interaction = await client.interactions.create({
            model: 'gemini-3-flash-preview',
            input: prompt,
        });

        const content = (interaction.outputs?.[0] as any)?.text || '';

        return NextResponse.json({
            success: true,
            data: content.trim()
        });

    } catch (error: any) {
        console.error('AI Marketing Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Lỗi khi tạo nội dung với AI' },
            { status: 500 }
        );
    }
}
