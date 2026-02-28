import mongoose, { Schema, models } from "mongoose";

const CouponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        maxDiscountAmount: {
            type: Number,
            default: 0,
        },
        validFrom: {
            type: Date,
            required: true,
        },
        validTo: {
            type: Date,
            required: true,
        },
        maxUses: {
            type: Number,
            default: 1,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ isActive: 1, validTo: 1 });

export const Coupon = 
    models.Coupon || mongoose.model("Coupon", CouponSchema);
