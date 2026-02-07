"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ================= DỮ LIỆU MẪU ================= */

const RAM_PRODUCTS = Array(4).fill({
    id: 1,
    name: "Samsung 8GB DDR4 3200MHz",
    price: 990000,
    image: "https://placehold.co/300x200/png?text=RAM+Samsung",
    type: "RAM",
});

const SSD_PRODUCTS = Array(4).fill({
    id: 2,
    name: "SSD Samsung 990 PRO 1TB NVMe",
    price: 9900000,
    image: "https://placehold.co/300x200/png?text=SSD+Samsung",
    type: "SSD",
});

/* ================= PAGE ================= */

export default function UpgradePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white text-slate-800 pb-20">
                <div className="container mx-auto px-4 space-y-16">

                    {/* ===== NÂNG RAM ===== */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#003366] mb-4">
                            Nâng RAM Laptop
                        </h2>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <FilterButton label="Loại RAM" options={["DDR3", "DDR4", "DDR5"]} />
                            <FilterButton label="Dung lượng" options={["4GB", "8GB", "16GB", "32GB"]} />
                            <FilterButton label="Bus RAM" options={["2666", "3200", "4800"]} />
                            <FilterButton label="Hãng" options={["Samsung", "Kingston", "Corsair"]} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {RAM_PRODUCTS.map((p, i) => (
                                <ComponentCard key={i} product={p} />
                            ))}
                        </div>
                    </section>

                    {/* ===== NÂNG SSD ===== */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#003366] mb-4">
                            Nâng SSD Laptop
                        </h2>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <FilterButton label="Loại SSD" options={["SATA", "NVMe"]} />
                            <FilterButton label="Dung lượng" options={["256GB", "512GB", "1TB", "2TB"]} />
                            <FilterButton label="Hãng" options={["Samsung", "WD", "Kingston"]} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {SSD_PRODUCTS.map((p, i) => (
                                <ComponentCard key={i} product={p} />
                            ))}
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}

/* ================= COMPONENTS ================= */

// === FILTER DROPDOWN ===
function FilterButton({
    label,
    options,
}: {
    label: string;
    options: string[];
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // click ra ngoài thì đóng
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-[#1e4275] hover:bg-[#163a66]
                           text-white px-4 py-2 rounded text-sm font-semibold transition"
            >
                {label}
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-20 mt-2 w-48 bg-white border border-[#004e9a]
                                rounded shadow-lg overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            className="w-full text-left px-4 py-2 text-sm
                                       text-[#004e9a] hover:bg-blue-50"
                            onClick={() => {
                                console.log(label, opt); // sau này gắn filter thật
                                setOpen(false);
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// === CARD SẢN PHẨM ===
function ComponentCard({ product }: { product: any }) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat("vi-VN").format(price);

    return (
        <div className="border border-[#004e9a] rounded-xl p-4
                        flex flex-col items-center bg-white
                        hover:shadow-xl transition-shadow h-full">
            <div className="w-3/4 aspect-[3/2] mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>

            <h3 className="text-[#004e9a] font-bold text-center text-sm md:text-base
                           mb-2 line-clamp-2 min-h-[3rem]">
                {product.name}
            </h3>

            <div className="mt-auto text-[#004e9a] font-extrabold text-lg">
                {formatPrice(product.price)}₫
            </div>
        </div>
    );
}
