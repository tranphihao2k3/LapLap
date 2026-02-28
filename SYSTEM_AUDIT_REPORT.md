# 🔍 BÁO CÁO KIỂM TOÁN HỆ THỐNG QUẢN LÝ BÁN LAPTOP
## LapLap - Hệ thống E-commerce & Quản lý

---

## 📋 TỔNG QUAN

Hệ thống hiện tại xây dựng trên nền tảng **Next.js + MongoDB (Mongoose)** với đầy đủ các module cần thiết cho một cửa hàng laptop. Tuy nhiên, còn nhiều điểm cần cải thiện để đạt chuẩn doanh nghiệp.

---

## 1️⃣ NHÀ CUNG CẤP (SUPPLIER)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Liên kết với Product | ✅ Có | `ProductUnit.supplierId` |
| Liên kết với Product (trực tiếp) | ❌ Chưa | Product model không có supplierId |
| Liên kết với Inventory | ❌ Chưa | Không có trường supplierId |
| Công nợ (totalDebt) | ✅ Có | Lưu trực tiếp trong Supplier |
| Rating/Đánh giá | ✅ Có | Trường `rating` (1-5 sao) |
| Payment Term | ✅ Có | Trường `paymentTerm` |

### ⚠️ Thiếu sót
- **Không có bảng Import Orders** - Nhập hàng không được theo dõi riêng
- **Không có Warehouse Logs** - Không theo dõi nhập/xuất kho theo từng supplier
- **Không tự động cập nhật công nợ** - Phải thủ công
- **Không có lịch sử giao dịch** chi tiết với từng supplier

### 📊 Luồng hiện tại
```
Supplier → (không có) → Import Order → ProductUnit
```

### ✅ Đề xuất nâng cấp
1. **Tạo bảng PurchaseOrder** (đơn nhập hàng)
2. **Tạo bảng PurchaseOrderItem** (chi tiết đơn nhập)
3. **Tạo bảng SupplierTransaction** (lịch sử giao dịch)
4. **Tự động cập nhật công nợ** khi tạo/cập nhật đơn nhập
5. **Tạo API thống kê**:
   - Tổng số lượng nhập theo supplier
   - Tổng tiền nhập theo supplier
   - Công nợ hiện tại

---

## 2️⃣ THU CŨ ĐỔI MỚI (TRADE-IN / BUYBACK)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Form từ client | ✅ Có | BuybackOrder model đầy đủ |
| Thông tin sản phẩm cũ | ✅ Có | `productInfo` (brand, model, serial) |
| Hình ảnh | ✅ Có | `images` array |
| Tình trạng máy | ✅ Có | `condition` field |
| Admin duyệt | ✅ Có | Trạng thái: pending → inspecting → approved |
| Tạo voucher tự động | ❌ Chưa | Chưa có chức năng tạo voucher |

### 📊 Luồng hiện tại
```
Client gửi yêu cầu → Admin kiểm tra → Admin định giá → Admin duyệt → Hoàn tất
```

### ✅ Luồng chuẩn cần có
```
Client gửi yêu cầu (pending)
    ↓
Admin kiểm tra & định giá (inspecting)
    ↓
Admin duyệt (approved) → Tự động tạo voucher = giá thu cũ
    ↓
Khách xác nhận (confirmed)
    ↓
Tạo đơn hàng mới (completed)
```

### ⚠️ Thiếu sót
- **Không tự động tạo voucher** khi duyệt
- **Không theo dõi trạng thái hoàn tất** (completed)
- **Không liên kết với đơn hàng mới** (khi khách dùng voucher mua máy mới)

### ✅ Đề xuất nâng cấp
1. Thêm trường `voucherId` vào BuybackOrder
2. Khi `status = "approved"` → Tự động tạo Coupon với giá trị = `buyPrice`
3. Thêm trạng thái `confirmed` và `completed`
4. Liên kết BuybackOrder với Order khi khách mua máy mới

---

## 3️⃣ ĐỔI TRẢ HÀNG (RETURN & REFUND)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Liên kết Order | ✅ Có | `orderId` |
| Liên kết Customer | ✅ Có | `customerId` |
| Loại hoàn trả | ✅ Có | refund, exchange, store_credit |
| Lý do | ✅ Có | `reason` field |
| Hoàn tiền | ✅ Có | `refundAmount`, `refundMethod` |

### ⚠️ Thiếu sót
- **Không có điều kiện đổi trả** rõ ràng (bao nhiêu ngày, seal, lỗi kỹ thuật)
- **Không tự động cập nhật kho** khi duyệt hoàn trả
- **Không tạo phiếu kho** (warehouse transaction)
- **Không phân biệt rõ** giữa warranty claim và return thông thường

### 📊 Luồng hiện tại
```
Đơn hàng → Yêu cầu đổi trả (pending) → Duyệt (approved) → Hoàn tiền → Xong
```

### ✅ Luồng chuẩn doanh nghiệp
```
Order → Yêu cầu đổi trả (pending)
    ↓
Kiểm tra điều kiện:
  - Trong 7 ngày?
  - Còn seal?
  - Lỗi kỹ thuật?
    ↓
Duyệt/Không duyệt (approved/rejected)
    ↓
[XỬ LÝ HOÀN TIỀN]
  - Tạo Transaction (refund)
  - Cập nhật Payment status
    ↓
[XỬ LÝ KHO]
  - Nếu Exchange: Xuất kho sản phẩm mới, Nhập lại sản phẩm cũ
  - Nếu Refund: Nhập lại kho (nếu là hàng trả)
    ↓
Hoàn tất (processed)
```

### ✅ Đề xuất nâng cấp
1. Thêm bảng **ReturnPolicy** (chính sách đổi trả)
2. Thêm trường `returnCondition` vào Return model
3. Tự động cập nhật Inventory khi duyệt return
4. Tạo **ReturnItem** cho từng sản phẩm trong đơn hoàn trả
5. Phân biệt **Refund** (hoàn tiền), **Exchange** (đổi hàng), **Warranty Claim** (bảo hành)

---

## 4️⃣ BẢO HÀNH (WARRANTY)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Serial Number | ✅ Có | `serialNumber` field |
| Thời gian bảo hành | ✅ Có | `warrantyMonths`, `warrantyStartDate`, `warrantyEndDate` |
| Loại bảo hành | ✅ Có | manufacturer, store |
| Trạng thái | ✅ Có | active, expired, voided, claimed |
| Liên kết Product/Order/Customer | ✅ Có | Đầy đủ |

### ⚠️ Thiếu sót
- **Không tự động tạo WarrantyCard** khi Order completed
- **Không có lịch sử bảo hành** (warranty claims)
- **Không theo dõi số lần bảo hành**
- **Không cảnh báo hết hạn bảo hành**

### 📊 Luồng hiện tại
```
Order completed → Admin tạo thủ công WarrantyCard → Hoàn tất
```

### ✅ Luồng chuẩn doanh nghiệp
```
Order status = "delivered" → [TỰ ĐỘNG]
  1. Tạo WarrantyCard với serial từ ProductUnit
  2. Tính warrantyEndDate = purchaseDate + warrantyMonths
  3. Gửi email xác nhận bảo hành cho khách
     ↓
Khi khách yêu cầu bảo hành:
  1. Tạo WarrantyClaim record
  2. Ghi nhận: ngày yêu cầu, vấn đề, giải pháp
  3. Tăng số lần bảo hành (claimCount)
     ↓
[ALERT] 30 ngày trước hết hạn:
  - Gửi email nhắc nhở khách hàng
  - Thông báo trong admin dashboard
```

### ✅ Đề xuất nâng cấp
1. **Tự động tạo WarrantyCard** khi Order chuyển sang "delivered"
2. Thêm bảng **WarrantyClaim**:
   - warrantyCardId
   - claimDate
   - issueDescription
   - resolution
   - claimCount
3. Thêm tính năng **cảnh báo hết hành bảo hành** (cron job)
4. Tích hợp với **ProductUnit** để theo dõi serial

---

## 5️⃣ KHO HÀNG (WAREHOUSE)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Warehouse model | ✅ Có | Đầy đủ thông tin kho |
| Inventory model | ✅ Có | quantity, reserved, available |
| Liên kết Product | ✅ Có | productId |
| Liên kết Warehouse | ✅ Có | warehouseId |
| Reserved quantity | ✅ Có | Hàng đang đặt |

### ⚠️ Thiếu sót
- **Không có Warehouse Logs** - Không theo dõi chi tiết nhập/xuất
- **Product lưu số lượng?** - Cần kiểm tra Product model
- **Không có điều chỉnh kho** (stock adjustment)
- **Không tự động trừ kho** khi Order completed

### 🔍 Phát hiện quan trọng
- Product model **KHÔNG** có trường quantity → ✅ Đúng (tách riêng vào Inventory)
- ProductUnit có warehouseId → ✅ Tốt (theo từng máy)

### 📊 Luồng hiện tại
```
Nhập hàng: Tạo ProductUnit → Gán warehouseId → Inventory tự cộng
Xuất hàng: Admin xuất thủ công
```

### ✅ Luồng chuẩn doanh nghiệp
```
[NHẬP KHO]
PurchaseOrder approved → Tạo ProductUnit (serial) → Tạo InventoryLog (IN) → Cập nhật Inventory
    ↓
[XUẤT KHO]
Order delivered → Trừ Inventory.available → Tạo InventoryLog (OUT)
    ↓
[ĐIỀU CHỈNH]
Admin tạo Stock Adjustment → Tạo InventoryLog (ADJUST) → Cập nhật Inventory
    ↓
[HỦY ĐƠN]
Order cancelled → Hoàn lại Inventory → Tạo InventoryLog (RETURN)
```

### ✅ Đề xuất nâng cấp
1. Tạo bảng **InventoryLog**:
   
```
typescript
   {
     type: "IN" | "OUT" | "ADJUST" | "RETURN",
     productId, warehouseId, quantity, 
     referenceType, referenceId,
     notes, createdBy
   }
   
```
2. **Tự động trừ kho** khi Order chuyển sang "delivered"
3. **Tự động hoàn kho** khi Order bị hủy
4. Tạo API kiểm tra **tồn kho đa kho** (multi-warehouse)

---

## 6️⃣ GHI CHÚ (NOTES)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Notes trong Supplier | ✅ Có | String field |
| Notes trong Customer | ✅ Có | String field |
| Notes trong Order | ✅ Có | String field |
| Notes trong Service | ✅ Có | String field |

### ⚠️ Thiếu sót
- **Không có bảng Notes riêng** - Chỉ là text field đơn giản
- **Không phân quyền** (nội bộ vs khách hàng)
- **Không có lịch sử chỉnh sửa**
- **Không thể attach files**

### ✅ Đề xuất nâng cấp
1. Tạo bảng **Note**:
   
```
typescript
   {
     relatedType: "order" | "customer" | "supplier" | "product" | "service",
     relatedId: ObjectId,
     content: String,
     isInternal: Boolean, // true = admin only
     createdBy: ObjectId,
     createdAt, updatedAt
   }
   
```
2. Chỉ show `isInternal: false` cho khách hàng
3. Log lịch sử chỉnh sửa (audit)

---

## 7️⃣ ĐƠN SỬA CHỮA (REPAIR ORDERS / SERVICE)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Service model | ✅ Có | Đầy đủ |
| Các loại dịch vụ | ✅ Có | repair, cleaning, upgrade, warranty, inspection |
| Trạng thái | ✅ Có | pending → completed |
| Thông tin khách hàng | ✅ Có | name, phone |
| Thông tin sản phẩm | ✅ Có | brand, model, serial |

### ⚠️ Thiếu sót
- **Không tạo ticket từ client** - Chỉ admin tạo
- **Không tính doanh thu** tự động
- **Không trừ linh kiện** trong kho
- **Không phân biệt** sửa bảo hành (miễn phí) vs sửa tính phí

### 📊 Luồng hiện tại
```
Admin tạo Service → Kỹ thuật viên sửa → Hoàn thành → Xong
```

### ✅ Luồng chuẩn doanh nghiệp
```
[TIẾP NHẬN]
Client gửi yêu cầu (form online) → Tạo Service (pending)
    ↓
[TIẾP NHẬN & CHẨN ĐOÁN]
Admin tiếp nhận → Chẩn đoán (diagnosing)
    ↓
[PHÂN LOẠI]
├─ Bảo hành → ServiceType = "warranty" → Miễn phí
└─ Sửa tính phí → ServiceType = "repair" → Tính tiền
    ↓
[SỬA CHỮA]
Kỹ thuật viên thực hiện → Cập nhật tiến độ
    ↓
[XUẤT LINH KIỆN] (nếu có)
Trừ Component trong Inventory → Tạo ServiceItem
    ↓
[THANH TOÁN]
├─ Bảo hành: $0
└─ Sửa phí: Tạo Invoice → Thu tiền → Tạo Transaction (income)
    ↓
[HOÀN TẤT]
Cập nhật status → Gửi email thông báo → Cập nhật doanh thu
```

### ✅ Đề xuất nâng cấp
1. Tạo form **tiếp nhận sửa chữa từ client** (`/sua-chua-laptop`)
2. Thêm bảng **ServiceItem** (chi tiết linh kiện thay thế)
3. Phân biệt **warranty repair** (không tính tiền) vs **paid repair** (tính tiền)
4. Tự động tạo **Transaction** khi hoàn thành sửa tính phí
5. Trừ **Inventory** khi xuất linh kiện

---

## 8️⃣ MÃ GIẢM GIÁ vs KHUYẾN MÃI

### ✅ Hiện trạng
| Thông tin | Coupon | Promotion |
|-----------|---------|-----------|
| Code | ✅ | ✅ (optional) |
| Giảm % | ✅ | ✅ |
| Giảm fixed | ✅ | ✅ |
| Min order | ✅ | ✅ |
| Max uses | ✅ | ✅ |
| Ngày hết hạn | ✅ | ✅ |
| Tự động áp dụng | ❌ | ❌ (chưa rõ) |

### ⚠️ Thiếu sót
- **Không có rule engine** giảm giá
- **Không rõ** promotion tự động áp dụng hay không
- **Không có rule ưu tiên** khi áp dụng nhiều khuyến mãi
- **Không kiểm tra** có stack được hay không

### ✅ Đề xuất nâng cấp
1. Thêm trường `stackable` vào cả Coupon và Promotion
2. Thêm bảng **PromotionRule**:
   
```
typescript
   {
     promotionId,
     ruleType: "product" | "category" | "cart_total" | "customer_type",
     conditions: JSON,
     priority: Number // ưu tiên cao hơn chạy trước
   }
   
```
3. **Logic áp dụng**:
   - Coupon: Áp dụng cuối cùng (sau promotion)
   - Promotion: Áp dụng theo priority, chỉ 1 được active
   - Nếu `stackable: false`: Không cho áp dụng chồng

---

## 9️⃣ ĐIỂM THƯỞNG (LOYALTY POINTS)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| LoyaltyPoints model | ✅ Có | Đầy đủ |
| Các loại điểm | ✅ Có | earned, redeemed, expired, adjusted |
| Expiry date | ✅ Có | `expiryDate` |
| Liên kết Order | ✅ Có | `orderId` |
| Liên kết Customer | ✅ Có | `customerId` |

### ⚠️ Thiếu sót
- **Không có rule tự động cộng điểm** (10 triệu = 100 điểm)
- **Sửa chữa không được tính điểm** - Chưa có trong flow
- **Không có API đổi điểm** thành voucher
- **Customer lưu điểm tổng** - Có thể dư thừa nếu đã có LoyaltyPoints

### 📊 Luồng hiện tại
```
Mua hàng → Admin cộng điểm thủ công → Hoàn tất
```

### ✅ Luồng chuẩn doanh nghiệp
```
[ORDER COMPLETED]
├─ Order total >= 10,000,000 VND
│   └─ Points = total / 100,000 * 10 = total / 10,000
│   └─ Tạo LoyaltyPoints (earned)
│   └─ Cập nhật Customer.loyaltyPoints
│
[SERVICE COMPLETED - PAID]
├─ Service total >= 1,000,000 VND
│   └─ Points = total / 100,000 * 5 = total / 20,000
│
[EXPIRED POINTS]
└─ Cron job chạy hàng đêm
    └─ Tìm points có expiryDate < today
    └─ Tạo LoyaltyPoints (expired)
    └─ Cập nhật Customer.loyaltyPoints
```

### ✅ Đề xuất nâng cấp
1. Thêm bảng **LoyaltyRule**:
   
```
typescript
   {
     type: "order" | "service" | "referral",
     pointsPerAmount: Number, // số điểm / VND
     minAmount: Number,
     isActive: Boolean
   }
   
```
2. **Tự động cộng điểm** khi Order/Service completed
3. Tạo API **đổi điểm thành voucher**:
   - 1000 điểm = Voucher 50,000 VND
4. Cron job **xử lý điểm hết hạn**

---

## 🔟 VISITOR (THEO DÕI TRUY CẬP)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Visitor model | ✅ Có | Rất đơn giản |
| Chỉ có count | ✅ Có | `count` field |
| Label | ✅ Có | `label` field |

### ⚠️ Thiếu sót nghiêm trọng
- **Không tracking IP**
- **Không tracking thiết bị** (user agent)
- **Không tracking thời gian** (session)
- **Không có analytics** (unique visitor, page views)
- **Không có realtime** (online users)

### ✅ Đề xuất nâng cấp
1. Tạo bảng **VisitorSession**:
   
```
typescript
   {
     sessionId: String,
     visitorId: ObjectId,
     ip: String,
     userAgent: String,
     device: String, // mobile, desktop
     browser: String,
     referrer: String,
     pages: [{ url, timestamp }],
     duration: Number,
     isUnique: Boolean
   }
   
```
2. Tạo bảng **VisitorPageView**:
   
```
typescript
   {
     visitorId, sessionId,
     url, timestamp, duration
   }
   
```
3. API thống kê:
   - Unique visitors (theo IP/session)
   - Page views
   - Average time on site
   - Bounce rate
   - Realtime online users

---

## 1️⃣1️⃣ THÔNG BÁO (NOTIFICATION)

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| Notification model | ✅ Có | Đầy đủ |
| Các loại notification | ✅ Có | order, payment, warranty, inventory, system, promotion |
| Priority | ✅ Có | low, normal, high, urgent |
| Trạng thái đã đọc | ✅ Có | `isRead`, `readAt` |

### ⚠️ Thiếu sót
- **Không có realtime** - Chỉ lưu vào DB, không push realtime
- **Không có notification cho client** - Chỉ admin
- **Không có email/SMS notification** tự động

### ✅ Đề xuất nâng cấp
1. Triển khai **Socket.io** hoặc **Pusher** cho realtime
2. Flow realtime:
   
```
   Client tạo Order → API → Save DB → Emit event → Admin nhận popup
   
```
3. Thêm loại notification cho **client**:
   - Order status changed
   - Warranty expiring
   - Points earned
4. Tích hợp **Firebase Cloud Messaging** cho mobile

---

## 1️⃣2️⃣ FAQ

### ✅ Hiện trạng
| Thông tin | Trạng thái | Chi tiết |
|-----------|------------|----------|
| FAQ model | ✅ Có | Đầy đủ |
| Category | ✅ Có | general |
| Order | ✅ Có | Thứ tự hiển thị |
| Active/Inactive | ✅ Có | `isActive` |

### ⚠️ Thiếu sót
- **Không có FAQ theo sản phẩm** - Chỉ chung toàn hệ thống
- **Không có schema markup** cho SEO

### ✅ Đề xuất nâng cấp
1. Tạo bảng **ProductFAQ**:
   
```
typescript
   {
     productId: ObjectId,
     question: String,
     answer: String,
     order: Number,
     isActive: Boolean
   }
   
```
2. Hiển thị ở trang chi tiết sản phẩm
3. Thêm **JSON-LD Schema FAQPage** cho SEO

---

## 📊 TỔNG HỢP THIẾU SÓT

### 🔴 Nghiêm trọng (Cần sửa gấp)
1. **Không tự động tạo WarrantyCard** khi Order completed
2. **Không tự động trừ kho** khi Order completed
3. **Không có realtime notification**
4. **Không có Visitor tracking** đầy đủ

### 🟡 Trung bình (Nên sửa sớm)
1. Không có Purchase Order (nhập hàng)
2. Không tự động cộng điểm Loyalty
3. Không tạo voucher khi duyệt Buyback
4. Không có Inventory Logs
5. Không phân biệt rõ Return vs Warranty Claim

### 🟢 Cần cải thiện (Nâng cấp)
1. Service (sửa chữa) chưa tính doanh thu
2. Không có Coupon/Promotion stacking rules
3. FAQ chưa theo sản phẩm
4. Visitor chưa có analytics

---

## 🏗️ ĐỀ XUẤT CẤU TRÚC DATABASE CHUẨN

### Sơ đồ quan hệ (ERD)

```
┌─────────────────┐       ┌─────────────────┐
│    Customer     │       │     Supplier    │
├─────────────────┤       ├─────────────────┤
│ _id             │       │ _id             │
│ name            │       │ supplierCode    │
│ phone           │       │ name            │
│ email           │       │ totalDebt       │◄──┐
│ loyaltyPoints   │       │ rating          │   │
│ totalSpent      │       │ paymentTerm     │   │
│ customerType    │       └────────┬────────┘   │
└────────┬────────┘                │         │
         │                         │         │
         │ 1:N                     │ 1:N     │
         ▼                         ▼         │
┌─────────────────────────────────────────────┐
│                   Order                      │
├─────────────────────────────────────────────┤
│ _id                                         │
│ orderNumber                                 │
│ customerId ──────────► Customer._id         │
│ status (pending→delivered)                 │
│ totalAmount                                 │
│ paymentStatus                               │
│ createdAt → Update warranty/inventory       │
└────────────────────┬────────────────────────┘
                     │ 1:N
                     ▼
┌─────────────────────────────────────────────┐
│              OrderItem                       │
├─────────────────────────────────────────────┤
│ productId  ───────────► Product._id         │
│ productUnitId ───────► ProductUnit._id      │
│ quantity                                    │
│ price                                       │
│ discount                                    │
└─────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   ProductUnit   │       │   WarrantyCard  │
├─────────────────┤       ├─────────────────┤
│ _id             │       │ _id             │
│ serialNumber    │◄──────│ serialNumber    │
│ productId       │       │ productId       │
│ warehouseId ────────► Warehouse._id        │
│ supplierId ────────► Supplier._id          │
│ status          │       │ warrantyStatus │
│ purchasePrice   │       │ warrantyEndDate│
└────────┬────────┘       └────────┬────────┘
         │                          │
         │ 1:1                      │ 1:1
         ▼                          ▼
┌─────────────────────────────────────────────┐
│                 Inventory                   │
├─────────────────────────────────────────────┤
│ productId  ──────────────────────────────► │
│ warehouseId ──────────────────────────────► │
│ quantity                                    │
│ reservedQuantity                           │
│ availableQuantity = quantity - reserved    │
└─────────────────────────────────────────────┘
```

### Bảng mới cần tạo

```
typescript
// 1. PurchaseOrder - Đơn nhập hàng
{
  orderNumber: String, // PO + timestamp
  supplierId: ObjectId,
  status: "draft" | "ordered" | "received" | "cancelled",
  items: [{
    productId, quantity, unitPrice, totalPrice
  }],
  totalAmount: Number,
  paidAmount: Number,
  warehouseId: ObjectId,
  notes: String,
  createdBy: ObjectId
}

// 2. InventoryLog - Nhật ký kho
{
  type: "IN" | "OUT" | "ADJUST" | "RETURN",
  productId, warehouseId, quantity,
  referenceType: "order" | "purchase" | "return" | "adjustment",
  referenceId: ObjectId,
  notes: String,
  createdBy: ObjectId
}

// 3. SupplierTransaction - Giao dịch supplier
{
  supplierId, type: "payment" | "purchase",
  amount, referenceType, referenceId,
  description, createdBy
}

// 4. WarrantyClaim - Yêu cầu bảo hành
{
  warrantyCardId, claimDate,
  issueDescription, resolution,
  claimCount: Number,
  status: "pending" | "processing" | "completed"
}

// 5. LoyaltyRule - Rule điểm thưởng
{
  type: "order" | "service",
  pointsPerAmount: Number,
  minAmount: Number,
  isActive: Boolean
}

// 6. VisitorSession - Phiên truy cập
{
  sessionId, ip, userAgent,
  device, browser, pages: [{ url, timestamp }],
  duration, isUnique
}

// 7. ProductFAQ - FAQ theo sản phẩm
{
  productId, question, answer,
  order: Number, isActive: Boolean
}
```

---

## 🔄 ĐỀ XUẤT LUỒNG TỰ ĐỘNG HÓA

### 1. Order Completed → Tự động
```
javascript
// Khi order.status = "delivered"
async function onOrderDelivered(order) {
  // 1. Trừ kho
  for (item of order.items) {
    await Inventory.updateOne(
      { productId: item.productId, warehouseId: defaultWarehouse },
      { $inc: { quantity: -item.quantity, availableQuantity: -item.quantity } }
    );
    await InventoryLog.create({
      type: "OUT", productId, quantity: item.quantity,
      referenceType: "order", referenceId: order._id
    });
  }

  // 2. Tạo warranty card
  if (order.items[0]?.productUnitId) {
    await WarrantyCard.create({
      warrantyNumber: generateWarrantyNumber(),
      productId: order.items[0].productId,
      orderId: order._id,
      customerId: order.customerId,
      productUnitId: order.items[0].productUnitId,
      serialNumber: productUnit.serialNumber,
      warrantyStartDate: new Date(),
      warrantyEndDate: addMonths(new Date(), 12)
    });
  }

  // 3. Cộng điểm loyalty
  const points = Math.floor(order.totalAmount / 100000);
  if (points > 0) {
    await LoyaltyPoints.create({
      customerId: order.customerId,
      points,
      pointsType: "earned",
      orderId: order._id,
      description: `Đặt hàng ${order.orderNumber}`,
      expiryDate: addMonths(new Date(), 12)
    });
  }

  // 4. Gửi notification
  await Notification.create({
    type: "order",
    title: "Đơn hàng đã giao",
    message: `Đơn hàng ${order.orderNumber} đã được giao thành công`,
    userId: order.customerId
  });
}
```

### 2. Buyback Approved → Tự động tạo Voucher
```
javascript
async function onBuybackApproved(buybackOrder) {
  // Tạo voucher = giá mua
  const voucher = await Coupon.create({
    code: `TRADE${buybackOrder._id.toString().slice(-6)}`,
    discountType: "fixed",
    discountValue: buybackOrder.buyPrice,
    minOrderAmount: buybackOrder.buyPrice, // Phải mua tối thiểu bằng giá trị voucher
    validTo: addMonths(new Date(), 3),
    maxUses: 1,
    description: `Voucher thu cũ đổi mới - ${buybackOrder.productInfo.model}`
  });

  // Cập nhật buyback order
  buybackOrder.voucherId = voucher._id;
  buybackOrder.status = "approved";
  await buybackOrder.save();
}
```

### 3. Return Approved → Tự động hoàn kho
```
javascript
async function onReturnApproved(returnOrder) {
  // Hoàn kho nếu là refund
  if (returnOrder.returnType === "refund") {
    for (item of returnOrder.items) {
      await Inventory.updateOne(
        { productId: item.productId },
        { $inc: { quantity: item.quantity, availableQuantity: item.quantity } }
      );
      await InventoryLog.create({
        type: "RETURN",
        productId: item.productId,
        quantity: item.quantity,
        referenceType: "return",
        referenceId: returnOrder._id
      });
    }
  }
}
```

---

## 📈 KẾT LUẬN

### Điểm mạnh của hệ thống hiện tại:
1. ✅ Cấu trúc Database tốt, đã tách Inventory riêng
2. ✅ Có đầy đủ các module cơ bản
3. ✅ Có Audit Log cho tracking
4. ✅ Có Notification model
5. ✅ ProductUnit quản lý serial number riêng biệt

### Cần cải thiện để đạt chuẩn doanh nghiệp:
1. ❌ Tự động hóa còn thiếu nhiều
2. ❌ Chưa có realtime features
3. ❌ Visitor tracking sơ sài
4. ❌ Thiếu Purchase Order (nhập hàng)
5. ❌ Chưa có đầy đủ báo cáo & thống kê

### Ưu tiên triển khai:
1. **Phase 1** (Nghiêm trọng): Order → Warranty, Inventory, Loyalty tự động
2. **Phase 2** (Trung bình): Purchase Order, Supplier Transactions, Return automation
3. **Phase 3** (Nâng cao): Realtime, Analytics, Advanced promotions

---

*Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')}*
*Hệ thống: LapLap E-commerce*
