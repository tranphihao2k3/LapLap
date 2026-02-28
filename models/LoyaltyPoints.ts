import mongoose, { Schema, models } from "mongoose";

const POINTS_TYPE_ENUM = ["earned", "redeemed", "expired", "adjusted"];

const LoyaltyPointsSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        pointsType: {
            type: String,
            enum: POINTS_TYPE_ENUM,
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        description: {
            type: String,
            required: true,
        },
        expiryDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

LoyaltyPointsSchema.index({ customerId: 1, createdAt: -1 });
LoyaltyPointsSchema.index({ orderId: 1 });
LoyaltyPointsSchema.index({ expiryDate: 1 });

export const LoyaltyPoints = 
    models.LoyaltyPoints || mongoose.model("LoyaltyPoints", LoyaltyPointsSchema);

export { POINTS_TYPE_ENUM };
