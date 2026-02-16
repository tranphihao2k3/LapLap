import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Software } from "@/models/Software";

// GET all software (admin view)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        let query = {};
        if (status && (status === "draft" || status === "published")) {
            query = { status };
        }

        const software = await Software.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: software,
        });
    } catch (error) {
        console.error("Error fetching software:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch software" },
            { status: 500 }
        );
    }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// POST create new software
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            downloadUrl,
            version,
            developer,
            category,
            fileSize,
            platform,
            type,
            tags,
            status,
        } = body;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: "Title and content are required" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        const finalSlug = slug || generateSlug(title);

        // Check if slug already exists
        const existingSoftware = await Software.findOne({ slug: finalSlug });
        if (existingSoftware) {
            return NextResponse.json(
                { success: false, error: "Slug already exists" },
                { status: 400 }
            );
        }

        const newSoftware = await Software.create({
            title,
            slug: finalSlug,
            excerpt: excerpt || "",
            content,
            featuredImage: featuredImage || "",
            downloadUrl: downloadUrl || "",
            version: version || "",
            developer: developer || "",
            category: category || "Tiện ích",
            fileSize: fileSize || "",
            platform: platform || "Windows",
            type: type || "Free",
            tags: tags || [],
            status: status || "draft",
        });

        return NextResponse.json({
            success: true,
            data: newSoftware,
        });
    } catch (error) {
        console.error("Error creating software:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create software" },
            { status: 500 }
        );
    }
}
