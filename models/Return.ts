import mongoose, { Schema, models } from "mongoose";

const RETURN_TYPE_ENUM = ["refund", "exchange", "store_credit"];
const RETURN_STATUS_ENUM = ["pending", "approved", "rejected", "processed", "cancelled"];

const ReturnSchema = new Schema(
    {
        returnNumber: {
            type: String,
            required: true,
            unique: true,
        },
        
        // ============== THAM CHIẾU ==============
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        
        // ============== LOẠI HOÀN TRẢ ==============
        returnType: {
            type: String,
            enum: RETURN_TYPE_ENUM,
            required: true,
        },
        
        // ============== LÝ DO ==============
        reason: {
            type: String,
            required: true,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: RETURN_STATUS_ENUM,
            default: "pending",
        },
        
        // ============== TIỀN ==============
        refundAmount: {
            type: Number,
            default: 0,
        },
        refundMethod: {
            type: String,
            default: "",
        },
        
        // ============== XỬ LÝ ==============
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        processedAt: {
            type: Date,
            default: null,
        },
        
        // ============== GHI CHÚ ==============
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

ReturnSchema.index({ returnNumber: 1 }, { unique: true });
ReturnSchema.index({ orderId: 1 });
ReturnSchema.index({ customerId: 1 });
ReturnSchema.index({ status: 1 });

export const Return = 
    models.Return || mongoose.model("Return", ReturnSchema);

export { RETURN_TYPE_ENUM, RETURN_STATUS_ENUM };
