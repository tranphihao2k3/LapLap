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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
                {filters.map((label) => (
                    <button
                        key={label}
                        className="flex items-center justify-between w-full gap-1.5 md:gap-2 bg-[#004e9a] text-white px-2.5 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#003b78] transition shadow-sm"
                    >
                        <span className="truncate">{label}</span>
                        <ChevronDown size={14} className="flex-shrink-0 md:w-4 md:h-4 text-white" />
                    </button>
                ))}
            </div>
        </div>
    );
}
