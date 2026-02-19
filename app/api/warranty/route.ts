import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json(
            { success: false, message: "Vui lòng nhập số điện thoại hoặc mã đơn hàng" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        // Find orders by Order ID or Phone Number
        // Search logic: 
        // 1. Try to cast to ObjectId for _id search
        // 2. Search by customer.phone

        let conditions: any = {
            $or: [
                { "customer.phone": query },
            ]
        };

        // If query looks like an ObjectId, add it to conditions
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
            conditions.$or.push({ _id: query });
        }

        const orders = await Order.find(conditions)
            .populate({
                path: "items.product",
                model: Product,
                select: "warrantyMonths" // Get warranty duration from Product
            })
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Không tìm thấy đơn hàng nào"
            });
        }

        // Process orders to calculate warranty status
        const warrantyData = orders.map(order => {
            const deliveryDate = order.status === 'delivered' ? order.updatedAt : null;

            return {
                orderId: order._id,
                customer: order.customer,
                status: order.status,
                purchaseDate: order.createdAt,
                deliveryDate: deliveryDate,
                items: order.items.map((item: any) => {
                    const warrantyMonths = item.product?.warrantyMonths || 12; // Default 12 months if not specified
                    let expirationDate = null;
                    let remainingDays = 0;
                    let warrantyStatus = 'unknown';

                    if (deliveryDate) {
                        const start = new Date(deliveryDate);
                        const end = new Date(start);
                        end.setMonth(end.getMonth() + warrantyMonths);
                        expirationDate = end;

                        const now = new Date();
                        const diffTime = end.getTime() - now.getTime();
                        remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        warrantyStatus = remainingDays > 0 ? 'active' : 'expired';
                    } else {
                        warrantyStatus = 'pending_delivery';
                    }

                    return {
                        name: item.name,
                        image: item.image,
                        quantity: item.quantity,
                        warrantyMonths,
                        warrantyStatus,
                        expirationDate,
                        remainingDays
                    };
                })
            };
        });

        return NextResponse.json({ success: true, data: warrantyData });

    } catch (error) {
        console.error("Warranty API Error:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi hệ thống" },
            { status: 500 }
        );
    }
}
