import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Software } from "@/models/Software";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        // Find by slug and must be published
        const software = await Software.findOne({
            slug: params.slug,
            status: "published"
        });

        if (!software) {
            return NextResponse.json(
                { success: false, error: "Software not found" },
                { status: 404 }
            );
        }

        // Increment view count asynchronously
        Software.updateOne(
            { _id: software._id },
            { $inc: { views: 1 } }
        ).exec();

        return NextResponse.json({
            success: true,
            data: software,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch software" },
            { status: 500 }
        );
    }
}
