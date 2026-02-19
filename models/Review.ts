import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            // Optional: if review is specific to a product
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            // Optional: for logged-in users or verified buyers
        },
        userName: {
            type: String,
            required: true,
        },
        userPhone: {
            type: String, // To verify if they bought the product
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        reply: {
            content: String,
            repliedAt: Date,
        }
    },
    { timestamps: true }
);

// Force delete model to ensure schema updates are applied in dev mode
if (mongoose.models.Review) {
    delete mongoose.models.Review;
}

export const Review = mongoose.model("Review", ReviewSchema);
