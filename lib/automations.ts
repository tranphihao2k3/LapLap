import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Inventory } from "@/models/Inventory";
import { WarrantyCard } from "@/models/WarrantyCard";
import { LoyaltyPoints } from "@/models/LoyaltyPoints";
import { Notification } from "@/models/Notification";
import { ProductUnit } from "@/models/ProductUnit";
import { Customer } from "@/models/Customer";

/**
 * Tự động chạy khi Order được giao thành công (delivered)
 * 1. Trừ kho (Inventory)
 * 2. Tạo WarrantyCard
 * 3. Cộng điểm Loyalty
 * 4. Gửi Notification
 */
export async function onOrderDelivered(orderId: string) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  console.log(`🚀 [AUTOMATION] Processing order delivered: ${order.orderNumber}`);

  const results: any = {
    inventoryUpdated: false,
    warrantyCardsCreated: false,
    loyaltyPointsAdded: false,
    notificationsSent: false,
  };

  // ========================================
  // 1. TRỪ KHO - Update Inventory
  // ========================================
  try {
    for (const item of order.items) {
      // Tìm inventory của sản phẩm
      const inventory = await Inventory.findOne({ productId: item.product });

      if (inventory) {
        await Inventory.findByIdAndUpdate(inventory._id, {
          $inc: {
            quantity: -item.quantity,
            availableQuantity: -item.quantity,
          },
        });

        console.log(`   ✅ [INVENTORY] Decremented ${item.quantity} for product ${item.product}`);
      } else {
        console.log(`   ⚠️ [INVENTORY] No inventory found for product ${item.product}`);
      }

      // Cập nhật ProductUnit status thành sold
      if (item.productUnit) {
        await ProductUnit.findByIdAndUpdate(item.productUnit, {
          status: "sold",
        });
        console.log(`   ✅ [PRODUCT UNIT] Marked as sold: ${item.productUnit}`);
      }
    }
    results.inventoryUpdated = true;
  } catch (error: any) {
    console.error(`   ❌ [INVENTORY] Error:`, error.message);
  }

  // ========================================
  // 2. TẠO WARRANTY CARD - Tự động tạo bảo hành
  // ========================================
  try {
    // Lấy thông tin warranty từ sản phẩm đầu tiên
    const firstItem = order.items[0];
    if (firstItem && firstItem.product) {
      // Import Product để lấy warrantyMonths
      const { Product } = await import("@/models/Product");
      const product = await Product.findById(firstItem.product);

      if (product) {
        // Tạo warranty card cho từng sản phẩm trong đơn
        for (const item of order.items) {
          // Generate warranty number: WR + YY + MM + XXXX
          const now = new Date();
          const year = now.getFullYear().toString().slice(-2);
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const random = Math.floor(1000 + Math.random() * 9000);
          const warrantyNumber = `WR${year}${month}${random}`;

          const warrantyMonths = product.warrantyMonths || 12;
          const warrantyStartDate = new Date();
          const warrantyEndDate = new Date();
          warrantyEndDate.setMonth(warrantyEndDate.getMonth() + warrantyMonths);

          await WarrantyCard.create({
            warrantyNumber,
            productId: item.product,
            orderId: order._id,
            customerId: order.customerId,
            productUnitId: item.productUnit || null,
            serialNumber: item.serialNumber || "",
            warrantyType: "store",
            warrantyStartDate,
            warrantyEndDate,
            warrantyMonths,
            status: "active",
            notes: `Tự động tạo từ đơn hàng ${order.orderNumber}`,
          });

          console.log(`   ✅ [WARRANTY] Created warranty card: ${warrantyNumber}`);
        }
        results.warrantyCardsCreated = true;
      }
    }
  } catch (error: any) {
    console.error(`   ❌ [WARRANTY] Error:`, error.message);
  }

  // ========================================
  // 3. CỘNG ĐIỂM LOYALTY
  // ========================================
  try {
    if (order.customerId && order.totalAmount > 0) {
      // Rule: 100,000 VND = 1 điểm (có thể config)
      const POINTS_PER_AMOUNT = 100000;
      const points = Math.floor(order.totalAmount / POINTS_PER_AMOUNT);

      if (points > 0) {
        // Tính ngày hết hạn (12 tháng)
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 12);

        await LoyaltyPoints.create({
          customerId: order.customerId,
          points,
          pointsType: "earned",
          orderId: order._id,
          description: `Đặt hàng ${order.orderNumber} - Giá trị: ${order.totalAmount.toLocaleString('vi-VN')} VND`,
          expiryDate,
        });

        // Cập nhật tổng điểm trong Customer
        await Customer.findByIdAndUpdate(order.customerId, {
          $inc: { loyaltyPoints: points },
        });

        console.log(`   ✅ [LOYALTY] Added ${points} points to customer ${order.customerId}`);
        results.loyaltyPointsAdded = points;
      }
    }
  } catch (error: any) {
    console.error(`   ❌ [LOYALTY] Error:`, error.message);
  }

  // ========================================
  // 4. GỬI NOTIFICATION
  // ========================================
  try {
    // Notification cho admin
    await Notification.create({
      type: "order",
      title: "Đơn hàng đã giao",
      message: `Đơn hàng ${order.orderNumber} đã được giao thành công. Giá trị: ${order.totalAmount.toLocaleString('vi-VN')} VND`,
      priority: "normal",
    });

    // Notification cho khách hàng
    if (order.customerId) {
      await Notification.create({
        userId: order.customerId,
        type: "order",
        title: "Cảm ơn bạn đã mua hàng!",
        message: `Đơn hàng ${order.orderNumber} đã được giao thành công. Cảm ơn bạn đã tin tưởng LapLap Cần Thơ!`,
        priority: "normal",
      });
    }

    results.notificationsSent = true;
    console.log(`   ✅ [NOTIFICATION] Notifications sent`);
  } catch (error: any) {
    console.error(`   ❌ [NOTIFICATION] Error:`, error.message);
  }

  console.log(`✅ [AUTOMATION] Order ${order.orderNumber} processed:`, results);
  return results;
}

/**
 * Tự động chạy khi Buyback Order được duyệt
 * Tạo voucher tự động với giá trị = giá mua lại
 */
export async function onBuybackApproved(buybackOrderId: string) {
  await connectDB();

  const { BuybackOrder } = await import("@/models/BuybackOrder");
  const { Coupon } = await import("@/models/Coupon");

  const buybackOrder = await BuybackOrder.findById(buybackOrderId);
  if (!buybackOrder) {
    throw new Error(`Buyback order not found: ${buybackOrderId}`);
  }

  console.log(`🚀 [AUTOMATION] Processing buyback approved: ${buybackOrder.buybackNumber}`);

  // Tạo voucher
  const code = `TRADE${buybackOrder._id.toString().slice(-6).toUpperCase()}`;
  const validTo = new Date();
  validTo.setMonth(validTo.getMonth() + 3); // 3 tháng

  const voucher = await Coupon.create({
    code,
    description: `Voucher thu cũ đổi mới - ${buybackOrder.productInfo.model}`,
    discountType: "fixed",
    discountValue: buybackOrder.buyPrice,
    minOrderAmount: buybackOrder.buyPrice, // Phải mua tối thiểu bằng voucher
    validFrom: new Date(),
    validTo,
    maxUses: 1,
    isActive: true,
  });

  // Cập nhật buyback order
  buybackOrder.status = "approved";
  buybackOrder.approvedAt = new Date();
  buybackOrder.voucherId = voucher._id;
  await buybackOrder.save();

  // Gửi notification
  await Notification.create({
    type: "promotion",
    title: "Voucher thu cũ đổi mới",
    message: `Voucher ${code} trị giá ${buybackOrder.buyPrice.toLocaleString('vi-VN')} VND đã được tạo`,
    priority: "normal",
  });

  console.log(`✅ [AUTOMATION] Voucher created: ${code}`);

  return {
    voucherId: voucher._id,
    voucherCode: code,
    voucherValue: buybackOrder.buyPrice,
  };
}

/**
 * Tự động chạy khi Return được duyệt
 * Hoàn lại kho nếu là refund
 */
export async function onReturnApproved(returnId: string) {
  await connectDB();

  const { Return } = await import("@/models/Return");

  const returnOrder = await Return.findById(returnId);
  if (!returnOrder) {
    throw new Error(`Return not found: ${returnId}`);
  }

  console.log(`🚀 [AUTOMATION] Processing return approved: ${returnOrder.returnNumber}`);

  // Lấy order gốc để lấy thông tin sản phẩm
  const originalOrder = await Order.findById(returnOrder.orderId);

  if (returnOrder.returnType === "refund" && originalOrder) {
    // Hoàn lại kho
    for (const item of originalOrder.items) {
      await Inventory.findOneAndUpdate(
        { productId: item.product },
        {
          $inc: {
            quantity: item.quantity,
            availableQuantity: item.quantity,
          },
        }
      );
      console.log(`   ✅ [INVENTORY] Returned ${item.quantity} for product ${item.product}`);
    }
  }

  // Cập nhật return status
  returnOrder.status = "processed";
  returnOrder.processedAt = new Date();
  await returnOrder.save();

  console.log(`✅ [AUTOMATION] Return processed: ${returnOrder.returnNumber}`);

  return { success: true };
}

/**
 * Tự động xử lý điểm Loyalty hết hạn (chạy qua cron job)
 */
export async function processExpiredLoyaltyPoints() {
  await connectDB();

  const now = new Date();

  // Tìm tất cả points đã hết hạn và chưa được xử lý
  const expiredPoints = await LoyaltyPoints.find({
    expiryDate: { $lt: now },
    pointsType: { $ne: "expired" },
  });

  console.log(`🚀 [AUTOMATION] Processing ${expiredPoints.length} expired loyalty points`);

  let processedCount = 0;

  for (const point of expiredPoints) {
    // Tạo bản ghi expired
    await LoyaltyPoints.create({
      customerId: point.customerId,
      points: -point.points,
      pointsType: "expired",
      orderId: point.orderId,
      description: `Điểm thưởng hết hạn: ${point.description}`,
      expiryDate: null,
    });

    // Cập nhật tổng điểm trong Customer
    await Customer.findByIdAndUpdate(point.customerId, {
      $inc: { loyaltyPoints: -point.points },
    });

    processedCount++;
  }

  console.log(`✅ [AUTOMATION] Processed ${processedCount} expired points`);

  return { processedCount };
}
