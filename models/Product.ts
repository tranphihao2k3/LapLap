import mongoose, { Schema, models } from "mongoose";
import "./Brand"; // Ensure Brand model is registered
import "./Category"; // Ensure Category model is registered

// Enum definitions
const CONDITION_ENUM = ["new", "like_new", "good", "fair", "poor"];
const USED_GRADE_ENUM = ["A", "B", "C"];
const PRODUCT_STATUS_ENUM = ["active", "inactive"];

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
        costPrice: {
            type: Number,
            default: 0, // Giá vốn - quan trọng để tính lợi nhuận
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
        warrantyMonths: {
            type: Number,
            default: 12, // Số tháng bảo hành mặc định
        },
        gift: String, // Qua tang kem (text area)
        description: String, // Dòng mô tả sản phẩm
        
        // ============== LAPTOP MỚI / CŨ ==============
        isUsed: {
            type: Boolean,
            default: false, // false = laptop mới, true = laptop cũ
        },
        condition: {
            type: String,
            enum: CONDITION_ENUM,
            default: "new",
        },
        usedGrade: {
            type: String,
            enum: USED_GRADE_ENUM,
            default: undefined, // Chỉ áp dụng cho máy cũ (A, B, C)
        },
        conditionNote: {
            type: String,
            default: "", // Mô tả tình trạng chi tiết (vd: "Màn hình không có vết xước, pin 95%")
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: PRODUCT_STATUS_ENUM,
            default: "active",
        },
        
        // ============== THỐNG KÊ ==============
        averageRating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        
        // ============== SẢN PHẨM NỔI BẬT ==============
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Indexes cho tìm kiếm và lọc
ProductSchema.index({ categoryId: 1, brandId: 1, isUsed: 1 });
ProductSchema.index({ isUsed: 1, condition: 1 });
ProductSchema.index({ isFeatured: 1, status: 1 });
ProductSchema.index({ slug: 1 });

if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

export const Product = mongoose.model("Product", ProductSchema);

// Export enums for use in other files
export { CONDITION_ENUM, USED_GRADE_ENUM, PRODUCT_STATUS_ENUM };
