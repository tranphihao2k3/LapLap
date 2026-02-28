import mongoose, { Schema, models } from "mongoose";

const WAREHOUSE_STATUS_ENUM = ["active", "inactive"];

const WarehouseSchema = new Schema(
    {
        warehouseCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: "",
        },
        managerId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
        capacity: {
            type: Number,
            default: 0,
        },
        currentStock: {
            type: Number,
            default: 0,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: WAREHOUSE_STATUS_ENUM,
            default: "active",
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

WarehouseSchema.index({ warehouseCode: 1 }, { unique: true });
WarehouseSchema.index({ isDefault: 1 });
WarehouseSchema.index({ status: 1 });

export const Warehouse = 
    models.Warehouse || mongoose.model("Warehouse", WarehouseSchema);

export { WAREHOUSE_STATUS_ENUM };
