import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";

// GET all visitors with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const label = searchParams.get("label");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (label) query.label = label;
        if (search) {
            query["$or"] = [
                { label: { $regex: search, $options: "i" } },
                { ipAddress: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Visitor.countDocuments(query);
        const visitors = await Visitor.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: visitors,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching visitors:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new visitor
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.label) {
            return NextResponse.json({ success: false, error: "Label is required" }, { status: 400 });
        }

        // Upsert: update count if exists, create if not
        const visitor = await Visitor.findOneAndUpdate(
            { label: body.label },
            { 
                $inc: { count: 1 },
                $setOnInsert: { ipAddress: body.ipAddress || "", userAgent: body.userAgent || "" }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: visitor }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating visitor:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
