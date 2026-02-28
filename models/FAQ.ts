import mongoose, { Schema, models } from "mongoose";

const FAQSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        
        // ============== PHÂN LOẠI ==============
        category: {
            type: String,
            default: "general",
        },
        
        // ============== THỨ TỰ ==============
        order: {
            type: Number,
            default: 0,
        },
        
        // ============== TRẠNG THÁI ==============
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

FAQSchema.index({ category: 1, order: 1 });
FAQSchema.index({ isActive: 1 });

export const FAQ = 
    models.FAQ || mongoose.model("FAQ", FAQSchema);
