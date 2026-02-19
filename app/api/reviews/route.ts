import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { Customer } from "@/models/Customer";

// GET reviews (shop-wide or product-specific)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        await connectDB();

        const query: any = { status: "approved" };

        // If specific product requested
        if (productId) {
            query.productId = productId;
        }

        // Get approved reviews
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching reviews" }, { status: 500 });
    }
}

// POST a new review
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { productId, userName, userPhone, rating, comment, images } = body;

        // Check if phone exists in Customer to verify purchase (optional but cool)
        let isVerifiedPurchase = false;
        if (userPhone) {
            const customer = await Customer.findOne({ phone: userPhone });
            if (customer) {
                // Check if they bought this product
                // This logic can be complex, for now simple check if they are a customer
                isVerifiedPurchase = true;
                // To match exact product, we'd need to populate orders -> items
            }
        }

        // Create review object
        const reviewData: any = {
            userName,
            userPhone,
            rating,
            comment,
            images,
            isVerifiedPurchase,
            status: "pending"
        };

        // Only add productId if it exists and is valid
        if (productId) {
            reviewData.productId = productId;
        }

        const newReview = await Review.create(reviewData);

        return NextResponse.json({ success: true, data: newReview, message: "Review submitted for approval" });
    } catch (error: any) {
        console.error("Error submitting review:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error submitting review"
        }, { status: 500 });
    }
}
