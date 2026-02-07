import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="flex-1 container mx-auto p-4">
                {children}
            </main>
            <Footer />
        </>
    );
}
