import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Software } from "@/models/Software";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "100");

        let query: any = { status: "published" };

        if (category) {
            query.category = category;
        }

        const software = await Software.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("title slug excerpt featuredImage category version type views createdAt")
            .lean();

        return NextResponse.json({
            success: true,
            data: software,
        });
    } catch (error) {
        console.error("Error fetching public software:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch software" },
            { status: 500 }
        );
    }
}
