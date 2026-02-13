import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RepairProcess from "./components/RepairProcess";
import RepairBanner from "./components/RepairBanner";
import CommonErrors from "./components/CommonErrors";
import ServiceCommitment from "./components/ServiceCommitment";

export default function RepairServicePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white text-slate-800 pb-20">

                {/* --- 1. BANNER TIÊU ĐỀ --- */}
                <RepairBanner />

                <div className="container mx-auto max-w-5xl px-4 py-12">

                    {/* --- 2. CÁC LỖI THƯỜNG GẶP (Grid) --- */}
                    <CommonErrors />

                    {/* --- 3. QUY TRÌNH SỬA CHỮA MINH BẠCH --- */}
                    <RepairProcess />

                    {/* --- 4. CAM KẾT VÀ BÁO GIÁ --- */}
                    <ServiceCommitment />

                </div>
            </main>
            <Footer />
        </>
    );
}
