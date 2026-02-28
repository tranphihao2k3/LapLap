import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { License } from "@/models/License";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const licenses = await License.find()
            .populate("softwareId", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await License.countDocuments();

        return NextResponse.json({
            success: true,
            data: licenses,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const license = await License.create(body);

        await logAudit({
            collectionName: "licenses",
            documentId: license._id,
            action: "create",
            after: license.toObject(),
            description: `Tạo license mới: ${license.key}`,
            req: request as any
        });

        return NextResponse.json({ success: true, data: license }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
