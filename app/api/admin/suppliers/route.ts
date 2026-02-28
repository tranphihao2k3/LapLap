import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Supplier } from "@/models/Supplier";

// Generate supplier code: SUPXXX
function generateSupplierCode(): string {
    const random = Math.floor(100 + Math.random() * 900);
    return `SUP${random}`;
}

// GET suppliers list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status) query.status = status;
        
        let suppliers = await Supplier.find(query)
            .sort({ createdAt: -1 });
        
        // Filter by search term
        if (search) {
            suppliers = suppliers.filter((s: any) => 
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.supplierCode?.toLowerCase().includes(search.toLowerCase()) ||
                s.phone?.includes(search) ||
                s.email?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return NextResponse.json({
            success: true,
            data: suppliers,
            count: suppliers.length
        });
    } catch (error: any) {
        console.error("Error fetching suppliers:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create supplier
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            name,
            email,
            phone,
            address,
            contactPerson,
            taxCode,
            bankAccount,
            bankName,
            paymentTerm,
            notes
        } = body;
        
        const supplierCode = generateSupplierCode();
        
        const newSupplier = await Supplier.create({
            supplierCode,
            name,
            email,
            phone,
            address,
            contactPerson,
            taxCode,
            bankAccount,
            bankName,
            paymentTerm: paymentTerm || 0,
            notes,
            status: 'active',
            totalDebt: 0,
            rating: 5
        });
        
        return NextResponse.json({
            success: true,
            message: "Thêm nhà cung cấp thành công",
            data: newSupplier
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating supplier:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
