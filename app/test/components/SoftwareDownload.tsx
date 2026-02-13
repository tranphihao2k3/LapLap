import Link from "next/link";
import { ArrowLeft, Download, HardDrive, Battery, Cpu } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface SoftwareDownloadProps {
    onBack: () => void;
}

export default function SoftwareDownload({ onBack }: SoftwareDownloadProps) {
    const softwares = [
        {
            id: 1,
            name: "BatteryMon",
            desc: "Phần mềm kiểm tra pin laptop, xem dung lượng thực tế, chai pin...",
            icon: <Battery className="w-12 h-12 text-green-500" />,
            filename: "BatteryMon.exe",
            size: "~1.2 MB",
        },
        {
            id: 2,
            name: "Hard Disk Sentinel",
            desc: "Phần mềm kiểm tra sức khỏe ổ cứng HDD/SSD, xem nhiệt độ, lỗi bad sector...",
            icon: <HardDrive className="w-12 h-12 text-blue-500" />,
            filename: "hdsentinel_setup.zip",
            size: "~3.5 MB",
        },
        {
            id: 3,
            name: "Heaven Benchmark",
            desc: "Phần mềm test hiệu năng đồ họa (GPU) chuyên sâu, đánh giá độ ổn định và FPS.",
            icon: <Cpu className="w-12 h-12 text-red-500" />,
            link: "https://taimienphi.vn/download-heaven-benchmark-91443",
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto my-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <h2 className="text-2xl font-bold text-gray-800 ml-4 flex-grow text-center pr-20">
                    Phần Mềm Test Laptop
                </h2>
            </div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {softwares.map((sw) => (
                    <motion.div
                        key={sw.id}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        className="border rounded-xl p-6 transition-shadow flex flex-col items-center text-center bg-gray-50/50"
                    >
                        <div className="mb-4 bg-white p-4 rounded-full shadow-sm">
                            {sw.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{sw.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex-grow">{sw.desc}</p>
                        {sw.size && <div className="text-xs text-gray-400 mb-4">Dung lượng: {sw.size}</div>}

                        <a
                            href={sw.link || `/software/${sw.filename}`}
                            target={sw.link ? "_blank" : undefined}
                            rel={sw.link ? "noopener noreferrer" : undefined}
                            download={!sw.link}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
                        >
                            <Download className="w-4 h-4" />
                            {sw.link ? "Tới Trang Tải" : "Tải Ngay"}
                        </a>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="mt-8 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <strong>Lưu ý:</strong> Các phần mềm trên được cung cấp miễn phí để hỗ trợ kiểm tra nhanh. Vui lòng quét virus lại nếu trình duyệt cảnh báo (đôi khi nhận diện nhầm file .exe).
            </motion.div>
        </motion.div>
    );
}
