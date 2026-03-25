export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Breadcrumb skeleton */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                        <div className="h-3 w-3 rounded-full bg-gray-200" />
                        <div className="h-4 w-14 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.05s' }} />
                        <div className="h-3 w-3 rounded-full bg-gray-200" />
                        <div className="h-4 w-48 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.1s' }} />
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-6">

                    {/* Left: Image skeleton */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-100">
                            <div
                                className="aspect-[4/3] rounded-xl"
                                style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }}
                            />
                        </div>
                        {/* Thumbnails row */}
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-20 h-16 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.05}s` }} />
                            ))}
                        </div>
                        {/* Specs table skeleton */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 space-y-3">
                            <div className="h-5 w-40 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-2">
                                    <div className="h-3.5 w-28 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.07}s` }} />
                                    <div className="h-3.5 w-40 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.07 + 0.1}s` }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info skeleton */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 space-y-4">
                            {/* Title */}
                            <div className="h-6 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                            <div className="h-6 w-3/4 rounded-full" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.1s' }} />
                            {/* Price */}
                            <div className="h-14 w-full rounded-2xl" style={{ background: 'linear-gradient(90deg, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.15s' }} />
                            {/* Summary */}
                            <div className="h-24 w-full rounded-xl" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.2s' }} />
                            {/* Buttons */}
                            <div className="h-14 w-full rounded-xl" style={{ background: 'linear-gradient(90deg, #fecaca 25%, #fca5a5 50%, #fecaca 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.25s' }} />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-12 rounded-xl" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.3s' }} />
                                <div className="h-12 rounded-xl" style={{ background: 'linear-gradient(90deg, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite 0.35s' }} />
                            </div>
                        </div>
                        {/* Trust cards skeleton */}
                        <div className="grid grid-cols-2 gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 rounded-xl" style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e8eef5 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.07}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
