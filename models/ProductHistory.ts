import mongoose, { Schema, models } from "mongoose";

const PRODUCT_HISTORY_EVENT_ENUM = [
    "purchased",        // Nhập hàng / Thu mua
    "sold",             // Bán ra
    "transferred",      // Chuyển kho
    "repaired",         // Sửa chữa
    "warranty_claimed", // Bảo hành
    "returned",         // Trả lại
    "scrapped",         // Thanh lý
    "condition_changed" // Thay đổi tình trạng
];

const ProductHistorySchema = new Schema(
    {
        // ============== LIÊN KẾT ==============
        productUnitId: {
            type: Schema.Types.ObjectId,
            ref: "ProductUnit",
            required: true,
        },
        
        // ============== SỰ KIỆN ==============
        eventType: {
            type: String,
            enum: PRODUCT_HISTORY_EVENT_ENUM,
            required: true,
        },
        eventDate: {
            type: Date,
            default: Date.now,
        },
        
        // ============== MÔ TẢ ==============
        description: {
            type: String,
            required: true,
        },
        
        // ============== THAM CHIẾU ==============
        relatedType: {
            type: String,
            default: null, // Order, BuybackOrder, Service, etc.
        },
        relatedId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        
        // ============== NGƯỜI THỰC HIỆN ==============
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        
        // ============== DỮ LIỆU BỔ SUNG ==============
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

// Indexes
ProductHistorySchema.index({ productUnitId: 1, eventDate: -1 });
ProductHistorySchema.index({ eventType: 1 });
ProductHistorySchema.index({ relatedType: 1, relatedId: 1 });

export const ProductHistory = 
    models.ProductHistory || mongoose.model("ProductHistory", ProductHistorySchema);

export { PRODUCT_HISTORY_EVENT_ENUM };
