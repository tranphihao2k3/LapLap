import mongoose, { Schema, models } from "mongoose";

const AUDIT_ACTION_ENUM = ["create", "update", "delete"];

const AuditLogSchema = new Schema(
    {
        collectionName: {
            type: String,
            required: true,
        },
        documentId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        
        // ============== HÀNH ĐỘNG ==============
        action: {
            type: String,
            enum: AUDIT_ACTION_ENUM,
            required: true,
        },
        
        // ============== THAY ĐỔI ==============
        changes: {
            before: {
                type: Schema.Types.Mixed,
                default: null,
            },
            after: {
                type: Schema.Types.Mixed,
                default: null,
            },
        },
        
        // ============== NGƯỜI THỰC HIỆN ==============
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        
        // ============== IP ==============
        ipAddress: {
            type: String,
            default: "",
        },
        
        // ============== MÔ TẢ ==============
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

AuditLogSchema.index({ collectionName: 1, documentId: 1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

export const AuditLog = 
    models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

export { AUDIT_ACTION_ENUM };
