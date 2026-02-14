import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text || text.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Vui lòng nhập mô tả sản phẩm' },
                { status: 400 }
            );
        }

        // Initialize Gemini client
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'Chưa cấu hình Gemini API key' },
                { status: 500 }
            );
        }

        const client = new GoogleGenAI({ apiKey });

        // Craft prompt for parsing Vietnamese laptop descriptions
        const prompt = `
Bạn là một AI chuyên phân tích mô tả sản phẩm laptop tiếng Việt.
Nhiệm vụ: Trích xuất thông tin từ đoạn mô tả dưới đây và trả về JSON.

MÔ TẢ SẢN PHẨM:
${text}

YÊU CẦU:
1. Trích xuất chính xác các thông tin sau (nếu có):
   - name: Tên đầy đủ của laptop (ví dụ: "Asus TUF FA507NUR")
   - model: Mã model (ví dụ: "FA507NUR")
   - brand: Hãng laptop (ví dụ: "Asus", "Dell", "HP", "Lenovo", "MSI", "Acer")
   - cpu: CPU (ví dụ: "R7-7435Hs", "I5-12450H")
   - gpu: Card đồ họa/VGA (ví dụ: "RTX 4050 6G", "RTX 3050")
   - ram: Dung lượng RAM (ví dụ: "16G", "8G")
   - ssd: Dung lượng SSD (ví dụ: "512G", "1T")
   - screen: Thông tin màn hình (ví dụ: "15.6FHD 144Hz", "14 FHD")
   - battery: Pin (ví dụ: "2-3h", "4-5h")
   - price: Giá tiền (chuyển về số VND, ví dụ: "17.500K" → 17500000)
   - warrantyMonths: Thời gian bảo hành (số tháng, ví dụ: "3 tháng" → 3)
   - gift: Quà tặng kèm theo (ví dụ: "Balo, túi chống sốc, chuột")

2. Quy tắc chuyển đổi giá:
   - "17.500K" hoặc "17.5tr" → 17500000
   - "20tr" → 20000000
   - "15.9 củ" → 15900000

3. Trả về ĐÚNG format JSON sau (không thêm markdown, không thêm giải thích):
{
  "name": "string hoặc null",
  "model": "string hoặc null",
  "brand": "string hoặc null",
  "cpu": "string hoặc null",
  "gpu": "string hoặc null",
  "ram": "string hoặc null",
  "ssd": "string hoặc null",
  "screen": "string hoặc null",
  "battery": "string hoặc null",
  "price": number hoặc null,
  "warrantyMonths": number hoặc null,
  "gift": "string hoặc null"
}

CHÚ Ý: Chỉ trả về JSON object, KHÔNG thêm bất kỳ text nào khác.
`;

        // Use Interactions API (correct syntax from official docs)
        const interaction = await client.interactions.create({
            model: 'gemini-3-flash-preview',
            input: prompt,
        });

        // Safely access the response text with proper null checks
        const outputs = interaction.outputs;
        if (!outputs || outputs.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Không nhận được phản hồi từ AI' },
                { status: 500 }
            );
        }

        const lastOutput = outputs[outputs.length - 1];
        const responseText = (lastOutput as any)?.text || '';

        if (!responseText) {
            return NextResponse.json(
                { success: false, message: 'Không nhận được phản hồi từ AI' },
                { status: 500 }
            );
        }

        // Parse JSON from response
        let parsedData;
        try {
            // Remove markdown code blocks if present
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            parsedData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response Text:', responseText);
            return NextResponse.json(
                { success: false, message: 'Không thể phân tích dữ liệu từ AI' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Phân tích thành công',
            data: parsedData
        });

    } catch (error: any) {
        console.error('❌ AI Parse Error:', error);

        if (error.message?.includes('API key')) {
            return NextResponse.json(
                { success: false, message: 'Chưa cấu hình Gemini API key. Vui lòng thêm GEMINI_API_KEY vào .env.local' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Lỗi khi phân tích với AI: ' + error.message },
            { status: 500 }
        );
    }
}
