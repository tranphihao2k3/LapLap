import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto p-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}
