import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// ─── Local cache cho các model phổ biến ────────────────────────────────────
const CACHED_MODELS: Record<string, any> = {
    // GAMING
    "asus tuf gaming f15": {
        modelName: "Asus TUF Gaming F15 (FX506)",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 2, maxCapacity: "2TB", canUpgrade: true },
        message: "Dễ nâng cấp, có 2 khe M.2 NVMe và 2 khe RAM DDR4."
    },
    "acer nitro 5": {
        modelName: "Acer Nitro 5 AN515",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe + 2.5 SATA (tuỳ đời)", slots: 2, maxCapacity: "2TB", canUpgrade: true },
        message: "Có khe SATA 2.5\" ở một số đời — kiểm tra trước khi mua."
    },
    "lenovo legion 5": {
        modelName: "Lenovo Legion 5",
        ram: { type: "DDR4/DDR5 (tuỳ đời)", bus: "3200–4800MHz", slots: 2, maxCapacity: "64GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 4.0", slots: 2, maxCapacity: "4TB", canUpgrade: true },
        message: "2 khe SSD M.2 PCIe 4.0, nâng cấp dễ dàng."
    },
    "lenovo ideapad gaming 3": {
        modelName: "Lenovo IdeaPad Gaming 3",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 1, maxCapacity: "1TB", canUpgrade: true },
        message: "Chỉ 1 khe SSD M.2, RAM có thể nâng lên 32GB."
    },
    "msi gf63 thin": {
        modelName: "MSI GF63 Thin",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "64GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 2, maxCapacity: "2TB", canUpgrade: true },
        message: "Có 1 khe M.2 NVMe và 1 khe 2.5 inch SATA."
    },
    "hp victus 15": {
        modelName: "HP Victus 15",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "32GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 4.0", slots: 1, maxCapacity: "1TB", canUpgrade: true },
        message: "1 khe SSD M.2, không có khe SATA 2.5\"."
    },

    // OFFICE / ULTRABOOK
    "dell latitude 5420": {
        modelName: "Dell Latitude 5420",
        ram: { type: "DDR4", bus: "3200MHz", slots: 1, maxCapacity: "32GB (8GB hàn + 1 slot)", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 1, maxCapacity: "2TB", canUpgrade: true },
        message: "RAM có 8GB hàn + 1 khe trống, SSD M.2 dễ thay."
    },
    "dell latitude 7420": {
        modelName: "Dell Latitude 7420",
        ram: { type: "LPDDR4x (Onboard)", bus: "4266MHz", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 1, maxCapacity: "1TB", canUpgrade: true },
        message: "RAM hàn chết trên bo mạch. Chỉ nâng cấp được SSD."
    },
    "dell xps 13": {
        modelName: "Dell XPS 13 (9300/9310/9315)",
        ram: { type: "LPDDR4x/LPDDR5 (Onboard)", bus: "Tuỳ đời", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        ssd: { type: "M.2 NVMe PCIe 3.0/4.0", slots: 1, maxCapacity: "2TB", canUpgrade: true },
        message: "RAM hàn cứng không thể nâng. Chỉ thay SSD M.2."
    },
    "hp elitebook 840": {
        modelName: "HP EliteBook 840 G7/G8",
        ram: { type: "DDR4", bus: "2933MHz", slots: 2, maxCapacity: "64GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 1, maxCapacity: "2TB", canUpgrade: true },
        message: "2 khe RAM DDR4, 1 khe SSD M.2 — máy doanh nghiệp dễ nâng cấp."
    },
    "lenovo thinkpad e14": {
        modelName: "Lenovo ThinkPad E14",
        ram: { type: "DDR4", bus: "3200MHz", slots: 2, maxCapacity: "48GB (16GB hàn + 1 slot 32GB)", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 1, maxCapacity: "1TB", canUpgrade: true },
        message: "Có 8GB/16GB hàn sẵn + 1 khe DDR4 trống. SSD M.2 thay được."
    },
    "asus vivobook 15": {
        modelName: "Asus Vivobook 15 (X515)",
        ram: { type: "DDR4", bus: "2666/3200MHz", slots: 1, maxCapacity: "16GB (Onboard + 1 slot)", canUpgrade: true },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 2, maxCapacity: "1TB + 1TB", canUpgrade: true },
        message: "Thường có 4–8GB hàn và 1 khe SO-DIMM trống."
    },

    // MACBOOK
    "macbook air m1": {
        modelName: "MacBook Air M1 (2020)",
        ram: { type: "Unified Memory (SoC)", bus: "Tích hợp chip M1", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        ssd: { type: "Hàn trực tiếp trên bo mạch", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        message: "⚠️ Chip M1 tích hợp RAM và SSD lên bo mạch — KHÔNG thể nâng cấp."
    },
    "macbook air m2": {
        modelName: "MacBook Air M2 (2022)",
        ram: { type: "Unified Memory (SoC)", bus: "Tích hợp chip M2", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        ssd: { type: "Hàn trực tiếp trên bo mạch", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        message: "⚠️ Chip M2 tích hợp RAM và SSD — KHÔNG thể nâng cấp sau mua."
    },
    "macbook pro m1": {
        modelName: "MacBook Pro M1/M1 Pro/M1 Max",
        ram: { type: "Unified Memory (SoC)", bus: "Tích hợp chip Apple Silicon", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        ssd: { type: "Hàn trực tiếp trên bo mạch", slots: 0, maxCapacity: "Không thể nâng", canUpgrade: false },
        message: "⚠️ Apple Silicon tích hợp tất cả — RAM, SSD đều KHÔNG thể nâng cấp."
    },

    // WORKSTATION
    "dell precision 5550": {
        modelName: "Dell Precision 5550",
        ram: { type: "DDR4 ECC/Non-ECC", bus: "2933MHz", slots: 2, maxCapacity: "64GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe PCIe 3.0", slots: 2, maxCapacity: "4TB", canUpgrade: true },
        message: "Workstation mỏng, 2 khe SSD M.2 và 2 khe RAM DDR4."
    },
    "hp zbook 15": {
        modelName: "HP ZBook 15 G6/G7",
        ram: { type: "DDR4 ECC", bus: "2666MHz", slots: 4, maxCapacity: "128GB", canUpgrade: true },
        ssd: { type: "M.2 NVMe + 2.5 SATA", slots: 3, maxCapacity: "6TB", canUpgrade: true },
        message: "Workstation full size — 4 khe RAM, khả năng nâng cấp cực mạnh."
    }
};

// ─── Normalize model name (bỏ dấu, bỏ ký tự thừa) ─────────────────────────
function normalizeInput(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export async function POST(request: Request) {
    try {
        const { model } = await request.json();

        if (!model || model.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Vui lòng nhập tên hoặc mã máy laptop' },
                { status: 400 }
            );
        }

        // ── 1. Kiểm tra cache trước ──────────────────────────────────────────
        const normalizedInput = normalizeInput(model);
        const cachedKey = Object.keys(CACHED_MODELS).find(key =>
            normalizedInput.includes(normalizeInput(key)) ||
            normalizeInput(key).split(' ').every(word => normalizedInput.includes(word))
        );

        if (cachedKey) {
            console.log(`[laptop-specs-ai] Cache hit: "${cachedKey}"`);
            return NextResponse.json({ success: true, data: CACHED_MODELS[cachedKey], source: 'cache' });
        }

        // ── 2. Gọi Gemini AI ─────────────────────────────────────────────────
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'Chưa cấu hình Gemini API key' },
                { status: 500 }
            );
        }

        const client = new GoogleGenAI({ apiKey });

        const prompt = `
Bạn là chuyên gia phần cứng laptop với 15 năm kinh nghiệm.
Người dùng nhập tên/mã laptop: "${model}"

Nhiệm vụ: Tra cứu thông số nâng cấp RAM và SSD chính xác nhất cho model này.

⚠️ LƯU Ý QUAN TRỌNG:
- Nếu là chip Apple Silicon (M1/M2/M3/M4) → RAM và SSD đều KHÔNG thể nâng cấp (hàn vào chip)
- Nếu RAM "onboard"/"soldered"/"LPDDR" (không có chân cắm) → canUpgrade: false, slots: 0
- Nếu không chắc chắn 100% → ghi rõ trong message "(chưa xác nhận, cần kiểm tra thực tế)"
- maxCapacity phải là con số thực tế của nhà sản xuất, không phỏng đoán tùy tiện
- Xác định đúng thế hệ: DDR3/DDR4/DDR5, PCIe 3.0/4.0/5.0

Trả về ĐÚNG định dạng JSON sau (không thêm markdown, không thêm text ngoài JSON):
{
  "modelName": "Tên đầy đủ chính thức của model",
  "ram": {
    "type": "Loại RAM (DDR4 / DDR5 / LPDDR4x / Unified Memory / v.v.)",
    "bus": "Tốc độ bus (ví dụ: 3200MHz, 4800MHz, Onboard)",
    "slots": <số khe RAM có thể cài/thay>,
    "maxCapacity": "Dung lượng tối đa hỗ trợ (ví dụ: 32GB, Không thể nâng)",
    "canUpgrade": <true hoặc false>
  },
  "ssd": {
    "type": "Loại SSD (ví dụ: M.2 NVMe PCIe 4.0, 2.5 SATA, Soldered)",
    "slots": <số khe SSD có thể lắp>,
    "maxCapacity": "Dung lượng tối đa (ví dụ: 2TB, Không thể nâng)",
    "canUpgrade": <true hoặc false>
  },
  "message": "Nhận xét ngắn gọn bằng tiếng Việt về khả năng nâng cấp, lưu ý đặc biệt nếu có"
}
`;

        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
            }
        });

        const responseText = response.text || '';

        if (!responseText) {
            return NextResponse.json(
                { success: false, message: 'AI không trả về kết quả. Vui lòng thử lại.' },
                { status: 500 }
            );
        }

        let specs;
        try {
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            specs = JSON.parse(cleanedText);
        } catch (e) {
            console.error('[laptop-specs-ai] JSON parse error:', e, '\nRaw:', responseText);
            specs = {
                modelName: model,
                ram: { type: "DDR4", bus: "Không rõ", slots: 2, maxCapacity: "32GB", canUpgrade: true },
                ssd: { type: "M.2 NVMe", slots: 1, maxCapacity: "1TB", canUpgrade: true },
                message: "⚠️ Không thể phân tích kết quả AI. Thông số hiển thị là ước tính — vui lòng kiểm tra thêm."
            };
        }

        return NextResponse.json({ success: true, data: specs, source: 'ai' });

    } catch (error: any) {
        console.error('[laptop-specs-ai] Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Lỗi xử lý AI' },
            { status: 500 }
        );
    }
}
