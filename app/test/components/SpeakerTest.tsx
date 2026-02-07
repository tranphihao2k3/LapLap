"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_LIST = [
    { id: "m1", name: "Nhạc 1", file: "/audio/test-music.mp3" },
    { id: "m2", name: "Nhạc 2", file: "/audio/test-music2.mp3" },
    { id: "m3", name: "Nhạc 3", file: "/audio/test-music3.mp3" },
    { id: "m4", name: "Nhạc 4", file: "/audio/test-music4.mp3" },
    { id: "m5", name: "Nhạc 5", file: "/audio/test-music5.mp3" },
];

export default function SpeakerTest({ onBack }: { onBack: () => void }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const pannerRef = useRef<StereoPannerNode | null>(null);

    const [playing, setPlaying] = useState(false);
    const [channel, setChannel] = useState<"left" | "right" | "both">("both");
    const [music, setMusic] = useState(MUSIC_LIST[0]);

    const stop = () => {
        audioRef.current?.pause();
        audioCtxRef.current?.close();

        audioRef.current = null;
        audioCtxRef.current = null;

        setPlaying(false);
    };

    const setupAudio = async (pan: number, file: string) => {
        stop();

        const audio = new Audio(file);
        audio.loop = true;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audio);
        const panner = audioCtx.createStereoPanner();

        panner.pan.value = pan;

        source.connect(panner);
        panner.connect(audioCtx.destination);

        audioRef.current = audio;
        audioCtxRef.current = audioCtx;
        pannerRef.current = panner;

        await audio.play();
        setPlaying(true);
    };

    const play = (type: "left" | "right" | "both") => {
        setChannel(type);
        setupAudio(type === "left" ? -1 : type === "right" ? 1 : 0, music.file);
    };

    useEffect(() => {
        return () => stop();
    }, []);

    return (
        <div className="min-h-screen bg-white p-8 text-black flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                    🔊 Kiểm tra Loa
                </h1>
                <button
                    onClick={onBack}
                    className="text-sm px-3 py-1.5 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 transition"
                >
                    ← Quay lại
                </button>
            </div>

            <div className="w-full max-w-4xl space-y-8">
                {/* chọn nhạc */}
                <div className="bg-gray-50 p-6 rounded-xl border border-blue-100">
                    <p className="mb-4 text-lg font-medium text-gray-700">🎵 Chọn nhạc test</p>
                    <div className="flex gap-3 flex-wrap">
                        {MUSIC_LIST.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setMusic(item);
                                    if (playing) play(channel);
                                }}
                                className={`px-4 py-2 border rounded-lg transition-all
                ${music.id === item.id
                                        ? "border-blue-500 bg-blue-100 text-blue-700 font-bold shadow-md"
                                        : "border-gray-300 bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* trạng thái */}
                <div className="text-center text-lg">
                    Trạng thái:{" "}
                    <span className="text-blue-600 font-bold">
                        {playing
                            ? channel === "both"
                                ? "Đang phát cả hai loa 🔊"
                                : channel === "left"
                                    ? "Đang phát loa trái 🔈"
                                    : "Đang phát loa phải 🔈"
                            : "Chưa phát 🔇"}
                    </span>
                </div>

                {/* điều khiển */}
                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={() => play("left")}
                        className="px-8 py-4 border-2 border-blue-500 rounded-xl text-blue-600 hover:bg-blue-50 font-bold text-lg transition-transform hover:scale-105 shadow-sm"
                    >
                        ⬅️ Loa Trái
                    </button>

                    <button
                        onClick={() => play("both")}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg transition-transform hover:scale-105 shadow-md"
                    >
                        🔊 Cả Hai Loa
                    </button>

                    <button
                        onClick={() => play("right")}
                        className="px-8 py-4 border-2 border-blue-500 rounded-xl text-blue-600 hover:bg-blue-50 font-bold text-lg transition-transform hover:scale-105 shadow-sm"
                    >
                        Loa Phải ➡️
                    </button>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={stop}
                        disabled={!playing}
                        className="px-8 py-2 border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-40 font-medium transition-colors"
                    >
                        ⏹️ Dừng phát
                    </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 space-y-2">
                    <p className="font-semibold">💡 Mẹo kiểm tra:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Dùng nhạc Stereo để kiểm tra khả năng tách âm trái/phải rõ ràng.</li>
                        <li>Nghe kỹ xem có tiếng rè (distortion) khi mở âm lượng lớn không.</li>
                        <li>Kiểm tra cả dải âm Bass (trầm) và Vocal (lời hát) để đánh giá chất lượng loa.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
