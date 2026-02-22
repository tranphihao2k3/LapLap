import mongoose, { Schema, models } from "mongoose";

const FacebookGroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const FacebookGroup = models.FacebookGroup || mongoose.model("FacebookGroup", FacebookGroupSchema);
