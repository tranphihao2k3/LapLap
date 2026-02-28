import mongoose, { Schema, models } from "mongoose";

const WARRANTY_TYPE_ENUM = ["manufacturer", "store"];
const WARRANTY_STATUS_ENUM = ["active", "expired", "voided", "claimed"];

const WarrantyCardSchema = new Schema(
    {
        warrantyNumber: {
            type: String,
            required: true,
            unique: true,
        },
        
        // ============== LIÊN KẾT ==============
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        productUnitId: {
            type: Schema.Types.ObjectId,
            ref: "ProductUnit",
            default: null,
        },
        
        // ============== THÔNG TIN SERIAL ==============
        serialNumber: {
            type: String,
            default: "",
        },
        
        // ============== LOẠI BẢO HÀNH ==============
        warrantyType: {
            type: String,
            enum: WARRANTY_TYPE_ENUM,
            default: "store",
        },
        
        // ============== CHI TIẾT BẢO HÀNH ==============
        coverageDetails: {
            type: { String: Schema.Types.Mixed },
            default: {},
        },
        
        // ============== NGÀY THÁNG ==============
        purchaseDate: {
            type: Date,
            default: null,
        },
        warrantyStartDate: {
            type: Date,
            default: null,
        },
        warrantyEndDate: {
            type: Date,
            default: null,
        },
        
        // ============== THỜI HẠN ==============
        warrantyMonths: {
            type: Number,
            default: 12,
        },
        warrantyTerms: {
            type: String,
            default: "",
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: WARRANTY_STATUS_ENUM,
            default: "active",
        },
        
        // ============== THÔNG TIN THÊM ==============
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

WarrantyCardSchema.index({ warrantyNumber: 1 }, { unique: true });
WarrantyCardSchema.index({ serialNumber: 1 });
WarrantyCardSchema.index({ customerId: 1, status: 1 });
WarrantyCardSchema.index({ warrantyEndDate: 1 });

export const WarrantyCard = 
    models.WarrantyCard || mongoose.model("WarrantyCard", WarrantyCardSchema);

export { WARRANTY_TYPE_ENUM, WARRANTY_STATUS_ENUM };
