import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

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
        const standardScreens = ['14" FHD', '15.6" FHD 144Hz', '16" FHD+ 165Hz', '14" 2.8K OLED'];
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

OUTPUT SCHEMA (JSON ONLY, NO MARKDOWN, NO THINKING):
{
  "name": "Full product name",
  "model": "Model code",
  "brand": "Exact match from Brands list or null",
  "categoryName": "Best match from Categories list or null",
  "cpu": "CPU spec only (NO core count/thread count)",
  "gpu": "GPU spec (e.g. RTX 3050 6GB)",
  "ram": "Standardized RAM (e.g. 16GB) or raw text",
  "ssd": "Standardized SSD (e.g. 512GB) or raw text",
  "screen": "Screen spec (e.g. 15.6\\" FHD 144Hz)",
  "battery": "Battery usage (e.g. 3-4h)",
  "price": Number (VND),
  "warrantyMonths": Number (months),
  "gift": "Gifts string"
}

RULES:
1. Price: "17.5tr" -> 17500000.
2. Specs: Prefer "Standard" values if close match (e.g. "16G" -> "16GB").
3. If spec not in standard list, return RAW text.
4. CPU: REMOVE core/threads info (e.g. "R7-7435Hs(16Cpus)" -> "R7-7435Hs").
5. Return ONLY the JSON object.
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
        interface AIParsedData {
            name?: string | null;
            model?: string | null;
            brand?: string | null;
            brandId?: string;
            categoryName?: string | null;
            categoryId?: string;
            cpu?: string | null;
            gpu?: string | null;
            ram?: string | null;
            ssd?: string | null;
            screen?: string | null;
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
