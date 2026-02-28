import mongoose, { Schema, models } from "mongoose";

const ServiceItemSchema = new Schema(
    {
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        issue: {
            type: String,
            default: "",
        },
        solution: {
            type: String,
            default: "",
        },
        quantity: {
            type: Number,
            default: 1,
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        warrantyDays: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

ServiceItemSchema.index({ serviceId: 1 });

export const ServiceItem = 
    models.ServiceItem || mongoose.model("ServiceItem", ServiceItemSchema);
