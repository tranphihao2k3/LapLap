import Link from "next/link";
import Image from "next/image";
import { Itim } from "next/font/google";
import { MapPin } from "lucide-react";

const itim = Itim({
    subsets: ["latin", "vietnamese"],
    weight: "400",
    display: "swap",
});

export default function Header() {
    return (
        <header className="w-full">
            {/* Logo */}
            <div className="bg-white py-6">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className={itim.className + " text-2xl font-bold"}>
                        Lap Lap Store
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Cần Thơ</span>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="bg-[#A2D8EF] border-t border-b border-gray-300">
                <ul className="container mx-auto flex justify-center gap-8 py-3 font-medium">
                    <li className={itim.className + " text-xl"}><Link href="/laptops">Laptop</Link></li>
                    {/* <li className={itim.className + " text-xl"}><Link href="/phu-kien">Phụ kiện</Link></li> */}
                    {/* <li className={itim.className + " text-xl"}><Link href="/nang-cap">Nâng cấp máy</Link></li> */}
                    <li className={itim.className + " text-xl"}><Link href="/ve-sinh-laptop">Vệ sinh máy</Link></li>
                    <li className={itim.className + " text-xl"}><Link href="/sua-chua-laptop">Sửa chữa thay thế</Link></li>
                    <li className={itim.className + " text-xl"}><Link href="/test" >Kiểm tra máy</Link></li>
                </ul>
            </nav>
        </header>
    );
}
