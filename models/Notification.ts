import mongoose, { Schema, models } from "mongoose";

const NOTIFICATION_TYPE_ENUM = ["order", "payment", "warranty", "inventory", "system", "promotion"];
const NOTIFICATION_PRIORITY_ENUM = ["low", "normal", "high", "urgent"];

const NotificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        
        // ============== LOẠI ==============
        type: {
            type: String,
            enum: NOTIFICATION_TYPE_ENUM,
            required: true,
        },
        
        // ============== TIÊU ĐỀ ==============
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        
        // ============== LIÊN KẾT ==============
        referenceType: {
            type: String,
            default: null,
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        
        // ============== QUAN TRỌNG ==============
        priority: {
            type: String,
            enum: NOTIFICATION_PRIORITY_ENUM,
            default: "normal",
        },
        
        // ============== TRẠNG THÁI ==============
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

export const Notification = 
    models.Notification || mongoose.model("Notification", NotificationSchema);

export { NOTIFICATION_TYPE_ENUM, NOTIFICATION_PRIORITY_ENUM };
