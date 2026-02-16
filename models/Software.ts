   import mongoose, { Schema, models } from "mongoose";

const SoftwareSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        excerpt: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: true,
        },
        featuredImage: {
            type: String,
            default: "",
        },
        downloadUrl: {
            type: String,
            default: "",
        },
        version: {
            type: String,
            default: "",
        },
        developer: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "Tiện ích",
        },
        fileSize: {
            type: String,
            default: "",
        },
        platform: {
            type: String,
            default: "Windows",
        },
        type: {
            type: String,
            enum: ["Free", "Trial", "Crack", "License"],
            default: "Free",
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Create index for slug for faster queries
SoftwareSchema.index({ slug: 1 });
SoftwareSchema.index({ status: 1, createdAt: -1 });

export const Software = models.Software || mongoose.model("Software", SoftwareSchema);
