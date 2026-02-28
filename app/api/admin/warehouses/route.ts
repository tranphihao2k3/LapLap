import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Warehouse } from "@/models/Warehouse";

// GET all warehouses
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        
        const query: any = {};
        if (status) query.status = status;
        
        const warehouses = await Warehouse.find(query)
            .populate('managerId', 'name')
            .sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: warehouses
        });
    } catch (error: any) {
        console.error("Error fetching warehouses:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create warehouse
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { warehouseCode, name, address, managerId, capacity, isDefault, notes } = body;
        
        // Check if warehouse code already exists
        const existing = await Warehouse.findOne({ warehouseCode });
        if (existing) {
            return NextResponse.json(
                { success: false, error: "Mã kho đã tồn tại" },
                { status: 400 }
            );
        }
        
        // If setting as default, unset other defaults
        if (isDefault) {
            await Warehouse.updateMany({}, { isDefault: false });
        }
        
        const warehouse = await Warehouse.create({
            warehouseCode,
            name,
            address,
            managerId,
            capacity,
            isDefault: isDefault || false,
            notes,
            status: 'active'
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo kho thành công",
            data: warehouse
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating warehouse:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
