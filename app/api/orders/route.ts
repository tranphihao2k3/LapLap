import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { Product } from "@/models/Product";
import nodemailer from "nodemailer";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const customerId = searchParams.get("customerId");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        
        const query: any = {};
        if (status) query.status = status;
        if (customerId) query.customerId = customerId;
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }
        
        const orders = await Order.find(query)
            .populate('customerId', 'name phone email')
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error: any) {
        console.error("Get Orders Error:", error);
        return NextResponse.json({
            success: false,
            error: "Lỗi khi lấy danh sách đơn hàng: " + error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { customer, items, totalAmount, paymentMethod, note } = body;

        // 1. Find or Create Customer
        let customerDoc = await Customer.findOne({ phone: customer.phone });

        if (!customerDoc) {
            // New Customer
            customerDoc = await Customer.create({
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                totalSpent: 0,
                orders: []
            });
        } else {
            // Update existing customer info (optional: keep latest address/email)
            customerDoc.name = customer.name;
            customerDoc.email = customer.email || customerDoc.email;
            customerDoc.address = customer.address || customerDoc.address;
            await customerDoc.save();
        }

        // 2. Create new order with customerId
        const newOrder = await Order.create({
            customer,
            customerId: customerDoc._id, // Link to Customer model
            items,
            totalAmount,
            paymentMethod,
            note,
        });

        // 3. Update Customer's stats
        await Customer.findByIdAndUpdate(customerDoc._id, {
            $push: { orders: newOrder._id },
            $inc: { totalSpent: totalAmount },
            $set: { tags: ["Returning"] } // Mark as returning customer
        });

        // Send email notification to Admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: "laplapcantho@gmail.com", // Admin email
            subject: `🔔 ĐƠN HÀNG MỚI #${newOrder._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <h2>Đơn hàng mới từ ${customer.name}</h2>
                <p><strong>Mã đơn hàng:</strong> ${newOrder._id}</p>
                <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</p>
                <p><strong>Khách hàng:</strong> ${customer.name} - ${customer.phone}</p>
                <p><strong>Địa chỉ:</strong> ${customer.address}</p>
                <h3>Chi tiết đơn hàng:</h3>
                <ul>
                    ${items.map((item: any) => `<li>${item.name} x ${item.quantity} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</li>`).join('')}
                </ul>
                <p><strong>Ghi chú:</strong> ${note || "Không có"}</p>
            `,
        };

        // Send email notification to Customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.email || "laplapcantho@gmail.com", // Fallback if no email
            subject: `✅ XÁC NHẬN ĐƠN HÀNG #${newOrder._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #004e9a;">Cảm ơn bạn đã đặt hàng tại LapLap Cần Thơ!</h2>
                    <p>Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Thông tin đơn hàng #${newOrder._id.toString().slice(-6).toUpperCase()}</h3>
                        <p><strong>Tổng thanh toán:</strong> <span style="color: #d32f2f; font-weight: bold; font-size: 18px;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span></p>
                        <p><strong>Phương thức thanh toán:</strong> ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</p>
                    </div>

                    <h3>Chi tiết sản phẩm:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${items.map((item: any) => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 0;">
                                    <strong>${item.name}</strong><br>
                                    <span style="color: #666; font-size: 14px;">Số lượng: ${item.quantity}</span>
                                </td>
                                <td style="text-align: right; padding: 10px 0;">
                                    ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </td>
                            </tr>
                        `).join('')}
                    </table>

                    <p style="margin-top: 20px;">Chúng tôi sẽ sớm liên hệ lại với bạn để xác nhận đơn hàng này.</p>
                    <p>Mọi thắc mắc xin vui lòng liên hệ hotline: <strong>038.562.0679</strong></p>
                </div>
            `,
        };

        // Send emails concurrently
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            customer.email ? transporter.sendMail(customerMailOptions) : Promise.resolve()
        ]);

        return NextResponse.json({
            success: true,
            message: "Đặt hàng thành công",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("Order Error:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi khi xử lý đơn hàng" },
            { status: 500 }
        );
    }
}
