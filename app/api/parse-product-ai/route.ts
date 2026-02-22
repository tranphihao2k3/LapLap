import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        const { text, model } = await request.json();

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

        // Fetch categories and brands to guide the AI
        await connectDB();
        const [categories, brands] = await Promise.all([
            Category.find({}, 'name _id'),
            Brand.find({}, 'name _id')
        ]);

        const categoryNames = categories.map(c => c.name).join(', ');
        const brandNames = brands.map(b => b.name).join(', ');

        const client = new GoogleGenAI({ apiKey });

        // Craft prompt for parsing Vietnamese laptop descriptions
        // Craft prompt for parsing Vietnamese laptop descriptions - OPTIMIZED FOR SPEED
        // Import spec lists dynamically or hardcode top common ones for context
        // To keep it simple and fast, we'll embed the key standard lists directly in the prompt
        // or imported from commonSpecs if we could, but this is a server route.
        // Let's redefine short versions here to save token space but guide the AI.

        const standardRAMs = ['8GB', '16GB', '32GB', '64GB'];
        const standardSSDs = ['256GB', '512GB', '1TB', '2TB'];
        const standardBatteries = ['2-3h', '3-4h', '4-5h', '5-6h']; // Examples

        const prompt = `
EXTRACT JSON FROM TEXT.
INPUT TEXT:
${text}

CONTEXT:
Categories: [${categoryNames}]
Brands: [${brandNames}]
Standard RAM: [${standardRAMs.join(', ')}]
Standard SSD: [${standardSSDs.join(', ')}]
Standard Battery: [${standardBatteries.join(', ')}]

OUTPUT SCHEMA (JSON ONLY):
{
  "name": "CLEAN product name ONLY (e.g. 'Dell Latitude 9510 2in1'). Strip away promotional text or conditions like 'vỏ nhôm', 'máy đẹp 99%', 'nguyên zin', 'sạc ít lần'.",
  "model": "Model code",
  "brand": "Exact match from Brands list or null",
  "categoryName": "Best match from Categories list or null",
  "description": "Synthesize a short, engaging description summarizing the laptop. YOU MUST include all the condition/promotional text you stripped from the name here.",
  "cpu": "CPU spec only (NO core count/thread count, e.g. R7-7435Hs)",
  "gpu": "GPU spec ONLY brand/model and VRAM size (NO wattage). Example: 'RTX 3050 6GB', 'RTX 4050 6GB'",
  "ram": "Standardized RAM with GB (e.g. 16GB)",
  "ssd": "Standardized SSD with GB (e.g. 512GB)",
  "screen": "Screen size and panel type ONLY (e.g. 15.6 inch IPS). NO sRGB, NO Hz.",
  "hz": "Refresh rate ONLY (e.g. 144Hz, 60Hz, 165Hz)",
  "resolution": "Resolution ONLY (e.g. FHD, 2K, QHD, WUXGA)",
  "battery": "Battery usage (e.g. 3-4h)",
  "price": 17500000,
  "warrantyMonths": 12,
  "gift": "Gifts string"
}

RULES:
1. Price: return integer value (e.g. "17.5tr" -> 17500000). If not found, return null.
2. Specs: Prefer "Standard" values if close match.
3. NAME: Must NOT contain condition or promotional descriptions.
`;

        const response = await client.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.1, // Low temperature for deterministic output
            }
        });

        const responseText = response.text || '';
        if (!responseText) {
            return NextResponse.json(
                { success: false, message: 'Không nhận được phản hồi từ AI' },
                { status: 500 }
            );
        }

        // Parse JSON from response
        interface AIParsedData {
            name?: string | null;
            model?: string | null;
            brand?: string | null;
            brandId?: string;
            categoryName?: string | null;
            categoryId?: string;
            description?: string | null;
            cpu?: string | null;
            gpu?: string | null;
            ram?: string | null;
            ssd?: string | null;
            screen?: string | null;
            hz?: string | null;
            resolution?: string | null;
            battery?: string | null;
            price?: number | null;
            warrantyMonths?: number | null;
            gift?: string | null;
        }

        let parsedData: AIParsedData;
        try {
            // Remove markdown code blocks if present
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            parsedData = JSON.parse(cleanedText);

            // Map Category Name to ID
            if (parsedData.categoryName) {
                const matchedCategory = categories.find(c =>
                    c.name.toLowerCase() === (parsedData.categoryName?.toLowerCase() || '') ||
                    c.name.toLowerCase().includes(parsedData.categoryName?.toLowerCase() || '')
                );
                if (matchedCategory) {
                    parsedData.categoryId = matchedCategory._id.toString();
                }
            }

            // Map Brand Name to ID
            if (parsedData.brand) {
                const matchedBrand = brands.find(b =>
                    b.name.toLowerCase() === (parsedData.brand?.toLowerCase() || '') ||
                    b.name.toLowerCase().includes(parsedData.brand?.toLowerCase() || '')
                );
                if (matchedBrand) {
                    parsedData.brandId = matchedBrand._id.toString();
                }
            }

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
