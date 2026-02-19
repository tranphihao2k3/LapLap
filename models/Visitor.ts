import mongoose, { Schema, models } from "mongoose";

const VisitorSchema = new Schema(
    {
        count: {
            type: Number,
            default: 0,
        },
        label: {
            type: String,
            default: "total_visitors",
            unique: true,
        }
    },
    { timestamps: true }
);

export const Visitor = models.Visitor || mongoose.model("Visitor", VisitorSchema);
