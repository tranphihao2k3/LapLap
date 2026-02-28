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
        country: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        metaTitle: {
            type: String,
            default: "",
        },
        metaDescription: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

BrandSchema.index({ slug: 1 }, { unique: true });
BrandSchema.index({ isActive: 1 });

export const Brand =
    models.Brand || mongoose.model("Brand", BrandSchema);
