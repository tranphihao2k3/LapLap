import mongoose, { Schema, models } from "mongoose";

const SHIPPING_STATUS_ENUM = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned", "cancelled"];

const ShippingSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        shippingMethod: {
            type: String,
            default: "",
        },
        trackingNumber: {
            type: String,
            default: "",
        },
        
        // ============== NGƯỜI NHẬN ==============
        recipientName: {
            type: String,
            required: true,
        },
        recipientPhone: {
            type: String,
            required: true,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: SHIPPING_STATUS_ENUM,
            default: "pending",
        },
        
        // ============== NGÀY ==============
        shippedDate: {
            type: Date,
            default: null,
        },
        deliveredDate: {
            type: Date,
            default: null,
        },
        
        // ============== CHI PHÍ ==============
        shippingCost: {
            type: Number,
            default: 0,
        },
        
        // ============== GHI CHÚ ==============
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

ShippingSchema.index({ orderId: 1 }, { unique: true });
ShippingSchema.index({ trackingNumber: 1 });
ShippingSchema.index({ status: 1 });

export const Shipping = 
    models.Shipping || mongoose.model("Shipping", ShippingSchema);

export { SHIPPING_STATUS_ENUM };
