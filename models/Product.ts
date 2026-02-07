import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        brandId: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: String, // Main image for backward compatibility
        images: {
            type: [String],
            default: [],
        },
        specs: {
            cpu: String,
            gpu: String,
            ram: String,
            ssd: String,
            screen: String,
            battery: String,
        },
        warranty: {
            duration: String,
            items: [String],
        },
        gift: String, // Qua tang kem (text area)
        warrantyMonths: Number, // So thang bao hanh (1, 2, 3, 6, 12, 24...)
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const Product =
    models.Product || mongoose.model("Product", ProductSchema);
