import mongoose, { Schema, models } from "mongoose";

const BUYBACK_STATUS_ENUM = [
  "pending",
  "inspecting",
  "approved",
  "rejected",
  "cancelled",
];
const BUYBACK_PAYMENT_METHOD_ENUM = ["cash", "bank", "qr"];

const BuybackOrderSchema = new Schema(
  {
    buybackNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerPhone: {
      type: String,
      required: true,
    },
    sellerIdNumber: {
      type: String,
      default: "",
    },
    sellerAddress: {
      type: String,
      default: "",
    },
    productInfo: {
      brand: { type: String, default: "" },
      model: { type: String, default: "" },
      serialNumber: { type: String, default: "" },
      condition: { type: String, default: "" },
      specs: { type: Schema.Types.Mixed, default: {} },
    },
    images: {
      type: [String],
      default: [],
    },
    buyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    quotedPrice: {
      type: Number,
      default: 0,
    },
    inspectionNotes: {
      type: String,
      default: "",
    },
    inspectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    inspectedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: BUYBACK_STATUS_ENUM,
      default: "pending",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: BUYBACK_PAYMENT_METHOD_ENUM,
      default: "cash",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },

    // ============== VOUCHER (Tự động tạo khi duyệt) ==============
    voucherId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
  },
  { timestamps: true },
);

BuybackOrderSchema.index({ buybackNumber: 1 }, { unique: true });
BuybackOrderSchema.index({ status: 1, createdAt: -1 });
BuybackOrderSchema.index({ sellerPhone: 1 });
BuybackOrderSchema.index({ voucherId: 1 });

export const BuybackOrder =
  models.BuybackOrder || mongoose.model("BuybackOrder", BuybackOrderSchema);

export { BUYBACK_STATUS_ENUM, BUYBACK_PAYMENT_METHOD_ENUM };
