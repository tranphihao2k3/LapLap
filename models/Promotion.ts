import mongoose, { Schema, models } from "mongoose";

const PROMOTION_DISCOUNT_TYPE_ENUM = ["percentage", "fixed"];
const PROMOTION_STATUS_ENUM = ["draft", "active", "scheduled", "expired", "cancelled"];

const PromotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            default: "",
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        
        // ============== GIẢM GIÁ ==============
        discountType: {
            type: String,
            enum: PROMOTION_DISCOUNT_TYPE_ENUM,
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maxDiscountAmount: {
            type: Number,
            default: 0,
        },
        
        // ============== ÁP DỤNG ==============
        applicableProducts: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
            default: [],
        },
        applicableCategories: {
            type: [Schema.Types.ObjectId],
            ref: "Category",
            default: [],
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        
        // ============== THỜI GIAN ==============
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        
        // ============== GIỚI HẠN ==============
        maxUses: {
            type: Number,
            default: 0,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        
        // ============== TRẠNG THÁI ==============
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: PROMOTION_STATUS_ENUM,
            default: "draft",
        },
        
        // ============== GHI CHÚ ==============
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

PromotionSchema.index({ code: 1 }, { unique: true });
PromotionSchema.index({ status: 1, startDate: 1, endDate: 1 });
PromotionSchema.index({ isActive: 1 });

export const Promotion = 
    models.Promotion || mongoose.model("Promotion", PromotionSchema);

export { PROMOTION_DISCOUNT_TYPE_ENUM, PROMOTION_STATUS_ENUM };
