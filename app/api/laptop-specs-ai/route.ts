
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const CACHED_MODELS: Record<string, any> = {
    // GAMING
    "asus tuf gaming f15": {
        modelName: "Asus TUF Gaming F15",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB" },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 2, maxCapacity: "2TB" },
        message: "Dòng này dễ nâng cấp, có 2 khe SSD."
    },
    "acer nitro 5": {
        modelName: "Acer Nitro 5 (2020/2021)",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB" },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 2, maxCapacity: "2TB" },
        message: "Hỗ trợ cả SSD M.2 và ổ 2.5 inch (tuỳ đời)."
    },
    "lenovo legion 5": {
        modelName: "Lenovo Legion 5",
        ram: { type: "DDR4/DDR5", bus: "3200/4800MHz", slots: 2, maxCapacity: "64GB" },
        ssd: { type: "M.2 NVMe PCIe", slots: 2, maxCapacity: "2TB" },
        message: "Nâng cấp được cả RAM và 2 ổ SSD."
    },
    "msi gf63 thin": {
        modelName: "MSI GF63 Thin",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "64GB" },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 2, maxCapacity: "2TB" },
        message: "Có 1 khe SSD M.2 và 1 khe 2.5 inch (tuỳ đời)."
    },

    // OFFICE
    "dell xps 13 9360": {
        modelName: "Dell XPS 13 9360",
        ram: { type: "LPDDR3", bus: "Onboard", slots: 0, maxCapacity: "Không thể nâng" },
        ssd: { type: "M.2 NVMe", slots: 1, maxCapacity: "1TB" },
        message: "RAM hàn chết, chỉ nâng được SSD."
    },
    "macbook air m1": {
        modelName: "MacBook Air M1",
        ram: { type: "Unified", bus: "SoC", slots: 0, maxCapacity: "Không thể nâng" },
        ssd: { type: "Soldered", slots: 0, maxCapacity: "Không thể nâng" },
        message: "Cả RAM và SSD đều hàn chết, không thể nâng cấp."
    },
    "asus vivobook 15": {
        modelName: "Asus Vivobook 15 (X515)",
        ram: { type: "DDR4", bus: "2666/3200MHz", slots: 1, maxCapacity: "16GB (Onboard + 1 Slot)" },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 2, maxCapacity: "1TB" },
        message: "Thường có 4GB/8GB hàn và 1 khe trống."
    },

    // WORKSTATION
    "dell precision 5520": {
        modelName: "Dell Precision 5520",
        ram: { type: "DDR4", bus: "2400MHz", slots: 2, maxCapacity: "32GB" },
        ssd: { type: "M.2 NVMe", slots: 1, maxCapacity: "2TB" },
        message: "Máy trạm mỏng nhẹ, nâng RAM/SSD thoải mái."
    },
    "hp zbook 15 g3": {
        modelName: "HP ZBook 15 G3",
        ram: { type: "DDR4", bus: "2133MHz", slots: 4, maxCapacity: "64GB" },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 3, maxCapacity: "4TB" },
        message: "Khả năng nâng cấp cực khủng với 4 khe RAM."
    }
};

export async function POST(request: Request) {
    try {
        const { model } = await request.json();

        if (!model || model.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Vui lòng nhập tên hoặc mã máy laptop' },
                { status: 400 }
            );
        }

        // 1. Check Cache First (Case-insensitive partial match)
        const normalizeModel = model.toLowerCase().trim();
        const cachedKey = Object.keys(CACHED_MODELS).find(key => normalizeModel.includes(key));

        if (cachedKey) {
            return NextResponse.json({
                success: true,
                data: CACHED_MODELS[cachedKey]
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'Chưa cấu hình Gemini API key' },
                { status: 500 }
            );
        }

        const client = new GoogleGenAI({ apiKey });

        const prompt = `
        You are a laptop hardware expert.
        Provide technical upgrade specifications for the laptop model: "${model}".
        
        Return ONLY valid JSON (no markdown, no extra text) with the following structure:
        {
          "modelName": "Full official model name",
          "ram": {
             "type": "e.g., DDR4",
             "bus": "e.g., 2400MHz, 3200MHz",
             "slots": number (total slots),
             "maxCapacity": "e.g., 32GB"
          },
          "ssd": {
             "type": "e.g., M.2 NVMe PCIe 3.0",
             "slots": number (total slots),
             "maxCapacity": "e.g., 2TB"
          },
          "messsage": "Short note about upgradeability (e.g., 'RAM is soldered', '1 slot available')"
        }
        
        If you are not 100% sure, provide the most likely specs based on standard configurations for this model family.
        `;

        const interaction = await client.interactions.create({
            model: 'gemini-3-flash-preview',
            input: prompt,
        });

        const responseText = (interaction.outputs?.[0] as any)?.text || '';

        let specs;
        try {
            const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            specs = JSON.parse(cleanedText);
        } catch (e) {
            console.error("JSON Parse Error", e);
            // Fallback default
            specs = {
                modelName: model,
                ram: { type: "DDR4", bus: "Unknown", slots: 2, maxCapacity: "32GB" },
                ssd: { type: "NVMe", slots: 1, maxCapacity: "1TB" },
                message: "Không thể lấy thông tin chi tiết, hiển thị thông số mặc định."
            };
        }

        return NextResponse.json({
            success: true,
            data: specs
        });

    } catch (error: any) {
        console.error('AI Error:', error);

        // Extract meaningful error message
        let errorMessage = 'Lỗi khi xử lý với AI';
        if (error.message) {
            errorMessage = error.message;
            // Clean up common ugly error strings if needed, or leave raw for debugging
        }

        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}
