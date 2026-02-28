# Chiến Lược Phát Triển Database LapLap V2
## Dành cho cửa hàng laptop MỚI + CŨ

---

## 🔴 I. NHỮNG THAY ĐỔI BẮT BUỘC (CRITICAL)

### 1. Cập nhật Products - Thêm thông tin máy cũ

```
products
├── isUsed: Boolean          # true = laptop cũ, false = laptop mới
├── condition: ENUM          # new, like_new, good, fair, poor
├── usedGrade: ENUM          # A, B, C (chỉ cho máy cũ)
├── conditionNote: String    # Mô tả tình trạng chi tiết
└── isFeatured: Boolean      # Sản phẩm nổi bật
```

### 2. 🆕 Tạo ProductUnits - QUAN TRỌNG NHẤT

```
product_units
├── _id: ObjectId
├── productId: ObjectId       # FK → products
├── serialNumber: String      # Số serial máy (QUAN TRỌNG với máy cũ)
├── barcode: String          # Mã vạch
├── purchasePrice: Number    # Giá nhập máy cũ
├── sellingPrice: Number     # Giá bán
├── condition: ENUM           # like_new, good, fair
├── batteryHealth: Number    # % pin (máy cũ)
├── batteryCycleCount: Number # Số chu kỳ sạc
├── source: ENUM              # import, trade_in, customer_sell
├── supplierId: ObjectId      # FK → suppliers (nếu nhập)
├── warehouseId: ObjectId    # FK → warehouses
├── purchaseDate: Date       # Ngày nhập máy
├── warrantyStartDate: Date  # Bắt đầu bảo hành
├── warrantyEndDate: Date    # Kết thúc bảo hành
├── status: ENUM             # available, reserved, sold, service, returned
├── notes: String            # Ghi chú thêm
└── images: [String]         # Hình ảnh từng máy
```

**Tại sao PHẢI CÓ bảng này?**
- Laptop cũ là hàng uniqueể qu, không thản lý theo số lượng
- Mỗi máy có serial riêng, giá nhập khác nhau
- Tính lợi nhuận chính xác từng máy
- Quản lý bảo hành theo serial

### 3. Sửa thiết kế Debts - Tránh polymorphic

```
debts
├── _id: ObjectId
├── customerId: ObjectId     # FK → customers (NULLABLE)
├── supplierId: ObjectId     # FK → suppliers (NULLABLE)
├── orderId: ObjectId         # FK → orders (NULLABLE)
├── purchaseOrderId: ObjectId # FK → purchase_orders (NULLABLE)
├── debtType: ENUM            # customer, supplier
├── totalAmount: Number
├── paidAmount: Number
├── remainingAmount: Number
├── dueDate: Date
├── status: ENUM             # pending, partial, paid, overdue
├── notes: String
└── timestamps
```

---

## 🟡 II. NHỮNG THAY ĐỔI QUAN TRỌNG (IMPORTANT)

### 4. Cập nhật Orders - Thêm đặt cọc

```
orders (UPDATE)
├── depositAmount: Number    # Tiền đặt cọc
├── depositDate: Date        # Ngày đặt cọc
├── depositMethod: String    # Phương thức đặt cọc
├── shippingFee: Number      # Phí vận chuyển
├── employeeId: ObjectId     # Nhân viên bán hàng
└── customerType: String     # retail, wholesale
```

### 5. Cập nhật OrderItems - Thêm giá vốn

```
order_items (UPDATE)
├── costPrice: Number        # Giá vốn tại thời điểm bán (QUAN TRỌNG)
├── productUnitId: ObjectId  # FK → product_units (cho máy cũ)
└── discount: Number         # Giảm giá từng sản phẩm
```

### 6. Cập nhật WarrantyCards - Phân loại bảo hành

```
warranty_cards (UPDATE)
├── warrantyType: ENUM       # manufacturer (hãng), store (cửa hàng)
├── coverageDetails: Object  # Chi tiết bảo hành
├── serialNumber: String     # Số serial máy
└── warrantyProvider: String # Đơn vị bảo hành
```

---

## 🟢 III. CÁC BẢNG MỚI CHO MÁY CŨ

### 7. BuybackOrders - Thu mua máy cũ

```
buyback_orders
├── _id: ObjectId
├── buybackNumber: String    # Mã phiếu thu mua
├── sellerName: String       # Tên người bán
├── sellerPhone: String       # SĐT người bán
├── sellerIdNumber: String   # CMND/CCCD
├── sellerAddress: String     # Địa chỉ người bán
├── productInfo: Object       # Thông tin máy thu mua
│   ├── brand: String
│   ├── model: String
│   ├── serialNumber: String
│   ├── condition: String
│   ├── specs: Object
├── buyPrice: Number          # Giá mua
├── inspectionNotes: String   # Ghi chú kiểm tra
├── status: ENUM             # pending, approved, paid, cancelled
├── inspectedBy: ObjectId    # FK → employees
├── approvedBy: ObjectId     # FK → users
├── paymentMethod: String
├── paidAt: Date
├── createdBy: ObjectId      # FK → users
└── timestamps
```

### 8. ProductHistory - Lịch sử từng máy

```
product_history
├── _id: ObjectId
├── productUnitId: ObjectId  # FK → product_units
├── eventType: ENUM           # purchased, repaired, sold, warranty_claimed
├── eventDate: Date
├── description: String
├── relatedId: ObjectId       # orderId, serviceId, etc.
├── performedBy: ObjectId     # FK → users/employees
└── timestamps
```

### 9. AuditLogs - Nhật ký thay đổi

```
audit_logs
├── _id: ObjectId
├── collectionName: String    # Tên collection
├── documentId: ObjectId      # ID document thay đổi
├── action: ENUM              # create, update, delete
├── changes: Object           # { before, after }
├── userId: ObjectId          # FK → users
├── ipAddress: String
└── timestamps
```

---

## 🟢 IV. TÍNH NĂNG BỔ SUNG

### 10. Returns - Hoàn trả đổi

```
returns
├── _id: ObjectId
├── returnNumber: String
├── orderId: ObjectId         # FK → orders
├── customerId: ObjectId      # FK → customers
├── returnType: ENUM         # refund, exchange, store_credit
├── reason: String
├── status: ENUM              # pending, approved, rejected, processed
├── refundAmount: Number
├── refundMethod: String
├── processedBy: ObjectId     # FK → users
├── processedAt: Date
└── timestamps

return_items
├── _id: ObjectId
├── returnId: ObjectId        # FK → returns
├── productId: ObjectId       # FK → products
├── productUnitId: ObjectId   # FK → product_units
├── quantity: Number
├── reason: String
└── condition: String
```

### 11. Notifications - Thông báo

```
notifications
├── _id: ObjectId
├── userId: ObjectId          # Người nhận thông báo
├── type: ENUM               # low_stock, warranty_expiring, service_overdue
├── title: String
├── message: String
├── data: Object             # Dữ liệu liên quan
├── isRead: Boolean
├── scheduledAt: Date        # Gửi lúc
├── sentAt: Date
└── timestamps
```

---

## 📊 TỔNG KẾT SỐ BẢNG

| STT | Tên Bảng | Loại | Mô Tả |
|-----|----------|------|-------|
| | **EXISTING** | | |
| 1 | users | ✅ Có | Admin/Staff |
| 2 | customers | ✅ Có | Khách hàng |
| 3 | products | ⚠️ Cần cập nhật | Sản phẩm (thêm isUsed, condition) |
| 4 | orders | ⚠️ Cần cập nhật | Đơn hàng (thêm deposit, employeeId) |
| 5 | categories | ✅ Có | Danh mục |
| 6 | brands | ✅ Có | Thương hiệu |
| 7 | reviews | ✅ Có | Đánh giá |
| 8 | components | ✅ Có | Linh kiện |
| 9 | software | ✅ Có | Phần mềm |
| 10 | blogs | ✅ Có | Tin tức |
| 11 | visitors | ✅ Có | Thống kê |
| 12 | popup_banners | ✅ Có | Banner |
| | **NEW - CORE** | | |
| 13 | **product_units** | 🆕 MỚI | **Serial tracking - QUAN TRỌNG** |
| 14 | employees | 🆕 MỚI | Nhân viên |
| 15 | employee_schedules | 🆕 MỚI | Lịch làm việc |
| 16 | employee_attendances | 🆕 MỚI | Bảng công |
| 17 | employee_salaries | 🆕 MỚI | Lương |
| | **NEW - WAREHOUSE** | | |
| 18 | suppliers | 🆕 MỚI | Nhà cung cấp |
| 19 | warehouses | 🆕 MỚI | Kho hàng |
| 20 | inventories | 🆕 MỚI | Tồn kho |
| 21 | stock_transactions | 🆕 MỚI | Giao dịch kho |
| 22 | purchase_orders | 🆕 MỚI | Đơn nhập hàng |
| 23 | purchase_order_items | 🆕 MỚI | Chi tiết nhập |
| | **NEW - FINANCE** | | |
| 24 | transactions | 🆕 MỚI | Giao dịch |
| 25 | debts | 🆕 MỚI | Công nợ (đã fix) |
| 26 | loyalty_points | 🆕 MỚI | Tích điểm |
| | **NEW - SERVICE** | | |
| 27 | services | 🆕 MỚI | Dịch vụ |
| 28 | service_items | 🆕 MỚI | Chi tiết dịch vụ |
| 29 | warranty_cards | 🆕 MỚI | Bảo hành (đã update) |
| | **NEW - USED LAPTOP** | | |
| 30 | buyback_orders | 🆕 MỚI | Thu mua máy cũ |
| 31 | product_history | 🆕 MỚI | Lịch sử máy |
| | **NEW - RETURNS** | | |
| 32 | returns | 🆕 MỚI | Hoàn trả |
| 33 | return_items | 🆕 MỚI | Chi tiết hoàn trả |
| | **NEW - AUDIT** | | |
| 34 | audit_logs | 🆕 MỚI | Nhật ký thay đổi |
| | **NEW - NOTIFICATIONS** | | |
| 35 | notifications | 🆕 MỚI | Thông báo |
| | **NEW - MARKETING** | | |
| 36 | coupons | 🆕 MỚI | Mã giảm giá |
| 37 | promotions | 🆕 MỚI | Khuyến mãi |

**TỔNG: 37 bảng**

---

## 🔗 RELATIONSHIPS MỚI

```
PRODUCTS (Template)
    │
    └── 1:N → PRODUCT_UNITS (Individual Items - Serial Tracking)
              │
              ├── 1:N → ORDER_ITEMS (bán ra)
              ├── 1:N → PRODUCT_HISTORY (lịch sử)
              ├── 1:N → WARRANTY_CARDS (bảo hành)
              ├── 1:N → SERVICES (sửa chữa)
              ├── N:1 → WAREHOUSES (lưu kho)
              ├── N:1 → SUPPLIERS (nhập từ)
              └── N:1 → BUYBACK_ORDERS (thu mua)

ORDERS
    │
    ├── N:1 → CUSTOMERS
    ├── N:1 → EMPLOYEES (nhân viên bán)
    ├── 1:N → ORDER_ITEMS
    │         │
    │         ├── N:1 → PRODUCTS
    │         └── N:1 → PRODUCT_UNITS (cho máy cũ)
    ├── 1:N → RETURNS
    └── 1:N → TRANSACTIONS

DEBTS (FIXED - Explicit FKs)
    ├── customerId (nullable)
    ├── supplierId (nullable)
    ├── orderId (nullable)
    └── purchaseOrderId (nullable)
```

---

## 📝 INDEXES QUAN TRỌNG

```
javascript
// Products
products.index({ categoryId: 1, brandId: 1, isUsed: 1 })
products.index({ isUsed: 1, condition: 1 })

// Product Units - QUAN TRỌNG
product_units.index({ serialNumber: 1 }, { unique: true })
product_units.index({ productId: 1, status: 1 })
product_units.index({ status: 1, warehouseId: 1 })

// Orders
orders.index({ customerId: 1, createdAt: -1 })
orders.index({ status: 1, createdAt: -1 })
orders.index({ employeeId: 1, createdAt: -1 })

// Services
services.index({ customerId: 1, status: 1 })
services.index({ status: 1, priority: 1 })

// Warranty
warranty_cards.index({ serialNumber: 1 })
warranty_cards.index({ warrantyEndDate: 1 })

// Stock
stock_transactions.index({ productId: 1, createdAt: -1 })
stock_transactions.index({ warehouseId: 1, createdAt: -1 })
```

---

## ✅ CHECKLIST TRIỂN KHAI

### Phase 1: Cập nhật models hiện có
- [ ] Cập nhật Product: thêm isUsed, condition, usedGrade
- [ ] Cập nhật Order: thêm depositAmount, employeeId, costPrice trong items
- [ ] Cập nhật Customer: thêm birthday, gender, customerType
- [ ] Cập nhật Category: thêm parentId, sortOrder
- [ ] Cập nhật Brand: thêm country, website

### Phase 2: Tạo Product Units (QUAN TRỌNG NHẤT)
- [ ] Tạo model ProductUnit
- [ ] Tạo API CRUD
- [ ] Tích hợp vào đơn hàng

### Phase 3: Quản lý máy cũ
- [ ] Tạo BuybackOrder
- [ ] Tạo ProductHistory
- [ ] Workflow thu mua → kiểm tra → nhập kho

### Phase 4: Employee & Warehouse
- [ ] Employee, Schedule, Attendance, Salary
- [ ] Supplier, Warehouse, Inventory, StockTransaction
- [ ] PurchaseOrder, PurchaseOrderItem

### Phase 5: Finance & Service
- [ ] Transaction, Debt (fixed design)
- [ ] Service, ServiceItem, WarrantyCard
- [ ] LoyaltyPoints

### Phase 6: Additional
- [ ] AuditLogs
- [ ] Returns
- [ ] Notifications
- [ ] Coupons, Promotions
