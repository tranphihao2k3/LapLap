import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Brand } from '@/models/Brand';

interface AISearchCriteria {
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    cpu?: string;
    gpu?: string;
    ram?: string;
    ssd?: string;
    screen?: string;
    useCase?: string;
}

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query || query.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Vui lòng nhập yêu cầu tìm kiếm' },
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

        // Craft prompt for parsing search query
        const prompt = `
Bạn là AI chuyên phân tích yêu cầu tìm kiếm laptop tiếng Việt.
Nhiệm vụ: Trích xuất tiêu chí tìm kiếm từ câu hỏi của người dùng.

YÊU CẦU TÌM KIẾM:
${query}

HƯỚNG DẪN:
1. Trích xuất các tiêu chí sau (nếu có):
   - brand: Tên hãng (Asus, Dell, HP, Lenovo, MSI, Acer, Apple, etc.)
   - priceMin: Giá tối thiểu (VND)
   - priceMax: Giá tối đa (VND)
   - cpu: Yêu cầu CPU (i5, i7, R5, R7, etc.)
   - gpu: Yêu cầu VGA (RTX, GTX, Radeon, etc.)
   - ram: Dung lượng RAM (8G, 16G, 32G, etc.)
   - ssd: Dung lượng SSD (256G, 512G, 1T, etc.)
   - screen: Yêu cầu màn hình (FHD, 2K, 4K, 144Hz, etc.)
   - useCase: Mục đích sử dụng (gaming, office, student, creative, etc.)

2. Quy tắc chuyển đổi giá:
   - "15tr", "15 triệu", "15 củ" → 15000000
   - "dưới 20tr" → priceMax: 20000000
   - "từ 15-20tr" → priceMin: 15000000, priceMax: 20000000
   - "trên 25tr" → priceMin: 25000000

3. Nhận diện mục đích:
   - "gaming", "chiến game" → gaming
   - "văn phòng", "office" → office
   - "học sinh", "sinh viên" → student
   - "đồ họa", "render", "design" → creative

4. Trả về JSON (không thêm markdown):
{
  "brand": "string hoặc null",
  "priceMin": number hoặc null,
  "priceMax": number hoặc null,
  "cpu": "string hoặc null",
  "gpu": "string hoặc null",
  "ram": "string hoặc null",
  "ssd": "string hoặc null",
  "screen": "string hoặc null",
  "useCase": "string hoặc null"
}

CHÚ Ý: Chỉ trả về JSON, KHÔNG thêm text khác.
`;

        // Use Interactions API to parse query
        const interaction = await client.interactions.create({
            model: 'gemini-3-flash-preview',
            input: prompt,
        });

        // Safely access the response
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

        // Parse AI response
        let criteria: AISearchCriteria;
        try {
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            criteria = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response Text:', responseText);
            return NextResponse.json(
                { success: false, message: 'Không thể phân tích yêu cầu tìm kiếm' },
                { status: 500 }
            );
        }

        // Connect to database
        await connectDB();

        // Build MongoDB query
        const dbQuery: any = { isActive: true };

        // Brand filter
        if (criteria.brand) {
            const brand = await Brand.findOne({
                name: { $regex: new RegExp(criteria.brand, 'i') }
            });
            if (brand) {
                dbQuery.brandId = brand._id;
            }
        }

        // Price filter
        if (criteria.priceMin || criteria.priceMax) {
            dbQuery.price = {};
            if (criteria.priceMin) dbQuery.price.$gte = criteria.priceMin;
            if (criteria.priceMax) dbQuery.price.$lte = criteria.priceMax;
        }

        // Specs filters (case-insensitive regex)
        if (criteria.cpu) {
            dbQuery['specs.cpu'] = { $regex: new RegExp(criteria.cpu, 'i') };
        }
        if (criteria.gpu) {
            dbQuery['specs.gpu'] = { $regex: new RegExp(criteria.gpu, 'i') };
        }
        if (criteria.ram) {
            dbQuery['specs.ram'] = { $regex: new RegExp(criteria.ram, 'i') };
        }
        if (criteria.ssd) {
            dbQuery['specs.ssd'] = { $regex: new RegExp(criteria.ssd, 'i') };
        }
        if (criteria.screen) {
            dbQuery['specs.screen'] = { $regex: new RegExp(criteria.screen, 'i') };
        }

        // Execute query
        const laptops = await Product.find(dbQuery)
            .populate('brandId', 'name')
            .populate('categoryId', 'name')
            .limit(50)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            message: `Tìm thấy ${laptops.length} laptop phù hợp`,
            data: {
                criteria,
                laptops,
                count: laptops.length
            }
        });

    } catch (error: any) {
        console.error('❌ AI Search Error:', error);

        return NextResponse.json(
            { success: false, message: 'Lỗi khi tìm kiếm: ' + error.message },
            { status: 500 }
        );
    }
}
