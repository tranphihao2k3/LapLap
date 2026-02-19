import mongoose, { Schema, models } from "mongoose";

const CustomerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        loyaltyPoints: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String], // e.g., "VIP", "Boom hang", "Moi"
            default: ["New"],
        },
    },
    { timestamps: true }
);

export const Customer = models.Customer || mongoose.model("Customer", CustomerSchema);
