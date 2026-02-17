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
            enum: ["Free", "Trial", "Crack", "License", "Repack", "Portable"],
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
// slug: 1 is already indexed by unique: true in the schema definition
SoftwareSchema.index({ status: 1, createdAt: -1 });

// Force model rebuild to ensure schema updates (like enums) are applied in dev mode
if (models.Software) {
    delete models.Software;
}

export const Software = models.Software || mongoose.model("Software", SoftwareSchema);
