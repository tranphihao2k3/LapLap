import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";

export async function GET() {
    try {
        await connectDB();
        const groups = await FacebookGroup.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: groups });
    } catch (error) {
        console.error('Error fetching Facebook groups:', error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch Facebook groups" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, url, order } = body;

        if (!name || !url) {
            return NextResponse.json(
                { success: false, error: "Name and URL are required" },
                { status: 400 }
            );
        }

        // Check if group already exists
        const existingGroup = await FacebookGroup.findOne({ url });
        if (existingGroup) {
            return NextResponse.json(
                { success: false, error: "Group with this URL already exists" },
                { status: 400 }
            );
        }

        // Get max order if not provided
        let groupOrder = order;
        if (groupOrder === undefined) {
            const maxOrderGroup = await FacebookGroup.findOne().sort({ order: -1 });
            groupOrder = maxOrderGroup ? maxOrderGroup.order + 1 : 0;
        }

        const newGroup = await FacebookGroup.create({
            name,
            url,
            order: groupOrder,
            isActive: true,
        });

        return NextResponse.json({ success: true, data: newGroup });
    } catch (error: any) {
        console.error('Error creating Facebook group:', error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create Facebook group" },
            { status: 500 }
        );
    }
}
