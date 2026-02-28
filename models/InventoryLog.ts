import mongoose, { Schema, models } from "mongoose";

const INVENTORY_LOG_TYPE_ENUM = ["IN", "OUT", "ADJUST", "RETURN", "TRANSFER"];
const INVENTORY_LOG_REFERENCE_ENUM = [
    "order", "purchase", "return", "adjustment", 
    "transfer", "buyback", "service", "initial"
];

const InventoryLogSchema = new Schema(
    {
        // ============== LOẠI ==============
        type: {
            type: String,
            enum: INVENTORY_LOG_TYPE_ENUM,
            required: true,
        },
        
        // ============== SẢN PHẨM ==============
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        
        // ============== KHO ==============
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },
        
        // ============== SỐ LƯỢNG ==============
        quantity: {
            type: Number,
            required: true,
        },
        quantityBefore: {
            type: Number,
            default: 0,
        },
        quantityAfter: {
            type: Number,
            default: 0,
        },
        
        // ============== THAM CHIẾU ==============
        referenceType: {
            type: String,
            enum: INVENTORY_LOG_REFERENCE_ENUM,
            default: null,
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        
        // ============== GHI CHÚ ==============
        notes: {
            type: String,
            default: "",
        },
        
        // ============== NGƯỜI TẠO ==============
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

// Indexes
InventoryLogSchema.index({ productId: 1, warehouseId: 1, createdAt: -1 });
InventoryLogSchema.index({ type: 1, createdAt: -1 });
InventoryLogSchema.index({ referenceType: 1, referenceId: 1 });
InventoryLogSchema.index({ warehouseId: 1, createdAt: -1 });

export const InventoryLog = 
    models.InventoryLog || mongoose.model("InventoryLog", InventoryLogSchema);

export { INVENTORY_LOG_TYPE_ENUM, INVENTORY_LOG_REFERENCE_ENUM };
