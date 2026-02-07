"use client";

import { useEffect, useRef, useState } from "react";

export default function MicTest({ onBack }: { onBack: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const animationRef = useRef<number>();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStream(s);

                const audioCtx = new AudioContext();
                const source = audioCtx.createMediaStreamSource(s);
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const canvas = canvasRef.current!;
                if (canvas) {
                    const ctx = canvas.getContext("2d")!;
                    const resize = () => {
                        if (canvas.parentElement) {
                            canvas.width = canvas.parentElement.clientWidth;
                            canvas.height = 200;
                        }
                    };
                    resize();
                    window.addEventListener("resize", resize);

                    const draw = () => {
                        analyser.getByteFrequencyData(dataArray);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        const barWidth = canvas.width / dataArray.length;

                        dataArray.forEach((v, i) => {
                            const h = (v / 255) * canvas.height;
                            ctx.fillStyle = "#00aaff"; // xanh
                            ctx.fillRect(
                                i * barWidth,
                                canvas.height - h,
                                barWidth - 1,
                                h
                            );
                        });

                        animationRef.current = requestAnimationFrame(draw);
                    };
                    draw();

                    return () => {
                        window.removeEventListener("resize", resize);
                    };
                }
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        };

        init();

        return () => {
            animationRef.current && cancelAnimationFrame(animationRef.current);
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const startRecord = () => {
        if (!stream) return;
        audioChunksRef.current = [];

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            setAudioURL(URL.createObjectURL(blob));
        };

        recorder.start();
        setRecording(true);
    };

    const stopRecord = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <div className="min-h-screen bg-white p-8 text-black flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                    🎙️ Kiểm tra Microphone
                </h1>
                <button
                    onClick={onBack}
                    className="text-sm px-3 py-1.5 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 transition"
                >
                    ← Quay lại
                </button>
            </div>

            <div className="w-full max-w-4xl space-y-6">
                {/* Wave */}
                <div className="border-2 border-blue-500 rounded-md p-2 bg-gray-50">
                    <canvas ref={canvasRef} className="w-full block" />
                </div>

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={startRecord}
                        disabled={recording}
                        className="px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-40 font-medium"
                    >
                        {recording ? "Đang ghi âm..." : "Bắt đầu Ghi âm"}
                    </button>

                    <button
                        onClick={stopRecord}
                        disabled={!recording}
                        className="px-6 py-3 border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-40 font-medium"
                    >
                        Dừng ghi âm
                    </button>
                </div>

                {/* Playback */}
                {audioURL && (
                    <div className="mt-6 border border-gray-200 p-4 rounded-lg bg-gray-50 text-center">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nghe lại bản ghi âm của bạn:</p>
                        <audio src={audioURL} controls className="mx-auto" />
                    </div>
                )}
            </div>
        </div>
    );
}
