import mongoose, { Schema, models } from "mongoose";

const InventorySchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        reservedQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        availableQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        minStock: {
            type: Number,
            default: 0,
        },
        maxStock: {
            type: Number,
            default: 0,
        },
        reorderPoint: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

InventorySchema.index({ productId: 1, warehouseId: 1 }, { unique: true });
InventorySchema.index({ warehouseId: 1 });
InventorySchema.index({ availableQuantity: 1 });

InventorySchema.pre('save', function(this: any) {
    this.availableQuantity = this.quantity - this.reservedQuantity;
});

export const Inventory = 
    models.Inventory || mongoose.model("Inventory", InventorySchema);
