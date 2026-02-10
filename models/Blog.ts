import mongoose, { Schema, models } from "mongoose";

const BlogSchema = new Schema(
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
        author: {
            type: String,
            default: "LapLap Team",
        },
        tags: {
            type: [String],
            default: [],
        },
        metaTitle: {
            type: String,
            default: "",
        },
        metaDescription: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Create index for slug for faster queries
BlogSchema.index({ slug: 1 });

// Create index for status and publishedAt for listing queries
BlogSchema.index({ status: 1, publishedAt: -1 });

export const Blog = models.Blog || mongoose.model("Blog", BlogSchema);
