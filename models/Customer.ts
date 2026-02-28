import mongoose, { Schema, models } from "mongoose";

const CUSTOMER_TYPE_ENUM = ["regular", "vip"];
const CUSTOMER_GENDER_ENUM = ["male", "female"];

const CustomerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        
        // ============== THÔNG TIN BỔ SUNG ==============
        birthday: {
            type: Date,
            default: null
        },
        gender: {
            type: String,
            enum: CUSTOMER_GENDER_ENUM,
            default: null
        },
        
        // ============== LỊCH SỬ MUA HÀNG ==============
        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        loyaltyPoints: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
        totalOrders: {
            type: Number,
            default: 0,
        },
        
        // ============== PHÂN LOẠI ==============
        customerType: {
            type: String,
            enum: CUSTOMER_TYPE_ENUM,
            default: "regular",
        },
        tags: {
            type: [String],
            default: ["New"],
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },
        
        // ============== THÔNG TIN KHÁC ==============
        notes: {
            type: String,
            default: ""
        },
        source: {
            type: String,
            default: "website" // website, facebook, referral, walk-in
        }
    },
    { timestamps: true }
);

CustomerSchema.index({ phone: 1 }, { unique: true });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ customerType: 1 });
CustomerSchema.index({ totalSpent: -1 });

export const Customer = models.Customer || mongoose.model("Customer", CustomerSchema);

export { CUSTOMER_TYPE_ENUM, CUSTOMER_GENDER_ENUM };
