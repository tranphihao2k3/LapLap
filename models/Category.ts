import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        icon: {
            type: String,
            default: "Laptop",
        },
        
        // ============== DANH MỤC CHA ==============
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },
        
        // ============== SẮP XẾP ==============
        sortOrder: {
            type: Number,
            default: 0
        },
        
        // ============== TRẠNG THÁI ==============
        isActive: {
            type: Boolean,
            default: true
        },
        
        // ============== HÌNH ẢNH ==============
        image: {
            type: String,
            default: ""
        },
        
        // ============== SEO ==============
        metaTitle: {
            type: String,
            default: ""
        },
        metaDescription: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

CategorySchema.index({ parentId: 1, sortOrder: 1 });
CategorySchema.index({ slug: 1 }, { unique: true });

export const Category =
    models.Category || mongoose.model("Category", CategorySchema);
