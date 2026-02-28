import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { License } from "@/models/License";

export async function POST(request: NextRequest) {
    return handleCheckLicense(request);
}

export async function GET(request: NextRequest) {
    return handleCheckLicense(request);
}

async function handleCheckLicense(request: NextRequest) {
    try {
        await connectDB();

        let hwid: string | null = null;
        let token: string | null = null;

        // Try getting from Search Params (GET or POST with query)
        const { searchParams } = new URL(request.url);
        hwid = searchParams.get("hwid");
        token = searchParams.get("token");

        // Try getting from JSON Body (POST)
        if (request.method === "POST" && (!hwid || !token)) {
            try {
                const body = await request.json();
                hwid = hwid || body.hwid;
                token = token || body.token;
            } catch (e) {
                // Not a JSON body or empty
            }
        }

        if (!hwid || !token) {
            return NextResponse.json(
                { success: false, message: "Missing hwid or token" },
                { status: 400 }
            );
        }

        // Find the license
        const license = await License.findOne({ key: token });

        if (!license) {
            return NextResponse.json(
                { success: false, message: "Invalid license key" },
                { status: 404 }
            );
        }

        // Check if blocked
        if (license.status === "blocked") {
            return NextResponse.json(
                { success: false, message: "License has been blocked" },
                { status: 403 }
            );
        }

        // Check expiry date
        const now = new Date();
        if (new Date(license.expiryDate) < now) {
            // Update status if not already set to expired
            if (license.status !== "expired") {
                license.status = "expired";
                await license.save();
            }
            return NextResponse.json(
                { success: false, message: "License has expired", expiryDate: license.expiryDate },
                { status: 403 }
            );
        }

        // HWID Binding & Verification
        if (!license.hwid) {
            // First time binding
            license.hwid = hwid;
            license.lastUsed = now;
            await license.save();
        } else if (license.hwid !== hwid) {
            // Wrong hardware
            return NextResponse.json(
                { success: false, message: "License is bound to another device" },
                { status: 403 }
            );
        }

        // Update last used
        license.lastUsed = now;
        await license.save();

        return NextResponse.json({
            success: true,
            message: "License verified successfully",
            data: {
                token: license.key,
                expiryDate: license.expiryDate,
                customerName: license.customerName,
                customerPhone: license.customerPhone,
                status: license.status,
                hwid: license.hwid
            }
        });
    } catch (error) {
        console.error("Error checking license:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
