import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";

// GET audit logs with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");
        const collection = searchParams.get("collection");
        const userId = searchParams.get("userId");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        
        const query: any = {};
        if (action) query.action = action;
        if (collection) query.collectionName = collection;
        if (userId) query.userId = userId;
        
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }
        
        const skip = (page - 1) * limit;
        
        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(query)
        ]);
        
        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
