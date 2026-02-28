# DATABASE ERD V2 - LapLap Store (Laptop Mới + Cũ)

## Tổng Quan Kiến Trúc

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              LAPLAP DATABASE ARCHITECTURE V2                                                  │
│                                    (Laptop Mới + Có Serial Tracking)                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗  │
│  ║                                       CORE TABLES                                                      ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════╣  │
│  ║                                                                                                          ║  │
│  ║    ┌─────────┐       ┌────────────┐       ┌───────────┐       ┌─────────┐       ┌──────────┐            ║  │
│  ║    │  USERS  │       │ EMPLOYEES  │       │ CUSTOMERS │       │SUPPLIERS│       │WAREHOUSES│            ║  │
│  ║    │ (Admin)  │       │ (Staff)    │       │ (Buyers)  │       │  (NCC)  │       │   (Kho)  │            ║  │
│  ║    └────┬────┘       └─────┬──────┘       └─────┬─────┘       └────┬────┘       └────┬─────┘            ║  │
│  ║         │                 │                    │                  │                │                   ║  │
│  ║         │ 1:N             │ 1:N                │ 1:N              │ 1:N            │ 1:N               ║  │
│  ║         ▼                 ▼                    ▼                  ▼                ▼                   ║  │
│  ║    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐     ║  │
│  ║    │                                    PRODUCTS (Template)                                          │     ║  │
│  ║    │  name, slug, categoryId, brandId, price, isUsed, condition, usedGrade, costPrice, isFeatured  │     ║  │
│  ║    └─────────────────────────┬────────────────────────────────────────────────────────────────────┘     ║  │
│  ║                              │                                                                         ║  │
│  ║                              │ 1:N                                                                     ║  │
│  ║                              ▼                                                                         ║  │
│  ║    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐     ║  │
│  ║    │                            PRODUCT_UNITS (Serial Tracking)  ключевой                           │     ║  │
│  ║    │  serialNumber, barcode, purchasePrice, sellingPrice, condition, batteryHealth, source, status  │     ║  │
│  ║    └────────────────────┬────────────────────┬────────────────────┬────────────────────────────┘     ║  │
│  ║                         │                    │                    │                                   ║  │
│  ║                         │ 1:N                │ N:1                │ N:1                                ║  │
│  ║                         ▼                    │                    │                                   ║  │
│  ║    ┌─────────────────────────────┐            │                    ▼                                   ║  │
│  ║    │       ORDER_ITEMS          │            │            ┌─────────────────┐                            ║  │
│  ║    │  productId, costPrice,     │◄───────────┼────────────│   WAREHOUSES   │                            ║  │
│  ║    │  productUnitId, discount   │            │            └─────────────────┘                            ║  │
│  ║    └─────────────┬───────────────┘            │                                                         ║  │
│  ║                  │                            │                                                         ║  │
│  ║                  │ N:1                       │                                                         ║  │
│  ║                  ▼                            │                                                         ║  │
│  ║    ┌─────────────────────────────┐            │                                                         ║  │
│  ║    │           ORDERS           │            │                                                         ║  │
│  ║    │  orderNumber, customerId,  │◄───────────┼─────────────────────────────────────────────────────────║  │
│  ║    │  employeeId, depositAmount│            │                                                         ║  │
│  ║    └─────────────┬───────────────┘            │                                                         ║  │
│  ║                  │                            │                                                         ║  │
│  ║                  │ 1:N                       │                                                         ║  │
│  ║                  ▼                            │                                                         ║  │
│  ║    ┌─────────────────────────────┐            │                                                         ║  │
│  ║    │      TRANSACTIONS          │◄───────────┼─────────────────────────────────────────────────────────║  │
│  ║    │  type, amount, referenceId │            │                                                         ║  │
│  ║    └─────────────────────────────┘            │                                                         ║  │
│  ║                                              │                                                         ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝  │
│                                                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗  │
│  ║                                  USED LAPTOP SPECIFIC                                                 ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════╣  │
│  ║                                                                                                          ║  │
│  ║    ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐                            ║  │
│  ║    │  BUYBACK_ORDERS │       │ PRODUCT_HISTORY │       │  WARRANTY_CARDS │                            ║  │
│  ║    │  (Thu mua máy)  │       │ (Lịch sử máy)  │       │ (Bảo hành SN)  │                            ║  │
│  ║    └────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘                            ║  │
│  ║             │                          │                          │                                        ║  │
│  ║             │ 1:N                     │ N:1                      │ N:1                                    ║  │
│  ║             ▼                          │                          │                                        ║  │
│  ║    ┌──────────────────┐                │                          ▼                                        ║  │
│  ║    │ PRODUCT_UNITS ◄──┼────────────────┴──────────────────────────┘                                        ║  │
│  ║    └──────────────────┘                                                                                 ║  │
│  ║                                                                                                          ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝  │
│                                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## CHI TIẾT TỪNG BẢNG

### 1. USERS (Quản trị viên)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: users                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ email                   │ String        │ UNIQUE, NOT NULL                  │
│ password                │ String        │ NOT NULL                          │
│ name                    │ String        │ NOT NULL                          │
│ role                    │ String        │ ENUM: admin, superadmin           │
│ status                  │ String        │ ENUM: active, inactive            │
│ failedLoginAttempts     │ Number        │ DEFAULT: 0                        │
│ lockUntil               │ Date          │ NULLABLE                          │
│ lastLogin               │ Date          │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 2. EMPLOYEES (Nhân viên)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: employees                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ userId                  │ ObjectId      │ FK → users._id, NULLABLE          │
│ employeeCode            │ String        │ UNIQUE                            │
│ firstName               │ String        │ NOT NULL                          │
│ lastName                │ String        │ NOT NULL                          │
│ email                   │ String        │ UNIQUE, NULLABLE                  │
│ phone                   │ String        │ NOT NULL                          │
│ position                │ String        │ ENUM: manager, accountant, sales  │
│                         │               │     technician, warehouse_staff    │
│ department              │ String        │ ENUM: sales, technical            │
│                         │               │     warehouse, admin              │
│ salary                  │ Number        │ DEFAULT: 0                        │
│ hireDate                │ Date          │ NOT NULL                          │
│ status                  │ String        │ ENUM: working, resigned           │
│                         │               │     on_leave                       │
│ profileImage            │ String        │ NULLABLE                          │
│ address                 │ String        │ NULLABLE                          │
│ identityCard            │ String        │ NULLABLE                          │
│ birthday                │ Date          │ NULLABLE                          │
│ emergencyContact        │ Object        │ {name, phone, relation}           │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 3. CUSTOMERS (Khách hàng)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: customers                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ name                    │ String        │ NOT NULL                          │
│ phone                   │ String        │ UNIQUE, NOT NULL                  │
│ email                   │ String        │ NULLABLE                          │
│ address                 │ String        │ NULLABLE                          │
│ birthday                │ Date          │ NULLABLE                          │
│ gender                  │ String        │ ENUM: male, female               │
│ loyaltyPoints           │ Number        │ DEFAULT: 0                        │
│ totalSpent              │ Number        │ DEFAULT: 0                        │
│ totalOrders             │ Number        │ DEFAULT: 0                        │
│ customerType            │ String        │ ENUM: regular, vip                │
│ tags                    │ [String]      │ DEFAULT: ['New']                  │
│ status                  │ String        │ ENUM: active, blocked             │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { phone: 1 }
  { email: 1 }
```

### 4. PRODUCTS (Sản phẩm - Template)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: products                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ name                    │ String        │ NOT NULL                          │
│ model                   │ String        │ NOT NULL                          │
│ slug                    │ String        │ UNIQUE                            │
│ categoryId              │ ObjectId      │ FK → categories._id               │
│ brandId                 │ ObjectId      │ FK → brands._id                    │
│ price                   │ Number        │ NOT NULL                          │
│ costPrice               │ Number        │ DEFAULT: 0 (Giá vốn)             │
│ image                   │ String        │ NULLABLE                          │
│ images                  │ [String]      │ DEFAULT: []                       │
│ specs                   │ Object        │ {cpu, gpu, ram, ssd...}          │
│ warranty                │ Object        │ {duration, items}                 │
│ warrantyMonths         │ Number        │ DEFAULT: 12                       │
│ description             │ String        │ NULLABLE                          │
│ gift                    │ String        │ NULLABLE                          │
│ isUsed                  │ Boolean       │ DEFAULT: false                    │
│ condition               │ String        │ ENUM: new, like_new, good         │
│                         │               │     fair, poor (cho máy cũ)      │
│ usedGrade               │ String        │ ENUM: A, B, C (cho máy cũ)       │
│ conditionNote           │ String        │ NULLABLE (mô tả tình trạng)      │
│ status                  │ String        │ ENUM: active, inactive            │
│ averageRating           │ Number        │ DEFAULT: 0                        │
│ reviewCount             │ Number        │ DEFAULT: 0                        │
│ viewCount               │ Number        │ DEFAULT: 0                        │
│ isFeatured              │ Boolean       │ DEFAULT: false                   │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { categoryId: 1, brandId: 1, isUsed: 1 }
  { isUsed: 1, condition: 1 }
  { slug: 1 }
```

### 5. PRODUCT_UNITS (Serial Tracking - QUAN TRỌNG NHẤT)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: product_units  ключевой                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ productId               │ ObjectId      │ FK → products._id                 │
│ serialNumber            │ String        │ UNIQUE (QUAN TRỌNG)              │
│ barcode                 │ String        │ NULLABLE                          │
│ purchasePrice           │ Number        │ NOT NULL (giá nhập)               │
│ sellingPrice            │ Number        │ NOT NULL (giá bán)               │
│ condition               │ String        │ ENUM: like_new, good, fair       │
│ batteryHealth           │ Number        │ DEFAULT: 100 (%)                  │
│ batteryCycleCount       │ Number        │ DEFAULT: 0                        │
│ source                  │ String        │ ENUM: import, trade_in            │
│                         │               │     customer_sell                  │
│ supplierId              │ ObjectId      │ FK → suppliers._id, NULLABLE     │
│ warehouseId             │ ObjectId      │ FK → warehouses._id              │
│ purchaseDate            │ Date          │ NOT NULL                          │
│ warrantyStartDate       │ Date          │ NULLABLE                          │
│ warrantyEndDate         │ Date          │ NULLABLE                          │
│ status                  │ String        │ ENUM: available, reserved         │
│                         │               │     sold, service, returned       │
│ notes                   │ String        │ NULLABLE                          │
│ images                  │ [String]      │ DEFAULT: []                       │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { serialNumber: 1 }, { unique: true }
  { productId: 1, status: 1 }
  { status: 1, warehouseId: 1 }
  { warehouseId: 1 }
```

### 6. CATEGORIES (Danh mục)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: categories                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ name                    │ String        │ UNIQUE, NOT NULL                  │
│ slug                    │ String        │ UNIQUE, NOT NULL                  │
│ description             │ String        │ NULLABLE                          │
│ icon                    │ String        │ DEFAULT: 'Laptop'                 │
│ parentId                │ ObjectId      │ FK → categories._id, NULLABLE     │
│ sortOrder               │ Number        │ DEFAULT: 0                        │
│ isActive                │ Boolean       │ DEFAULT: true                     │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { parentId: 1, sortOrder: 1 }
```

### 7. BRANDS (Thương hiệu)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: brands                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ name                    │ String        │ UNIQUE, NOT NULL                  │
│ slug                    │ String        │ UNIQUE, NOT NULL                  │
│ logo                    │ String        │ NULLABLE                          │
│ description             │ String        │ NULLABLE                          │
│ country                 │ String        │ NULLABLE                          │
│ website                 │ String        │ NULLABLE                          │
│ isActive                │ Boolean       │ DEFAULT: true                     │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 8. SUPPLIERS (Nhà cung cấp)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: suppliers                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ supplierCode            │ String        │ UNIQUE                            │
│ name                    │ String        │ NOT NULL                          │
│ email                   │ String        │ NULLABLE                          │
│ phone                   │ String        │ NULLABLE                          │
│ address                 │ String        │ NULLABLE                          │
│ contactPerson           │ String        │ NULLABLE                          │
│ taxCode                 │ String        │ NULLABLE                          │
│ bankAccount             │ String        │ NULLABLE                          │
│ bankName                │ String        │ NULLABLE                          │
│ paymentTerm             │ Number        │ DEFAULT: 30                       │
│ totalDebt               │ Number        │ DEFAULT: 0                        │
│ rating                  │ Number        │ DEFAULT: 0, MIN: 0, MAX: 5        │
│ notes                   │ String        │ NULLABLE                          │
│ status                  │ String        │ ENUM: active, inactive            │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 9. WAREHOUSES (Kho hàng)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: warehouses                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ warehouseCode           │ String        │ UNIQUE                            │
│ name                    │ String        │ NOT NULL                          │
│ address                 │ String        │ NOT NULL                          │
│ managerId               │ ObjectId      │ FK → employees._id, NULLABLE     │
│ capacity                │ Number        │ DEFAULT: 1000                     │
│ currentStock            │ Number        │ DEFAULT: 0                         │
│ isDefault               │ Boolean       │ DEFAULT: false                    │
│ status                  │ String        │ ENUM: active, inactive            │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 10. ORDERS (Đơn hàng)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: orders                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ orderNumber             │ String        │ UNIQUE                            │
│ customerId              │ ObjectId      │ FK → customers._id                │
│ customerInfo            │ Object        │ {name, phone, email, address}     │
│ employeeId              │ ObjectId      │ FK → users._id (bán hàng)        │
│ items                   │ [Object]      │ NOT NULL                          │
│   └─ productId          │ ObjectId      │ FK → products._id               │
│   └─ productUnitId      │ ObjectId      │ FK → product_units._id          │
│   └─ name               │ String        │ NOT NULL                          │
│   └─ price              │ Number        │ NOT NULL                          │
│   └─ costPrice          │ Number        │ NOT NULL (giá vốn)               │
│   └─ quantity           │ Number        │ NOT NULL                          │
│   └─ image              │ String        │ NULLABLE                          │
│   └─ discount           │ Number        │ DEFAULT: 0                        │
│ subtotal                │ Number        │ NOT NULL                          │
│ discount                │ Number        │ DEFAULT: 0                        │
│ tax                     │ Number        │ DEFAULT: 0                        │
│ shippingFee             │ Number        │ DEFAULT: 0                        │
│ depositAmount           │ Number        │ DEFAULT: 0                        │
│ depositDate             │ Date          │ NULLABLE                          │
│ depositMethod           │ String        │ NULLABLE                          │
│ totalAmount             │ Number        │ NOT NULL                          │
│ paymentMethod           │ String        │ ENUM: cash, card, bank, qr        │
│ paymentStatus           │ String        │ ENUM: unpaid, paid                │
│ paymentDate             │ Date          │ NULLABLE                          │
│ customerType            │ String        │ ENUM: retail, wholesale           │
│ status                  │ String        │ ENUM: pending, confirmed          │
│                         │               │     processing, shipped            │
│                         │               │     delivered, cancelled           │
│ shippingAddress         │ String        │ NULLABLE                          │
│ shippingNote            │ String        │ NULLABLE                          │
│ deliveryDate            │ Date          │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { customerId: 1, createdAt: -1 }
  { status: 1, createdAt: -1 }
  { employeeId: 1, createdAt: -1 }
  { orderNumber: 1 }
```

### 11. TRANSACTIONS (Giao dịch tài chính)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: transactions                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ transactionType         │ String        │ ENUM: income, expense             │
│ category                │ String        │ ENUM: sale, purchase              │
│                         │               │     salary, utility                │
│                         │               │     marketing, other              │
│ amount                  │ Number        │ NOT NULL                          │
│ paymentMethod           │ String        │ ENUM: cash, card, bank            │
│ referenceType           │ String        │ ENUM: order, purchase             │
│                         │               │     salary, manual                │
│ referenceId            │ ObjectId      │ NULLABLE                          │
│ description             │ String        │ NULLABLE                          │
│ attachedFile            │ String        │ NULLABLE                          │
│ createdBy               │ ObjectId      │ FK → users._id                    │
│ transactionDate         │ Date          │ NOT NULL                          │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { transactionType: 1, transactionDate: -1 }
  { referenceType: 1, referenceId: 1 }
```

### 12. DEBTS (Công nợ - Fixed Design)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: debts                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ customerId              │ ObjectId      │ FK → customers._id, NULLABLE     │
│ supplierId              │ ObjectId      │ FK → suppliers._id, NULLABLE     │
│ orderId                 │ ObjectId      │ FK → orders._id, NULLABLE        │
│ purchaseOrderId         │ ObjectId      │ FK → purchase_orders._id         │
│                         │               │     NULLABLE                       │
│ debtType                │ String        │ ENUM: customer, supplier          │
│ totalAmount             │ Number        │ NOT NULL                          │
│ paidAmount              │ Number        │ DEFAULT: 0                        │
│ remainingAmount         │ Number        │ NOT NULL                          │
│ dueDate                 │ Date          │ NULLABLE                          │
│ status                  │ String        │ ENUM: pending, partial            │
│                         │               │     paid, overdue                 │
│ notes                   │ String        │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { customerId: 1, status: 1 }
  { supplierId: 1, status: 1 }
```

### 13. BUYBACK_ORDERS (Thu mua máy cũ)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: buyback_orders                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ buybackNumber           │ String        │ UNIQUE                            │
│ sellerName              │ String        │ NOT NULL                          │
│ sellerPhone             NOT NULL                          │
 │ String        ││ sellerIdNumber         │ String        │ NULLABLE                          │
│ sellerAddress           │ String        │ NULLABLE                          │
│ productInfo             │ Object        │ NOT NULL                          │
│   └─ brand              │ String        │                                   │
│   └─ model              │ String        │                                   │
│   └─ serialNumber       │ String        │                                   │
│   └─ condition          │ String        │                                   │
│   └─ specs              │ Object        │                                   │
│ buyPrice               │ Number        │ NOT NULL                          │
│ inspectionNotes        │ String        │ NULLABLE                          │
│ status                  │ String        │ ENUM: pending, approved           │
│                         │               │     paid, cancelled               │
│ inspectedBy             │ ObjectId      │ FK → employees._id, NULLABLE     │
│ approvedBy              │ ObjectId      │ FK → users._id, NULLABLE         │
│ paymentMethod           │ String        │ NULLABLE                          │
│ paidAt                  │ Date          │ NULLABLE                          │
│ createdBy               │ ObjectId      │ FK → users._id                    │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { buybackNumber: 1 }
  { status: 1, createdAt: -1 }
```

### 14. PRODUCT_HISTORY (Lịch sử từng máy)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: product_history                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ productUnitId           │ ObjectId      │ FK → product_units._id            │
│ eventType               │ String        │ ENUM: purchased, repaired         │
│                         │               │     sold, warranty_claimed         │
│                         │               │     condition_changed             │
│ eventDate               │ Date          │ NOT NULL                          │
│ description             │ String        │ NOT NULL                          │
│ relatedId               │ ObjectId      │ NULLABLE                          │
│ performedBy             │ ObjectId      │ FK → users._id, NULLABLE         │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { productUnitId: 1, eventDate: -1 }
```

### 15. WARRANTY_CARDS (Phiếu bảo hành)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: warranty_cards                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ warrantyNumber          │ String        │ UNIQUE                            │
│ productId               │ ObjectId      │ FK → products._id                 │
│ productUnitId           │ ObjectId      │ FK → product_units._id           │
│ orderId                 │ ObjectId      │ FK → orders._id, NULLABLE        │
│ customerId              │ ObjectId      │ FK → customers._id               │
│ productName             │ String        │ NOT NULL                          │
│ productModel            │ String        │ NOT NULL                          │
│ serialNumber            │ String        │ NOT NULL (QUAN TRỌNG)            │
│ purchaseDate            │ Date          │ NOT NULL                          │
│ warrantyStartDate       │ Date          │ NOT NULL                          │
│ warrantyEndDate         │ Date          │ NOT NULL                          │
│ warrantyMonths          │ Number        │ DEFAULT: 12                       │
│ warrantyType            │ String        │ ENUM: manufacturer, store        │
│ coverageDetails         │ Object        │ NULLABLE                          │
│ warrantyTerms           │ String        │ NULLABLE                          │
│ status                  │ String        │ ENUM: active, expired            │
│                         │               │     voided                        │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { serialNumber: 1 }
  { warrantyEndDate: 1 }
  { customerId: 1 }
```

### 16. SERVICES (Dịch vụ)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: services                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ serviceNumber           │ String        │ UNIQUE                            │
│ serviceType             │ String        │ ENUM: repair, cleaning            │
│                         │               │     upgrade, warranty             │
│ customerId              │ ObjectId      │ FK → customers._id                │
│ customerName            │ String        │ NOT NULL                          │
│ customerPhone           │ String        │ NOT NULL                          │
│ productInfo             │ Object        │ {name, brand, model, serial}      │
│ productUnitId           │ ObjectId      │ FK → product_units._id           │
│ technicianId            │ ObjectId      │ FK → employees._id, NULLABLE    │
│ status                  │ String        │ ENUM: received, diagnosing       │
│                         │               │     repairing, testing            │
│                         │               │     completed, delivered          │
│ priority                │ String        │ ENUM: low, normal, high          │
│ issueDescription        │ String        │ NOT NULL                          │
│ estimatedCost           │ Number        │ DEFAULT: 0                        │
│ actualCost              │ Number        │ DEFAULT: 0                        │
│ receivedDate            │ Date          │ NOT NULL                          │
│ completionDate          │ Date          │ NULLABLE                          │
│ deliveryDate            │ Date          │ NULLABLE                          │
│ warrantyPeriod          │ Number        │ DEFAULT: 0                        │
│ notes                   │ String        │ NULLABLE                          │
│ createdBy               │ ObjectId      │ FK → users._id                    │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { customerId: 1, status: 1 }
  { status: 1, priority: 1 }
```

### 17. SERVICE_ITEMS (Chi tiết dịch vụ)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: service_items                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ serviceId               │ ObjectId      │ FK → services._id                 │
│ itemName                │ String        │ NOT NULL                          │
│ issue                   │ String        │ NULLABLE                          │
│ solution                │ String        │ NULLABLE                          │
│ quantity                │ Number        │ DEFAULT: 1                         │
│ unitPrice               │ Number        │ DEFAULT: 0                         │
│ warrantyDays            │ Number        │ DEFAULT: 0                         │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 18. AUDIT_LOGS (Nhật ký thay đổi)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: audit_logs                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints                       │
├─────────────────────────┼───────────────┼───────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ collectionName          │ String        │ NOT NULL                          │
│ documentId              │ ObjectId      │ NOT NULL                          │
│ action                  │ String        │ ENUM: create, update, delete     │
│ changes                 │ Object        │ { before, after }                 │
│ userId                  │ ObjectId      │ FK → users._id                    │
│ ipAddress               │ String        │ NULLABLE                          │
│ userAgent               │ String        │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
Indexes:
  { collectionName: 1, documentId: 1 }
  { userId: 1, createdAt: -1 }
  { createdAt: -1 }
```

### 19-21. RETURNS (Hoàn trả)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: returns                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ returnNumber            │ String        │ UNIQUE                            │
│ orderId                 │ ObjectId      │ FK → orders._id                   │
│ customerId              │ ObjectId      │ FK → customers._id                │
│ returnType              │ String        │ ENUM: refund, exchange            │
│                         │               │     store_credit                  │
│ reason                  │ String        │ NOT NULL                          │
│ status                  │ String        │ ENUM: pending, approved          │
│                         │               │     rejected, processed           │
│ refundAmount            │ Number        │ DEFAULT: 0                        │
│ refundMethod           │ String        │ NULLABLE                          │
│ processedBy             │ ObjectId      │ FK → users._id, NULLABLE         │
│ processedAt             │ Date          │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: return_items                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ returnId                │ ObjectId      │ FK → returns._id                  │
│ productId               │ ObjectId      │ FK → products._id                 │
│ productUnitId           │ ObjectId      │ FK → product_units._id           │
│ quantity                │ Number        │ DEFAULT: 1                         │
│ reason                  │ String        │ NULLABLE                          │
│ condition               │ String        │ NULLABLE                          │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

### 22-23. NOTIFICATIONS & MARKETING
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: notifications                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ userId                  │ ObjectId      │ FK → users._id / customers._id    │
│ type                    │ String        │ ENUM: low_stock, warranty_expiring│
│                         │               │     service_overdue               │
│ title                   │ String        │ NOT NULL                          │
│ message                 │ String        │ NOT NULL                          │
│ data                    │ Object        │ NULLABLE                          │
│ isRead                  │ Boolean       │ DEFAULT: false                    │
│ scheduledAt             │ Date          │ NULLABLE                          │
│ sentAt                  │ Date          │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: loyalty_points                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ customerId              │ ObjectId      │ FK → customers._id                │
│ points                  │ Number        │ NOT NULL                          │
│ pointsType              │ String        │ ENUM: earned, redeemed            │
│ orderId                 │ ObjectId      │ FK → orders._id, NULLABLE        │
│ description             │ String        │ NOT NULL                          │
│ expiryDate              │ Date          │ NULLABLE                          │
│ createdAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: coupons                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ code                    │ String        │ UNIQUE, NOT NULL                  │
│ description             │ String        │ NULLABLE                          │
│ discountType            │ String        │ ENUM: percentage, fixed           │
│ discountValue           │ Number        │ NOT NULL                          │
│ minOrderAmount          │ Number        │ DEFAULT: 0                        │
│ maxDiscountAmount       │ Number        │ NULLABLE                          │
│ maxUses                 │ Number        │ DEFAULT: 1                         │
│ usedCount               │ Number        │ DEFAULT: 0                         │
│ validFrom               │ Date          │ NOT NULL                          │
│ validTo                 │ Date          │ NOT NULL                          │
│ isActive                │ Boolean       │ DEFAULT: true                      │
│ createdBy               │ ObjectId      │ FK → users._id                    │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLE: promotions                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                          │
│ name                    │ String        │ NOT NULL                          │
│ description             │ String        │ NULLABLE                          │
│ discountType            │ String        │ ENUM: percentage, fixed           │
│ discountValue           │ Number        │ NOT NULL                          │
│ giftProductId          │ ObjectId      │ FK → products._id, NULLABLE     │
│ minOrderAmount          │ Number        │ DEFAULT: 0                        │
│ applicableProducts      │ [ObjectId]    │ FK → products._id                │
│ applicableCategories    │ [ObjectId]    │ FK → categories._id              │
│ startDate               │ Date          │ NOT NULL                          │
│ endDate                 │ Date          │ NOT NULL                          │
│ isActive                │ Boolean       │ DEFAULT: true                      │
│ createdBy               │ ObjectId      │ FK → users._id                    │
│ createdAt               │ Date          │ auto                              │
│ updatedAt               │ Date          │ auto                              │
└─────────────────────────┴───────────────┴───────────────────────────────────┘
```

---

## TÓM TẮT SỐ LƯỢNG BẢNG

| STT | Tên Bảng | Trạng Thái | Mô Tả Quan Trọng |
|-----|----------|------------|------------------|
| 1 | users | ✅ Có | Admin/Staff |
| 2 | employees | 🆕 Mới | Nhân viên |
| 3 | customers | ⚠️ Cập nhật | Thêm birthday, gender, customerType |
| 4 | products | ⚠️ Cập nhật | **Thêm isUsed, condition, usedGrade** |
| 5 | **product_units** | 🆕 MỚI | **Serial tracking - QUAN TRỌNG NHẤT** |
| 6 | categories | ⚠️ Cập nhật | Thêm parentId |
| 7 | brands | ⚠️ Cập nhật | Thêm country |
| 8 | suppliers | 🆕 Mới | Nhà cung cấp |
| 9 | warehouses | 🆕 Mới | Kho hàng |
| 10 | orders | ⚠️ Cập nhật | **Thêm depositAmount, employeeId, costPrice** |
| 11 | transactions | 🆕 Mới | Giao dịch |
| 12 | debts | ⚠️ Fix Design | **Explicit FKs** |
| 13 | buyback_orders | 🆕 Mới | Thu mua máy cũ |
| 14 | product_history | 🆕 Mới | Lịch sử máy |
| 15 | warranty_cards | ⚠️ Cập nhật | **Thêm warrantyType, serialNumber** |
| 16 | services | 🆕 Mới | Dịch vụ |
| 17 | service_items | 🆕 Mới | Chi tiết dịch vụ |
| 18 | audit_logs | 🆕 Mới | Nhật ký thay đổi |
| 19 | returns | 🆕 Mới | Hoàn trả |
| 20 | return_items | 🆕 Mới | Chi tiết hoàn trả |
| 21 | notifications | 🆕 Mới | Thông báo |
| 22 | loyalty_points | 🆕 Mới | Tích điểm |
| 23 | coupons | 🆕 Mới | Mã giảm giá |
| 24 | promotions | 🆕 Mới | Khuyến mãi |

**TỔNG: 24 bảng**

---

## KEY RELATIONSHIPS

```
PRODUCTS (Template)
    │
    └── 1:N → PRODUCT_UNITS (Individual Items)
              │
              ├── 1:N → ORDER_ITEMS → ORDERS
              │                    │
              │                    ├── N:1 → CUSTOMERS
              │                    ├── N:1 → USERS (employeeId)
              │                    └── 1:N → TRANSACTIONS
              │
              ├── 1:N → PRODUCT_HISTORY
              │
              ├── 1:N → WARRANTY_CARDS
              │                   
              ├── N:1 → WAREHOUSES
              │
              ├── N:1 → SUPPLIERS (when purchased)
              │
              └── 1:N → SERVICES

BUYBACK_ORDERS
    │
    └── 1:N → PRODUCT_UNITS (after approved)
