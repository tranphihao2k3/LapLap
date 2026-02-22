import mongoose, { Schema, models } from "mongoose";
import "./Brand"; // Ensure Brand model is registered
import "./Category"; // Ensure Category model is registered

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
        slug: {
            type: String,
            unique: true,
            sparse: true,
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
            hz: String,
            resolution: String,
            battery: String,
            weight: String, // e.g. "1.3 kg"
        },
        warranty: {
            duration: String,
            items: [String],
        },
        gift: String, // Qua tang kem (text area)
        description: String, // Dòng mô tả sản phẩm
        warrantyMonths: Number, // So thang bao hanh (1, 2, 3, 6, 12, 24...)
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

export const Product = mongoose.model("Product", ProductSchema);
