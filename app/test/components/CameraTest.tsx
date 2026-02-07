"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function CameraTest({ onBack }: { onBack: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State quản lý
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Lấy danh sách thiết bị khi mới vào trang
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Phải xin quyền trước mới lấy được tên thiết bị (Label)
                await navigator.mediaDevices.getUserMedia({ video: true });

                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(device => device.kind === "videoinput");

                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error(err);
                setError("Không thể truy cập danh sách Camera. Vui lòng cấp quyền.");
            }
        };

        getDevices();

        // Cleanup: Tắt camera khi rời trang
        return () => {
            stopCamera();
        };
    }, []);

    // 2. Hàm bật Camera
    const startCamera = useCallback(async (deviceId: string) => {
        setIsLoading(true);
        setError("");
        stopCamera(); // Tắt stream cũ nếu có

        try {
            const constraints = {
                video: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    width: { ideal: 1920 }, // Cố gắng lấy độ phân giải tốt
                    height: { ideal: 1080 }
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error(err);
            setError("Không thể mở Camera. Hãy kiểm tra quyền truy cập hoặc thiết bị khác đang sử dụng nó.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Hàm tắt Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // 4. Theo dõi sự thay đổi deviceId để bật camera lại
    useEffect(() => {
        if (selectedDeviceId) {
            startCamera(selectedDeviceId);
        }
    }, [selectedDeviceId, startCamera]);

    // 5. Chụp ảnh (Snapshot)
    const takeSnapshot = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Đặt kích thước canvas bằng kích thước video thực tế
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            setSnapshot(dataUrl);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                    📷 Kiểm tra Camera
                </h1>
                <button
                    onClick={onBack}
                    className="text-sm px-3 py-1.5 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 transition"
                >
                    ← Quay lại
                </button>
            </div>

            {/* Main */}
            <div className="w-full max-w-4xl space-y-6">

                {/* Error */}
                {error && (
                    <div className="border border-red-400 bg-red-50 text-red-600 p-4 rounded-lg">
                        ⚠️ {error}
                    </div>
                )}

                {/* Video */}
                <div className="relative aspect-video bg-white rounded-xl overflow-hidden border-2 border-blue-400">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {!stream && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            Camera đang tắt
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="border-2 border-blue-400 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-xs text-gray-500 mb-1">
                            Chọn Camera
                        </label>
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="border border-blue-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {devices.map((d, i) => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || `Camera ${i + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={takeSnapshot}
                            disabled={!stream}
                            className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-40"
                        >
                            📸 Chụp thử
                        </button>

                        <button
                            onClick={stream ? stopCamera : () => startCamera(selectedDeviceId)}
                            className={`px-4 py-2 border-2 rounded transition ${stream
                                ? "border-red-400 text-red-500 hover:bg-red-50"
                                : "border-green-500 text-green-600 hover:bg-green-50"
                                }`}
                        >
                            {stream ? "Tắt Camera" : "Bật Camera"}
                        </button>
                    </div>
                </div>

                {/* Snapshot */}
                {snapshot && (
                    <div className="border-2 border-blue-400 rounded-xl p-4 bg-white">
                        <h3 className="font-semibold mb-3 text-blue-600">
                            📸 Ảnh chụp thử
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4 items-center">
                            <img
                                src={snapshot}
                                alt="Snapshot"
                                className="rounded border border-blue-300"
                            />

                            <div className="text-sm text-gray-600">
                                <p>✅ Camera hoạt động bình thường</p>
                                <p>
                                    Độ phân giải:{" "}
                                    <span className="font-medium">
                                        {canvasRef.current?.width} x {canvasRef.current?.height}
                                    </span>
                                </p>

                                <button
                                    onClick={() => setSnapshot(null)}
                                    className="mt-4 text-red-500 underline hover:text-red-600"
                                >
                                    Xóa ảnh
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
