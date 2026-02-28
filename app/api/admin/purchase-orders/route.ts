import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { Supplier } from "@/models/Supplier";
import { Inventory } from "@/models/Inventory";
import { InventoryLog } from "@/models/InventoryLog";
import { logAudit } from "@/lib/audit";

// Generate PO number
function generatePONumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PO${year}${month}${random}`;
}

// GET - List purchase orders
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const supplierId = searchParams.get("supplierId");
        
        const query: any = {};
        if (status) query.status = status;
        if (supplierId) query.supplierId = supplierId;
        
        const orders = await PurchaseOrder.find(query)
            .populate('supplierId', 'name')
            .populate('warehouseId', 'name')
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create purchase order
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { supplierId, warehouseId, items, notes } = body;
        
        // Get supplier info
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy nhà cung cấp" },
                { status: 404 }
            );
        }
        
        // Generate order number
        const orderNumber = generatePONumber();
        
        // Create purchase order
        const purchaseOrder = await PurchaseOrder.create({
            orderNumber,
            supplierId,
            supplierName: supplier.name,
            warehouseId,
            items: items || [],
            notes: notes || "",
            status: "draft",
        });
        
        // Log audit
        await logAudit({
            collectionName: "purchaseorders",
            documentId: purchaseOrder._id.toString(),
            action: "create",
            description: `Tạo đơn nhập hàng ${orderNumber}`,
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo đơn nhập hàng thành công",
            data: purchaseOrder
        }, { status: 201 });
        
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
