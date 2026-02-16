import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Shield, Clock, FileBox, CheckCircle, Smartphone, ArrowLeft, Monitor } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Software } from '@/models/Software';
import { notFound } from 'next/navigation';

import { seedSoftware, softwareList } from '@/lib/seed';

async function getSoftware(slug: string) {
    await connectDB();
    let software = await Software.findOne({ slug, status: 'published' }).lean();

    if (!software) {
        // Try to find in seed list and insert if missing
        const seedItem = softwareList.find(s => s.slug === slug);
        if (seedItem) {
            console.log(`Auto-seeding missing item: ${slug}`);
            await Software.create(seedItem);
            software = await Software.findOne({ slug, status: 'published' }).lean();
        }
    }

    if (!software) return null;
    return JSON.parse(JSON.stringify(software)); // Serialize for Next.js
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const sw = await getSoftware(slug);
    if (!sw) return { title: 'Not Found' };
    return {
        title: `Tải ${sw.title} - Mới Nhất Miễn Phí`,
        description: sw.excerpt,
    };
}

export default async function SoftwareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sw = await getSoftware(slug);

    if (!sw) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Header Background */}
            <div className="h-64 bg-gradient-to-r from-blue-900 to-indigo-900 absolute top-0 left-0 right-0 z-0"></div>

            <main className="container mx-auto px-4 relative z-10 py-10">
                <Link href="/cai-dat-phan-mem" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2">
                        {/* Title Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-2 shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                    {sw.featuredImage ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={sw.featuredImage}
                                                alt={sw.title}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                    ) : (
                                        <Monitor className="w-12 h-12 text-blue-300" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide border border-blue-100">
                                            {sw.category}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${sw.type === 'Free'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                            }`}>
                                            {sw.type}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                        {sw.title}
                                    </h1>

                                    <p className="text-gray-500 mb-6 line-clamp-2">
                                        {sw.excerpt}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={sw.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Tải Xuống
                                        </a>
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium border border-green-100">
                                            <Shield className="w-4 h-4" />
                                            <span className="text-sm">An toàn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileBox className="w-5 h-5 text-blue-500" />
                                Chi tiết phần mềm
                            </h2>
                            <div
                                className="prose prose-blue max-w-none text-gray-600 prose-headings:text-gray-800 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: sw.content }}
                            />
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50">
                                    Thông tin kỹ thuật
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Phiên bản
                                        </span>
                                        <span className="font-semibold text-gray-900">{sw.version}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <FileBox className="w-4 h-4" /> Dung lượng
                                        </span>
                                        <span className="font-semibold text-gray-900">{sw.fileSize}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <Monitor className="w-4 h-4" /> Hệ điều hành
                                        </span>
                                        <span className="font-semibold text-gray-900">{sw.platform}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Trạng thái
                                        </span>
                                        <span className="font-semibold text-green-600">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Lượt xem</span>
                                        <span className="font-semibold text-gray-900">{sw.views || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Card */}
                            {sw.tags && sw.tags.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {sw.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs rounded-lg transition-colors border border-gray-100"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
