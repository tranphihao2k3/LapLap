import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";

// GET notifications with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const priority = searchParams.get("priority");
        const isRead = searchParams.get("isRead");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        
        const query: any = {};
        if (type) query.type = type;
        if (priority) query.priority = priority;
        if (isRead !== null && isRead !== '') query.isRead = isRead === 'true';
        
        const skip = (page - 1) * limit;
        
        const [notifications, total] = await Promise.all([
            Notification.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments(query)
        ]);
        
        return NextResponse.json({
            success: true,
            data: notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create notification
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { userId, type, title, message, referenceType, referenceId, priority } = body;
        
        if (!type || !title || !message) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin bắt buộc" },
                { status: 400 }
            );
        }
        
        const notification = await Notification.create({
            userId: userId || null,
            type,
            title,
            message,
            referenceType: referenceType || null,
            referenceId: referenceId || null,
            priority: priority || 'normal',
            isRead: false
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo thông báo thành công",
            data: notification
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating notification:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
