import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <Header />
            <div className="">
                {children}
            </div>
        </div>
    );
}
