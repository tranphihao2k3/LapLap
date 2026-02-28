import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const query: Record<string, any> = {};
        if (role) query.role = role;
        if (status) query.status = status;
        if (search) {
            query["$or"] = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, data: users });
    } catch (error: any) {
        console.error("❌ [GET /api/users]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password, name, role, status } = body;

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, error: "Email đã tồn tại" }, { status: 400 });
        }

        // Password hashing is handled by the pre-save hook in User model
        const user = new User({
            email,
            password,
            name,
            role: role || "admin",
            status: status || "active",
        });
        await user.save();

        const userObj = user.toObject() as Record<string, any>;
        delete userObj.password;

        console.log("✅ [POST /api/users] Created:", user.email);
        return NextResponse.json({ success: true, data: userObj }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/users]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
