import mongoose, { Schema, models } from "mongoose";

const SERVICE_TYPE_ENUM = [
  "repair",
  "cleaning",
  "upgrade",
  "warranty",
  "inspection",
];
const SERVICE_STATUS_ENUM = [
  "pending",
  "diagnosing",
  "in_progress",
  "waiting_parts",
  "completed",
  "cancelled",
];
const SERVICE_PRIORITY_ENUM = ["low", "normal", "high", "urgent"];

const ServiceSchema = new Schema(
  {
    serviceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      enum: SERVICE_TYPE_ENUM,
      required: true,
    },

    // ============== KHÁCH HÀNG ==============
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },

    // ============== SẢN PHẨM ==============
    productInfo: {
      brand: { type: String, default: "" },
      model: { type: String, default: "" },
      serialNumber: { type: String, default: "" },
      purchaseDate: { type: Date, default: null },
    },
    images: {
      type: [String],
      default: [],
    },

    // ============== KỸ THUẬT VIÊN ==============
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    // ============== TRẠNG THÁI ==============
    status: {
      type: String,
      enum: SERVICE_STATUS_ENUM,
      default: "pending",
    },
    priority: {
      type: String,
      enum: SERVICE_PRIORITY_ENUM,
      default: "normal",
    },

    // ============== MÔ TẢ VẤN ĐỀ ==============
    issueDescription: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      default: "",
    },

    // ============== CHI PHÍ ==============
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    quotedPrice: {
      type: Number,
      default: 0,
    },

    // ============== NGÀY ==============
    receivedDate: {
      type: Date,
      default: Date.now,
    },
    estimatedCompletionDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },

    // ============== GHI CHÚ ==============
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

ServiceSchema.index({ serviceNumber: 1 }, { unique: true });
ServiceSchema.index({ status: 1, createdAt: -1 });
ServiceSchema.index({ customerPhone: 1 });
ServiceSchema.index({ technicianId: 1 });

export const Service =
  models.Service || mongoose.model("Service", ServiceSchema);

export { SERVICE_TYPE_ENUM, SERVICE_STATUS_ENUM, SERVICE_PRIORITY_ENUM };
