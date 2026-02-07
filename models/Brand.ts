import mongoose, { Schema, models } from "mongoose";

const BrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const Brand =
    models.Brand || mongoose.model("Brand", BrandSchema);
