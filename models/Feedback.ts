import mongoose, { Schema, models } from "mongoose";

const FEEDBACK_TYPE_ENUM = ["contact", "feedback", "complaint", "suggestion"];
const FEEDBACK_STATUS_ENUM = ["new", "pending", "replied", "resolved", "closed"];

const FeedbackSchema = new Schema(
    {
        // ============== THÔNG TIN KHÁCH HÀNG ==============
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            default: "",
        },
        customerPhone: {
            type: String,
            default: "",
        },
        
        // ============== LOẠI ==============
        type: {
            type: String,
            enum: FEEDBACK_TYPE_ENUM,
            default: "feedback",
        },
        
        // ============== NỘI DUNG ==============
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: FEEDBACK_STATUS_ENUM,
            default: "new",
        },
        
        // ============== PHẢN HỒI ==============
        reply: {
            type: String,
            default: "",
        },
        repliedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        repliedAt: {
            type: Date,
            default: null,
        },
        
        // ============== LIÊN KẾT ==============
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            default: null,
        },
    },
    { timestamps: true }
);

FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ type: 1 });
FeedbackSchema.index({ customerPhone: 1 });

export const Feedback = 
    models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export { FEEDBACK_TYPE_ENUM, FEEDBACK_STATUS_ENUM };
