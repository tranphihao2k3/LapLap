import { ChevronDown } from "lucide-react";

const filters = [
    "Theo phân loại",
    "Theo hãng",
    "CPU",
    "SSD HDD",
    "VGA",
    "Theo giá",
    "Kích thước màn hình",
    "Trọng lượng",
    "Tình trạng",
];

export default function FilterBar() {
    return (
        <div className="mb-6">
            <h2 className="font-bold text-[#004e9a] mb-3">
                Danh mục phân loại
            </h2>

            <div className="flex flex-wrap gap-3">
                {filters.map((label) => (
                    <button
                        key={label}
                        className="flex items-center gap-2 bg-[#004e9a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003b78] transition"
                    >
                        {label}
                        <ChevronDown size={16} />
                    </button>
                ))}
            </div>
        </div>
    );
}
