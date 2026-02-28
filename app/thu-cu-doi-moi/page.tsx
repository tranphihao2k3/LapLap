"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Battery,
  HardDrive,
  Monitor,
  CheckCircle,
  Upload,
  ArrowRight,
  Smartphone,
  Mail,
  Send,
  Loader2,
  Cpu,
  MemoryStick,
  HardDriveIcon,
  Gpu,
  Phone,
  StickyNote,
  MessageSquare,
  Laptop,
  X,
  CircleCheckBig,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";

const conditionOptions = [
  {
    id: "99",
    label: "99%",
    title: "Loại 1",
    desc: "Đẹp keng, không trầy xước",
    color: "emerald",
    emoji: "✨",
  },
  {
    id: "98",
    label: "98%",
    title: "Loại 2",
    desc: "Màn đẹp, xước dăm nhẹ",
    color: "blue",
    emoji: "👍",
  },
  {
    id: "95",
    label: "95%",
    title: "Loại 3",
    desc: "Trầy xước rõ, cấn nhẹ",
    color: "amber",
    emoji: "⚡",
  },
  {
    id: "90",
    label: "90%",
    title: "Loại 4",
    desc: "Cấn móp, màn ám/đốm",
    color: "red",
    emoji: "🔧",
  },
];

export default function TradeInPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Thu cũ đổi mới laptop",
    provider: {
      "@type": "LocalBusiness",
      name: "LapLap Cần Thơ",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cần Thơ",
        addressCountry: "VN",
      },
    },
    areaServed: "Cần Thơ",
    description:
      "Dịch vụ thu cũ đổi mới laptop tại Cần Thơ. Định giá cao, trợ giá lên đời lên đến 2 triệu đồng.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Thủ tục thu cũ đổi mới tại LapLap như thế nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bạn chỉ cần mang máy đến cửa hàng hoặc điền thông tin vào form định giá. Kỹ thuật viên sẽ kiểm tra và báo giá trong 15 phút.",
        },
      },
      {
        "@type": "Question",
        name: "LapLap có thu mua máy bị hỏng không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Có, chúng tôi thu mua đa dạng các dòng laptop kể cả máy hư hỏng với mức giá hợp lý.",
        },
      },
      {
        "@type": "Question",
        name: "Mức trợ giá lên đời là bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LapLap hỗ trợ thêm mức trợ giá từ 500.000đ lên đến 2.000.000đ dành riêng cho khách hàng thu cũ đổi mới.",
        },
      },
    ],
  };

  const [formData, setFormData] = useState({
    model: "",
    cpu: "",
    ram: "",
    ssd: "",
    gpu: "",
    condition: "99",
    battery: "",
    notes: "",
    contact: "",
    name: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
    setImageFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1) Upload images first (if any)
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadResults = await Promise.all(
          imageFiles.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload", {
              method: "POST",
              body: fd,
            });

            const data = await res.json();
            if (!res.ok || !data?.success || !data?.data?.url) {
              throw new Error(data?.message || "Upload ảnh thất bại");
            }

            return data.data.url as string;
          }),
        );

        uploadedImageUrls = uploadResults;
      }

      // 2) Save order to database with uploaded image URLs
      const orderRes = await fetch("/api/buyback-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerName: formData.name,
          sellerPhone: formData.contact,
          productInfo: {
            model: formData.model,
            condition: `${formData.condition}%`,
            specs: {
              cpu: formData.cpu,
              ram: formData.ram,
              ssd: formData.ssd,
              gpu: formData.gpu,
            },
          },
          images: uploadedImageUrls,
          inspectionNotes: `Pin: ${formData.battery}. Ghi chú: ${formData.notes}`,
          status: "pending",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.success) {
        throw new Error(orderData?.error || "Không thể tạo yêu cầu thu cũ");
      }

      if (orderData.success) {
        setOrderCode(orderData.data.buybackNumber);
      }

      // 3) Send email notification (background)
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: uploadedImageUrls,
          type: "trade-in",
        }),
      }).catch(() => {});

      // 4) Create admin notification (background)
      fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          title: `Thu cũ: ${formData.model}`,
          message: `${formData.name || "Khách"} (${formData.contact}) gửi yêu cầu định giá ${formData.model} - ${formData.cpu}, ${formData.ram}, ${formData.ssd} - Tình trạng ${formData.condition}%`,
          priority: "high",
          referenceType: "BuybackOrder",
          referenceId: orderData.data?._id || null,
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      alert((error as Error)?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setOrderCode("");
    setFormData({
      model: "",
      cpu: "",
      ram: "",
      ssd: "",
      gpu: "",
      condition: "99",
      battery: "",
      notes: "",
      contact: "",
      name: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <Header />

      {/* Hero */}
      <section className="relative w-full bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container mx-auto max-w-5xl px-4 relative z-10 flex items-center justify-between">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-400/30 text-blue-100"
            >
              Chương Trình Đặc Biệt
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold mb-3 leading-tight"
            >
              Thu Cũ Đổi Mới <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Lên Đời Siêu Phẩm
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-lg text-blue-100 max-w-lg mx-auto md:mx-0"
            >
              Trợ giá lên đến{" "}
              <span className="font-bold text-yellow-300">2.000.000đ</span>.
              Định giá chỉ trong 15 phút.
            </motion.p>
          </div>

          <div className="hidden md:flex w-1/2 items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <div className="w-24 h-16 bg-gray-700 rounded-md transform rotate-[-10deg] border-2 border-gray-600 shadow-xl flex items-center justify-center">
                <span className="text-gray-400 text-xs font-mono">CŨ</span>
              </div>
              <div className="w-32 h-2 bg-gray-800 rounded-b-md transform rotate-[-10deg] -mt-1 ml-1 opacity-80" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mx-4 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-glow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400 animate-spin-slow"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <div className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-[5deg] shadow-2xl flex items-center justify-center border border-white/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 transform -skew-x-12 -translate-x-full" />
                <span className="text-white font-bold text-sm tracking-widest">
                  MỚI
                </span>
              </div>
              <div className="w-40 h-2 bg-gray-800 rounded-b-lg transform rotate-[5deg] -mt-1 -ml-2 opacity-90" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
              >
                +2 Triệu
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
        {/* Step 1: Hardware Check */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Kiểm Tra Phần Cứng
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Kiểm tra sơ bộ màn hình, loa, phím để định giá chính xác.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm">
                  <Monitor size={18} />
                  Test Màn hình, Loa, Phím
                </h3>
                <Button
                  href="/test"
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Test Ngay
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 text-green-600 rounded-md">
                  <Battery size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Check Pin</h4>
                  <a
                    href="/software/BatteryMon.exe"
                    download
                    className="text-xs text-green-600 font-semibold hover:underline flex items-center gap-1 mt-1"
                  >
                    Tải BatteryMon <Upload size={12} />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-md">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Check HDD/SSD
                  </h4>
                  <a
                    href="/software/hdsentinel_setup.zip"
                    download
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-1"
                  >
                    Tải HDSentinel <Upload size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Step 2 + 3: Form */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 md:p-12 text-center max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CircleCheckBig size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Gửi Thành Công!
                </h2>
                <p className="text-gray-500 mb-6">
                  Chúng tôi đã nhận thông tin máy của bạn và sẽ phản hồi trong
                  15 phút.
                </p>

                {orderCode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 inline-block">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                      Mã yêu cầu
                    </p>
                    <p className="text-xl font-bold text-blue-800 font-mono">
                      {orderCode}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left max-w-sm mx-auto">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    Thông tin đã gửi:
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Máy:</span>
                      <span className="font-medium text-gray-800">
                        {formData.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cấu hình:</span>
                      <span className="font-medium text-gray-800">
                        {formData.cpu} | {formData.ram} | {formData.ssd}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tình trạng:</span>
                      <span className="font-medium text-gray-800">
                        {formData.condition}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liên hệ:</span>
                      <span className="font-medium text-gray-800">
                        {formData.contact}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://zalo.me/0978648720`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    <Smartphone size={18} />
                    Chat Zalo nhận giá nhanh
                  </a>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Gửi máy khác
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Form State */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto"
              >
                {/* Form header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Laptop size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Gửi Yêu Cầu Định Giá
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Nhận báo giá ngay sau 15 phút
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Tên của bạn
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        SĐT / Zalo *
                      </label>
                      <input
                        required
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        onInvalid={(e) =>
                          (e.target as HTMLInputElement).setCustomValidity(
                            "Vui lòng nhập số điện thoại",
                          )
                        }
                        onInput={(e) =>
                          (e.target as HTMLInputElement).setCustomValidity("")
                        }
                        type="text"
                        placeholder="VD: 0978..."
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Tên máy *
                    </label>
                    <input
                      required
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      onInvalid={(e) =>
                        (e.target as HTMLInputElement).setCustomValidity(
                          "Vui lòng nhập tên máy",
                        )
                      }
                      onInput={(e) =>
                        (e.target as HTMLInputElement).setCustomValidity("")
                      }
                      type="text"
                      placeholder="VD: Dell XPS 15 9520, Macbook Pro M1..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Specs */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Cấu hình
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { name: "cpu", label: "CPU", placeholder: "i5-12500H" },
                        { name: "ram", label: "RAM", placeholder: "16GB" },
                        { name: "ssd", label: "SSD", placeholder: "512GB" },
                        { name: "gpu", label: "VGA", placeholder: "RTX 3050" },
                      ].map((field) => (
                        <div key={field.name} className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                            {field.label}
                          </span>
                          <input
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleChange}
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full pl-12 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Tình trạng ngoại hình
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {conditionOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, condition: opt.id })
                          }
                          className={`
                                                        relative p-3 rounded-xl border-2 text-left transition-all
                                                        ${
                                                          formData.condition ===
                                                          opt.id
                                                            ? `border-${opt.color}-500 bg-${opt.color}-50 ring-2 ring-${opt.color}-200`
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                        }
                                                    `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">{opt.emoji}</span>
                            {formData.condition === opt.id && (
                              <CheckCircle
                                size={16}
                                className={`text-${opt.color}-500`}
                              />
                            )}
                          </div>
                          <div
                            className={`text-sm font-bold ${formData.condition === opt.id ? `text-${opt.color}-700` : "text-gray-800"}`}
                          >
                            {opt.label}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {opt.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Battery + Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Tình trạng Pin / Màn
                      </label>
                      <input
                        name="battery"
                        value={formData.battery}
                        onChange={handleChange}
                        type="text"
                        placeholder="VD: Pin chai 5%, Màn đẹp..."
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Ghi chú thêm
                      </label>
                      <input
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        type="text"
                        placeholder="Thiếu sạc, bàn phím kẹt..."
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Hình ảnh sản phẩm */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Ảnh máy (tối đa 5 ảnh)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={submitting || imageFiles.length >= 5}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-blue-700 file:font-semibold"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Bạn có thể chọn nhiều ảnh để tụi mình định giá nhanh và
                      chính xác hơn.
                    </p>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                        {imagePreviews.map((src, idx) => (
                          <div
                            key={`${src}-${idx}`}
                            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                          >
                            <img
                              src={src}
                              alt={`Ảnh máy ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 hover:bg-black/75 text-white flex items-center justify-center"
                              aria-label={`Xóa ảnh ${idx + 1}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 text-base"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Đang
                          gửi...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Gửi Yêu Cầu Định Giá
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Thông tin sẽ được gửi đến admin và email LapLap
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
