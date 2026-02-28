import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { License } from "@/models/License";
import "@/models/Software";
import { logAudit } from "@/lib/audit";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const license = await License.findById(id).populate("softwareId", "title");

        if (!license) {
            return NextResponse.json({ success: false, error: "License not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: license });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const oldLicense = await License.findById(id);
        if (!oldLicense) {
            return NextResponse.json({ success: false, error: "License not found" }, { status: 404 });
        }

        const updatedLicense = await License.findByIdAndUpdate(id, body, { new: true });

        await logAudit({
            collectionName: "licenses",
            documentId: id,
            action: "update",
            before: oldLicense.toObject(),
            after: updatedLicense.toObject(),
            description: `Cập nhật license: ${updatedLicense.key}`,
            req: request as any
        });

        return NextResponse.json({ success: true, data: updatedLicense });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const license = await License.findById(id);
        if (!license) {
            return NextResponse.json({ success: false, error: "License not found" }, { status: 404 });
        }

        await License.findByIdAndDelete(id);

        await logAudit({
            collectionName: "licenses",
            documentId: id,
            action: "delete",
            before: license.toObject(),
            description: `Xóa license: ${license.key}`,
            req: request as any
        });

        return NextResponse.json({ success: true, message: "License deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
