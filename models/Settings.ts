import mongoose, { Schema, models } from "mongoose";

const SettingsSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        
        // ============== PHÂN LOẠI ==============
        category: {
            type: String,
            default: "general",
        },
        
        // ============== TRẠNG THÁI ==============
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

SettingsSchema.index({ key: 1 }, { unique: true });
SettingsSchema.index({ category: 1 });

export const Settings = 
    models.Settings || mongoose.model("Settings", SettingsSchema);
