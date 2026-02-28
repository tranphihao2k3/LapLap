import mongoose, { Schema, models } from "mongoose";

const ReturnItemSchema = new Schema(
    {
        returnId: {
            type: Schema.Types.ObjectId,
            ref: "Return",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productUnitId: {
            type: Schema.Types.ObjectId,
            ref: "ProductUnit",
            default: null,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        reason: {
            type: String,
            default: "",
        },
        condition: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

ReturnItemSchema.index({ returnId: 1 });

export const ReturnItem = 
    models.ReturnItem || mongoose.model("ReturnItem", ReturnItemSchema);
