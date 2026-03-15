"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Settings,
  Search,
  CheckCircle,
  Zap,
  Send,
  Loader2,
  Smartphone,
  Camera,
  X,
} from "lucide-react";
import RepairProcess from "./components/RepairProcess";
import CommonErrors from "./components/CommonErrors";
import ServiceCommitment from "./components/ServiceCommitment";
import { apiClient } from "@/lib/api";

export default function RepairClient() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    productBrand: "",
    productModel: "",
    issueDescription: "",
    serviceType: "repair",
    priority: "normal",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceNumber, setServiceNumber] = useState("");

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
      // 1) Upload ảnh nếu có
      let uploadedImageUrls: string[] = [];
      const BASE_URL = (process.env.NEXT_PUBLIC_NEXGEAR_API_URL || 'https://nexgzone.top/api').replace(/\/+$/, '');

      if (imageFiles.length > 0) {
        const uploadResults = await Promise.all(
          imageFiles.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch(`${BASE_URL}/upload`, {
              method: "POST",
              body: fd,
            });
            const data = await res.json();
            if (!res.ok || !data?.success)
              throw new Error("Upload ảnh thất bại");
            return data.data.url as string;
          }),
        );
        uploadedImageUrls = uploadResults;
      }

      // 2) Tạo đơn sửa chữa
      const genServiceNum = "SV-" + Date.now();
      const serviceData = await apiClient.post("/services", {
        serviceNumber: genServiceNum,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        productInfo: {
          brand: formData.productBrand,
          model: formData.productModel,
        },
        images: uploadedImageUrls,
        serviceType: formData.serviceType,
        priority: formData.priority,
        issueDescription: formData.issueDescription,
        status: "pending",
        estimatedCost: 0,
        actualCost: 0,
      });

      if (!serviceData?.success) {
        throw new Error(serviceData?.error || "Không thể tạo yêu cầu sửa chữa");
      }

      setServiceNumber((serviceData.data as any)?.serviceNumber || genServiceNum);
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
    setServiceNumber("");
    setFormData({
      customerName: "",
      customerPhone: "",
      productBrand: "",
      productModel: "",
      issueDescription: "",
      serviceType: "repair",
      priority: "normal",
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <main className="min-h-screen bg-white text-slate-800 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-blue-400/30 py-12 md:py-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
          <div className="w-full md:w-3/5 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/50 text-blue-200"
            >
              🛠️ Khắc phục mọi sự cố
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black mb-4 leading-tight"
            >
              Sửa Chữa Laptop <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                Uy Tín & Chuyên Nghiệp
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
            >
              Chẩn đoán chính xác - Sửa chữa tận tâm. <br />
              Đội ngũ kỹ thuật viên giàu kinh nghiệm tại Cần Thơ.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Search className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">Kiểm tra miễn phí</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-bold">Bảo hành uy tín</span>
              </div>
            </motion.div>
          </div>
          <div className="hidden md:flex w-2/5 items-center justify-center relative">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <Settings className="w-48 h-48 text-indigo-500/30" />
              </motion.div>
              <div className="absolute bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-100 z-20">
                <Wrench className="w-16 h-16 text-blue-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        <CommonErrors />

        {/* Form đăng ký sửa chữa */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto"
        >
          {submitted ? (
            /* Success State */
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Gửi Thành Công!
              </h2>
              <p className="text-gray-500 mb-6">
                Chúng tôi đã nhận yêu cầu sửa chữa của bạn và sẽ liên hệ sớm
                nhất.
              </p>

              {serviceNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 inline-block">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                    Mã dịch vụ
                  </p>
                  <p className="text-xl font-bold text-blue-800 font-mono">
                    {serviceNumber}
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
                      {formData.productBrand} {formData.productModel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lỗi:</span>
                    <span className="font-medium text-gray-800">
                      {formData.issueDescription.substring(0, 30)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liên hệ:</span>
                    <span className="font-medium text-gray-800">
                      {formData.customerPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://zalo.me/0978648720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <Smartphone size={18} />
                  Chat Zalo
                </a>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Đăng Ký Sửa Chữa</h2>
                    <p className="text-blue-100 text-sm">
                      Nhận tư vấn miễn phí ngay
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Thông tin khách hàng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Tên của bạn
                    </label>
                    <input
                      name="customerName"
                      value={formData.customerName}
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
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      type="text"
                      placeholder="VD: 0978..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Thông tin máy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Hãng máy
                    </label>
                    <input
                      name="productBrand"
                      value={formData.productBrand}
                      onChange={handleChange}
                      type="text"
                      placeholder="VD: Dell, HP, Asus..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Model máy
                    </label>
                    <input
                      name="productModel"
                      value={formData.productModel}
                      onChange={handleChange}
                      type="text"
                      placeholder="VD: XPS 15, Nitro 5..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Loại dịch vụ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Loại dịch vụ
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="repair">Sửa chữa</option>
                      <option value="cleaning">Vệ sinh</option>
                      <option value="upgrade">Nâng cấp</option>
                      <option value="inspection">Kiểm tra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Mức độ khẩn
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="low">Thấp</option>
                      <option value="normal">Bình thường</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                  </div>
                </div>

                {/* Mô tả lỗi */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Mô tả lỗi / Yêu cầu *
                  </label>
                  <textarea
                    required
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="VD: Máy không lên nguồn, màn hình bị vỡ, bàn phím kẹt phím..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Hình ảnh */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ảnh máy / lỗi (tối đa 5 ảnh)
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
                    Chụp ảnh máy và lỗi để được tư vấn chính xác hơn
                  </p>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                      {imagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                        >
                          <img
                            src={src}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 hover:bg-black/75 text-white flex items-center justify-center"
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
                        <Send size={18} /> Gửi Yêu Cầu Sửa Chữa
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Chúng tôi sẽ liên hệ bạn trong vòng 15 phút
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.section>

        <RepairProcess />
        <ServiceCommitment />
      </div>
    </main>
  );
}
