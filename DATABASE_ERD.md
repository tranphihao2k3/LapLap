# DATABASE ERD - LapLap Store Management System

## Tổng Quan Hệ Thống

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    LAPLAP DATABASE ARCHITECTURE                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                             │
│  ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐                              │
│  │     USERS        │       │    EMPLOYEES     │       │    CUSTOMERS    │                              │
│  │  (Admin/Staff)   │       │  (Store Staff)   │       │   (Buyers)      │                              │
│  └────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘                              │
│           │                          │                          │                                          │
│           │ 1:N                     │ 1:N                     │ 1:N                                      │
│           ▼                          ▼                          ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                        ORDERS                                                        │   │
│  │  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │ orderId, customerId, employeeId, totalAmount, status, paymentMethod, isPaid, createdAt    │  │   │
│  │  └──────────────────────────────────────────────────────────────────────────────────────────────┘  │   │
│  │                    │                                    │                                          │   │
│  │                    │ 1:N                                │ 1:N                                      │   │
│  │                    ▼                                    ▼                                          │   │
│  │  ┌─────────────────────────┐              ┌─────────────────────────────────────────────┐        │   │
│  │  │      ORDER_ITEMS       │              │          TRANSACTIONS (Payments)           │        │   │
│  │  │ productId, quantity,   │              │ type, amount, paymentMethod, status, date   │        │   │
│  │  │ price, name, image     │              └─────────────────────────────────────────────┘        │   │
│  │  └─────────────────────────┘                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                    │                                                                                         │
│                    │ N:1                                                                                    │
│                    ▼                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                    PRODUCTS                                                           │   │
│  │  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │ productId, name, slug, categoryId, brandId, price, image, specs, warranty, status, stock    │  │   │
│  │  └──────────────────────────────────────────────────────────────────────────────────────────────┘  │   │
│  │                    │                                    │                         │               │   │
│  │                    │ N:1                                │ N:1                     │ N:1           │   │
│  │                    ▼                                    ▼                         ▼               │   │
│  │  ┌─────────────────────┐              ┌─────────────────────┐      ┌─────────────────────┐       │   │
│  │  │    CATEGORIES       │              │       BRANDS        │      │    SUPPLIERS        │       │   │
│  │  │ name, slug, icon    │              │ name, slug, logo    │      │ name, code, contact│       │   │
│  │  └─────────────────────┘              └─────────────────────┘      └──────────┬──────────┘       │   │
│  │                                                                        │                          │   │
│  │                                                                        │ 1:N                     │   │
│  │                                                                        ▼                          │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │   │
│  │  │                              PURCHASE ORDERS (Nhập hàng)                                     │   │   │
│  │  │  supplierId, orderDate, expectedDate, totalAmount, status, createdBy                      │   │   │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                    │                                                                                   │   │
│  │                    │ 1:N                                                                              │   │
│  │                    ▼                                                                                   │   │
│  │  ┌─────────────────────────┐                                                                     │   │
│  │  │   PURCHASE ORDER ITEMS  │                                                                     │   │
│  │  │ productId, quantity,    │                                                                     │   │
│  │  │ unitPrice, receivedQty  │                                                                     │   │
│  │  └─────────────────────────┘                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## CHI TIẾT TỪNG BẢNG (TABLE DEFINITIONS)

### 1. USERS (Quản trị viên)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: users                                                            │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ email                   │ String        │ UNIQUE, NOT NULL          │
│ password                │ String        │ NOT NULL                  │
│ name                    │ String        │ NOT NULL                  │
│ role                    │ String        │ ENUM: admin, superadmin   │
│ status                  │ String        │ ENUM: active, inactive   │
│ failedLoginAttempts     │ Number        │ DEFAULT: 0                │
│ lockUntil               │ Date          │ NULLABLE                  │
│ lastLogin               │ Date          │ NULLABLE                  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 2. EMPLOYEES (Nhân viên)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: employees                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ userId                  │ ObjectId      │ FK → users._id, NULLABLE │
│ employeeCode            │ String        │ UNIQUE                    │
│ firstName               │ String        │ NOT NULL                  │
│ lastName                │ String        │ NOT NULL                  │
│ email                   │ String        │ UNIQUE, NULLABLE         │
│ phone                   │ String        │ NOT NULL                  │
│ position                │ String        │ ENUM: manager, accountant│
│                         │               │     sales, technician    │
│                         │               │     warehouse_staff       │
│ department              │ String        │ ENUM: sales, technical    │
│                         │               │     warehouse, admin      │
│ salary                  │ Number        │ DEFAULT: 0                │
│ hireDate                │ Date          │ NOT NULL                  │
│ status                  │ String        │ ENUM: working, resigned   │
│                         │               │     on_leave              │
│ profileImage            │ String        │ NULLABLE                  │
│ address                 │ String        │ NULLABLE                  │
│ identityCard            │ String        │ NULLABLE                  │
│ birthday                │ Date          │ NULLABLE                  │
│ emergencyContact       │ Object        │ {name, phone, relation}  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 3. EMPLOYEE_SCHEDULES (Lịch làm việc)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: employee_schedules                                             │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ employeeId              │ ObjectId      │ FK → employees._id       │
│ date                    │ Date          │ NOT NULL                  │
│ shift                   │ String        │ ENUM: morning, afternoon  │
│                         │               │     evening, full_day     │
│ startTime               │ String        │ NOT NULL (HH:MM)         │
│ endTime                 │ String        │ NOT NULL (HH:MM)         │
│ checkIn                 │ Date          │ NULLABLE                 │
│ checkOut                │ Date          │ NULLABLE                 │
│ status                  │ String        │ ENUM: scheduled, checked │
│                         │               │     absent, late          │
│ notes                   │ String        │ NULLABLE                 │
│ createdAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 4. EMPLOYEE_ATTENDANCE (Bảng công)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: employee_attendances                                           │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ employeeId              │ ObjectId      │ FK → employees._id       │
│ month                   │ Number        │ NOT NULL (1-12)          │
│ year                    │ Number        │ NOT NULL                  │
│ workDays                │ Number        │ DEFAULT: 0                │
│ absentDays              │ Number        │ DEFAULT: 0                │
│ lateDays                │ Number        │ DEFAULT: 0                │
│ overtimeHours           │ Number        │ DEFAULT: 0                │
│ totalWorkHours          │ Number        │ DEFAULT: 0                │
│ notes                   │ String        │ NULLABLE                 │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 5. EMPLOYEE_SALARY (Lương & Thưởng)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: employee_salaries                                              │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ employeeId              │ ObjectId      │ FK → employees._id       │
│ month                   │ Number        │ NOT NULL                  │
│ year                    │ Number        │ NOT NULL                  │
│ baseSalary              │ Number        │ NOT NULL                  │
│ overtimePay             │ Number        │ DEFAULT: 0                │
│ bonus                   │ Number        │ DEFAULT: 0                │
│ commission              │ Number        │ DEFAULT: 0                │
│ deduction               │ Number        │ DEFAULT: 0                │
│ tax                     │ Number        │ DEFAULT: 0                │
│ totalSalary             │ Number        │ NOT NULL                  │
│ paymentStatus           │ String        │ ENUM: pending, paid      │
│ paymentDate             │ Date          │ NULLABLE                  │
│ paidBy                  │ ObjectId      │ FK → users._id           │
│ notes                   │ String        │ NULLABLE                 │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 6. CUSTOMERS (Khách hàng)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: customers                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ NOT NULL                  │
│ phone                   │ String        │ UNIQUE, NOT NULL          │
│ email                   │ String        │ NULLABLE                  │
│ address                 │ String        │ NULLABLE                  │
│ birthday                │ Date          │ NULLABLE                  │
│ gender                  │ String        │ ENUM: male, female        │
│ loyaltyPoints           │ Number        │ DEFAULT: 0                │
│ totalSpent              │ Number        │ DEFAULT: 0                │
│ totalOrders             │ Number        │ DEFAULT: 0                │
│ customerType            │ String        │ ENUM: regular, vip        │
│ tags                    │ [String]      │ DEFAULT: ['New']          │
│ status                  │ String        │ ENUM: active, blocked    │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 7. PRODUCTS (Sản phẩm - Laptop)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: products                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ NOT NULL                  │
│ model                   │ String        │ NOT NULL                  │
│ slug                    │ String        │ UNIQUE                    │
│ categoryId              │ ObjectId      │ FK → categories._id      │
│ brandId                 │ ObjectId      │ FK → brands._id           │
│ price                   │ Number        │ NOT NULL                  │
│ costPrice               │ Number        │ DEFAULT: 0 (Giá vốn)     │
│ image                   │ String        │ NULLABLE                  │
│ images                  │ [String]      │ DEFAULT: []               │
│ specs                   │ Object        │ {cpu, gpu, ram, ssd...}  │
│ warranty                │ Object        │ {duration, items}        │
│ warrantyMonths         │ Number        │ DEFAULT: 12               │
│ description             │ String        │ NULLABLE                  │
│ gift                    │ String        │ NULLABLE (Quà tặng)      │
│ status                  │ String        │ ENUM: active, inactive   │
│ averageRating           │ Number        │ DEFAULT: 0                │
│ reviewCount             │ Number        │ DEFAULT: 0                │
│ viewCount               │ Number        │ DEFAULT: 0                │
│ isFeatured              │ Boolean       │ DEFAULT: false           │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 8. CATEGORIES (Danh mục)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: categories                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ UNIQUE, NOT NULL          │
│ slug                    │ String        │ UNIQUE, NOT NULL          │
│ description             │ String        │ NULLABLE                  │
│ icon                    │ String        │ DEFAULT: 'Laptop'        │
│ parentId                │ ObjectId      │ FK → categories._id       │
│ sortOrder               │ Number        │ DEFAULT: 0               │
│ isActive                │ Boolean       │ DEFAULT: true            │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 9. BRANDS (Thương hiệu)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: brands                                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ UNIQUE, NOT NULL          │
│ slug                    │ String        │ UNIQUE, NOT NULL          │
│ logo                    │ String        │ NULLABLE                  │
│ description             │ String        │ NULLABLE                  │
│ country                 │ String        │ NULLABLE                  │
│ website                 │ String        │ NULLABLE                  │
│ isActive                │ Boolean       │ DEFAULT: true            │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 10. SUPPLIERS (Nhà cung cấp)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: suppliers                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ supplierCode            │ String        │ UNIQUE                    │
│ name                    │ String        │ NOT NULL                  │
│ email                   │ String        │ NULLABLE                  │
│ phone                   │ String        │ NULLABLE                  │
│ address                 │ String        │ NULLABLE                  │
│ contactPerson           │ String        │ NULLABLE                  │
│ taxCode                 │ String        │ NULLABLE (Mã số thuế)    │
│ bankAccount             │ String        │ NULLABLE                  │
│ bankName                │ String        │ NULLABLE                  │
│ paymentTerm             │ Number        │ DEFAULT: 30 (ngày)       │
│ totalDebt               │ Number        │ DEFAULT: 0               │
│ rating                  │ Number        │ DEFAULT: 0, MIN:0, MAX:5 │
│ notes                   │ String        │ NULLABLE                  │
│ status                  │ String        │ ENUM: active, inactive   │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 11. WAREHOUSES (Kho hàng)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: warehouses                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ warehouseCode           │ String        │ UNIQUE                    │
│ name                    │ String        │ NOT NULL                  │
│ address                 │ String        │ NOT NULL                  │
│ managerId               │ ObjectId      │ FK → employees._id       │
│ capacity                │ Number        │ DEFAULT: 1000            │
│ currentStock            │ Number        │ DEFAULT: 0               │
│ isDefault               │ Boolean       │ DEFAULT: false           │
│ status                  │ String        │ ENUM: active, inactive   │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 12. INVENTORIES (Tồn kho)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: inventories                                                   │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ productId               │ ObjectId      │ FK → products._id       │
│ warehouseId             │ ObjectId      │ FK → warehouses._id      │
│ quantity                │ Number        │ DEFAULT: 0               │
│ reservedQuantity        │ Number        │ DEFAULT: 0               │
│ availableQuantity       │ Number        │ DEFAULT: 0 (computed)    │
│ minStock                │ Number        │ DEFAULT: 5               │
│ maxStock                │ Number        │ DEFAULT: 100             │
│ reorderPoint            │ Number        │ DEFAULT: 10              │
│ lastRestocked           │ Date          │ NULLABLE                  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 13. STOCK_TRANSACTIONS (Giao dịch kho)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: stock_transactions                                            │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ transactionType         │ String        │ ENUM: purchase, return   │
│                         │               │     sale, adjustment      │
│ productId              │ ObjectId      │ FK → products._id        │
│ warehouseId             │ ObjectId      │ FK → warehouses._id      │
│ quantity                │ Number        │ NOT NULL                  │
│ unitCost                │ Number        │ NULLABLE                  │
│ totalCost               │ Number        │ NULLABLE                  │
│ referenceType           │ String        │ ENUM: purchase_order     │
│                         │               │     order, manual        │
│ referenceId            │ ObjectId      │ NULLABLE                  │
│ note                    │ String        │ NULLABLE                  │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ createdAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 14. PURCHASE_ORDERS (Đơn nhập hàng)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: purchase_orders                                                │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ orderNumber             │ String        │ UNIQUE                    │
│ supplierId              │ ObjectId      │ FK → suppliers._id       │
│ orderDate               │ Date          │ NOT NULL                  │
│ expectedDate            │ Date          │ NULLABLE                  │
│ deliveryDate            │ Date          │ NULLABLE                  │
│ totalAmount             │ Number        │ DEFAULT: 0               │
│ discount                │ Number        │ DEFAULT: 0               │
│ tax                     │ Number        │ DEFAULT: 0               │
│ paidAmount              │ Number        │ DEFAULT: 0               │
│ paymentStatus           │ String        │ ENUM: unpaid, partial     │
│                         │               │     paid                  │
│ status                  │ String        │ ENUM: draft, ordered     │
│                         │               │     partially_received   │
│                         │               │     received, cancelled  │
│ notes                   │ String        │ NULLABLE                  │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ approvedBy              │ ObjectId      │ FK → users._id          │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 15. PURCHASE_ORDER_ITEMS (Chi tiết đơn nhập)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: purchase_order_items                                           │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ purchaseOrderId         │ ObjectId      │ FK → purchase_orders._id │
│ productId               │ ObjectId      │ FK → products._id        │
│ productName             │ String        │ NOT NULL                  │
│ quantity                │ Number        │ NOT NULL                  │
│ unitPrice               │ Number        │ NOT NULL                  │
│ discount                │ Number        │ DEFAULT: 0               │
│ totalPrice              │ Number        │ NOT NULL                  │
│ receivedQuantity        │ Number        │ DEFAULT: 0               │
│ status                  │ String        │ ENUM: pending, received  │
│                         │               │     partially_received    │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 16. ORDERS (Đơn hàng)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: orders                                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ orderNumber             │ String        │ UNIQUE                    │
│ customerId              │ ObjectId      │ FK → customers._id       │
│ customerInfo            │ Object        │ {name, phone, email, addr}│
│ employeeId              │ ObjectId      │ FK → users._id (bán hàng)│
│ items                   │ [Object]      │ NOT NULL                 │
│   └─ productId          │ ObjectId      │ FK → products._id       │
│   └─ name               │ String        │ NOT NULL                 │
│   └─ price              │ Number        │ NOT NULL                 │
│   └─ quantity           │ Number        │ NOT NULL                 │
│   └─ image              │ String        │ NULLABLE                 │
│ subtotal                │ Number        │ NOT NULL                  │
│ discount                │ Number        │ DEFAULT: 0               │
│ tax                     │ Number        │ DEFAULT: 0               │
│ shippingFee             │ Number        │ DEFAULT: 0               │
│ totalAmount             │ Number        │ NOT NULL                  │
│ paymentMethod           │ String        │ ENUM: cash, card, bank   │
│ paymentStatus           │ String        │ ENUM: unpaid, paid       │
│ paymentDate             │ Date          │ NULLABLE                  │
│ status                  │ String        │ ENUM: pending, confirmed │
│                         │               │     processing, shipped  │
│                         │               │     delivered, cancelled  │
│ shippingAddress         │ String        │ NULLABLE                  │
│ shippingNote            │ String        │ NULLABLE                  │
│ deliveryDate            │ Date          │ NULLABLE                  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 17. TRANSACTIONS (Giao dịch tài chính)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: transactions                                                  │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ transactionType         │ String        │ ENUM: income, expense    │
│ category                │ String        │ ENUM: sale, purchase     │
│                         │               │     salary, utility       │
│                         │               │     marketing, other     │
│ amount                  │ Number        │ NOT NULL                  │
│ paymentMethod           │ String        │ ENUM: cash, card, bank   │
│ referenceType           │ String        │ ENUM: order, purchase    │
│                         │               │     salary, manual       │
│ referenceId            │ ObjectId      │ NULLABLE                  │
│ description             │ String        │ NULLABLE                  │
│ attachedFile            │ String        │ NULLABLE                  │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ transactionDate         │ Date          │ NOT NULL                  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 18. DEBTS (Công nợ)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: debts                                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ debtType                │ String        │ ENUM: customer, supplier │
│ referenceId             │ ObjectId      │ FK → customers._id hoặc  │
│                         │               │     suppliers._id         │
│ totalAmount             │ Number        │ NOT NULL                  │
│ paidAmount              │ Number        │ DEFAULT: 0               │
│ remainingAmount         │ Number        │ NOT NULL                  │
│ dueDate                 │ Date          │ NULLABLE                  │
│ status                  │ String        │ ENUM: pending, partial   │
│                         │               │     paid, overdue        │
│ notes                   │ String        │ NULLABLE                  │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 19. SERVICES (Dịch vụ - Sửa chữa/Vệ sinh/Nâng cấp)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: services                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ serviceNumber           │ String        │ UNIQUE                    │
│ serviceType             │ String        │ ENUM: repair, cleaning   │
│                         │               │     upgrade, warranty     │
│ customerId              │ ObjectId      │ FK → customers._id       │
│ customerName            │ String        │ NOT NULL                  │
│ customerPhone           │ String        │ NOT NULL                  │
│ productInfo             │ Object        │ {name, brand, model,      │
│                         │               │  serial, condition}       │
│ technicianId            │ ObjectId      │ FK → employees._id       │
│ status                  │ String        │ ENUM: received, diagnosing│
│                         │               │     repairing, testing   │
│                         │               │     completed, delivered  │
│ priority                │ String        │ ENUM: low, normal, high  │
│ issueDescription        │ String        │ NOT NULL                  │
│ estimatedCost           │ Number        │ DEFAULT: 0               │
│ actualCost              │ Number        │ DEFAULT: 0               │
│ receivedDate            │ Date          │ NOT NULL                  │
│ completionDate          │ Date          │ NULLABLE                  │
│ deliveryDate            │ Date          │ NULLABLE                  │
│ warrantyPeriod         │ Number        │ DEFAULT: 0 (ngày)        │
│ notes                   │ String        │ NULLABLE                  │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 20. SERVICE_ITEMS (Chi tiết dịch vụ)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: service_items                                                  │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ serviceId               │ ObjectId      │ FK → services._id         │
│ itemName                │ String        │ NOT NULL                  │
│ issue                   │ String        │ NULLABLE                  │
│ solution                │ String        │ NULLABLE                  │
│ quantity                │ Number        │ DEFAULT: 1               │
│ unitPrice               │ Number        │ DEFAULT: 0               │
│ warrantyDays            │ Number        │ DEFAULT: 0               │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 21. WARRANTY_CARDS (Phiếu bảo hành)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: warranty_cards                                                │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ warrantyNumber          │ String        │ UNIQUE                    │
│ productId               │ ObjectId      │ FK → products._id         │
│ orderId                 │ ObjectId      │ FK → orders._id          │
│ customerId              │ ObjectId      │ FK → customers._id       │
│ productName             │ String        │ NOT NULL                  │
│ productModel            │ String        │ NOT NULL                  │
│ serialNumber            │ String        │ NULLABLE                  │
│ purchaseDate            │ Date          │ NOT NULL                  │
│ warrantyStartDate       │ Date          │ NOT NULL                  │
│ warrantyEndDate         │ Date          │ NOT NULL                  │
│ warrantyMonths          │ Number        │ DEFAULT: 12               │
│ warrantyTerms           │ String        │ NULLABLE                  │
│ status                  │ String        │ ENUM: active, expired,    │
│                         │               │     voided                │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 22. REVIEWS (Đánh giá)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: reviews                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ productId               │ ObjectId      │ FK → products._id        │
│ customerId              │ ObjectId      │ FK → customers._id       │
│ customerName            │ String        │ NOT NULL                  │
│ rating                  │ Number        │ NOT NULL, MIN:1, MAX:5  │
│ title                   │ String        │ NULLABLE                  │
│ comment                 │ String        │ NOT NULL                  │
│ images                  │ [String]      │ DEFAULT: []              │
│ pros                    │ [String]      │ NULLABLE                  │
│ cons                    │ [String]      │ NULLABLE                  │
│ status                  │ String        │ ENUM: pending, approved  │
│                         │               │     rejected              │
│ isVerifiedPurchase     │ Boolean       │ DEFAULT: false           │
│ helpfulCount            │ Number        │ DEFAULT: 0               │
│ reply                   │ Object        │ {content, repliedAt,     │
│                         │               │  repliedBy}               │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 23. LOYALTY_POINTS (Tích điểm)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: loyalty_points                                                │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ customerId              │ ObjectId      │ FK → customers._id       │
│ points                  │ Number        │ NOT NULL                  │
│ pointsType              │ String        │ ENUM: earned, redeemed   │
│ orderId                 │ ObjectId      │ FK → orders._id, NULLABLE│
│ description             │ String        │ NOT NULL                  │
│ expiryDate              │ Date          │ NULLABLE                  │
│ createdAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 24. COUPONS (Mã giảm giá)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: coupons                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ code                    │ String        │ UNIQUE, NOT NULL          │
│ description             │ String        │ NULLABLE                  │
│ discountType            │ String        │ ENUM: percentage, fixed   │
│ discountValue           │ Number        │ NOT NULL                  │
│ minOrderAmount          │ Number        │ DEFAULT: 0               │
│ maxDiscountAmount       │ Number        │ NULLABLE                  │
│ maxUses                 │ Number        │ DEFAULT: 1               │
│ usedCount               │ Number        │ DEFAULT: 0               │
│ usedByCustomers         │ [ObjectId]    │ FK → customers._id       │
│ validFrom               │ Date          │ NOT NULL                  │
│ validTo                 │ Date          │ NOT NULL                  │
│ isActive                │ Boolean       │ DEFAULT: true            │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 25. PROMOTIONS (Khuyến mãi)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: promotions                                                   │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ NOT NULL                  │
│ description             │ String        │ NULLABLE                  │
│ discountType            │ String        │ ENUM: percentage, fixed   │
│ discountValue           │ Number        │ NOT NULL                  │
│ discountAmount          │ Number        │ DEFAULT: 0 (giảm tiền)   │
│ giftProductId          │ ObjectId      │ FK → products._id, NULL   │
│ minOrderAmount          │ Number        │ DEFAULT: 0               │
│ applicableProducts      │ [ObjectId]    │ FK → products._id       │
│ applicableCategories    │ [ObjectId]    │ FK → categories._id     │
│ startDate               │ Date          │ NOT NULL                  │
│ endDate                 │ Date          │ NOT NULL                  │
│ isActive                │ Boolean       │ DEFAULT: true            │
│ createdBy               │ ObjectId      │ FK → users._id          │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 26. BLOGS (Tin tức)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: blogs                                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ title                   │ String        │ NOT NULL                  │
│ slug                    │ String        │ UNIQUE, NOT NULL          │
│ excerpt                 │ String        │ NULLABLE                  │
│ content                 │ String        │ NOT NULL                  │
│ featuredImage           │ String        │ NULLABLE                  │
│ author                  │ String        │ DEFAULT: 'LapLap Team'    │
│ tags                    │ [String]      │ DEFAULT: []              │
│ category                │ String        │ NULLABLE                  │
│ metaTitle               │ String        │ NULLABLE                  │
│ metaDescription         │ String        │ NULLABLE                  │
│ status                  │ String        │ ENUM: draft, published   │
│ publishedAt             │ Date          │ NULLABLE                  │
│ viewCount               │ Number        │ DEFAULT: 0               │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 27. POPUP_BANNERS (Banner quảng cáo)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: popup_banners                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ title                   │ String        │ NOT NULL                  │
│ image                   │ String        │ NOT NULL                  │
│ link                    │ String        │ NULLABLE                  │
│ target                  │ String        │ ENUM: _self, _blank       │
│ position                │ String        │ ENUM: center, bottom-left  │
│                         │               │     bottom-right          │
│ startDate               │ Date          │ NOT NULL                  │
│ endDate                 │ Date          │ NOT NULL                  │
│ isActive                │ Boolean       │ DEFAULT: true            │
│ showOnce                │ Boolean       │ DEFAULT: false           │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 28. COMPONENTS (Linh kiện/Phụ kiện)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: components                                                    │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ name                    │ String        │ NOT NULL                  │
│ type                    │ String        │ ENUM: RAM, SSD, MOUSE     │
│                         │               │     KEYBOARD, SCREEN       │
│                         │               │     BATTERY, CHARGER       │
│                         │               │     OTHER                  │
│ brand                   │ String        │ NULLABLE                  │
│ model                   │ String        │ NULLABLE                  │
│ specs                   │ Object        │ NULLABLE                  │
│ price                   │ Number        │ NOT NULL                  │
│ costPrice               │ Number        │ DEFAULT: 0               │
│ image                   │ String        │ NULLABLE                  │
│ stock                   │ Number        │ DEFAULT: 0               │
│ description             │ String        │ NULLABLE                  │
│ status                  │ String        │ ENUM: active, inactive   │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 29. SOFTWARE (Phần mềm)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: software                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ title                   │ String        │ NOT NULL                  │
│ slug                    │ String        │ UNIQUE, NOT NULL          │
│ excerpt                 │ String        │ NULLABLE                  │
│ content                 │ String        │ NOT NULL                  │
│ featuredImage           │ String        │ NULLABLE                  │
│ downloadUrl             │ String        │ NULLABLE                  │
│ version                 │ String        │ NULLABLE                  │
│ developer               │ String        │ NULLABLE                  │
│ category                │ String        │ DEFAULT: 'Tiện ích'       │
│ fileSize                │ String        │ NULLABLE                  │
│ platform                │ String        │ DEFAULT: 'Windows'        │
│ type                    │ String        │ ENUM: Free, Trial        │
│                         │               │     Crack, License       │
│                         │               │     Repack, Portable     │
│ tags                    │ [String]      │ DEFAULT: []              │
│ views                   │ Number        │ DEFAULT: 0               │
│ status                  │ String        │ ENUM: draft, published   │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

### 30. VISITORS (Thống kê truy cập)
```
┌────────────────────────────────────────────────────────────────────────┐
│ TABLE: visitors                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Column                  │ Type          │ Constraints               │
├─────────────────────────┼───────────────┼───────────────────────────┤
│ _id                     │ ObjectId      │ PK, auto                  │
│ date                    │ Date          │ UNIQUE (daily)            │
│ pageViews               │ Number        │ DEFAULT: 0               │
│ uniqueVisitors         │ Number        │ DEFAULT: 0               │
│ bounceRate              │ Number        │ DEFAULT: 0               │
│ avgSessionDuration     │ Number        │ DEFAULT: 0 (seconds)      │
│ topPages                │ [Object]      │ DEFAULT: []              │
│ trafficSources         │ Object        │ DEFAULT: {}              │
│ createdAt               │ Date          │ auto                      │
│ updatedAt               │ Date          │ auto                      │
└─────────────────────────┴───────────────┴───────────────────────────┘
```

---

## TÓM TẮT SỐ LƯỢNG BẢNG

| STT | Tên Bảng | Mô Tả | Trạng Thái |
|-----|----------|-------|------------|
| 1 | users | Quản trị viên | ✅ Hiện có |
| 2 | employees | Nhân viên | 🆕 Mới |
| 3 | employee_schedules | Lịch làm việc | 🆕 Mới |
| 4 | employee_attendances | Bảng công | 🆕 Mới |
| 5 | employee_salaries | Lương & thưởng | 🆕 Mới |
| 6 | customers | Khách hàng | ✅ Hiện có |
| 7 | products | Sản phẩm | ✅ Hiện có |
| 8 | categories | Danh mục | ✅ Hiện có |
| 9 | brands | Thương hiệu | ✅ Hiện có |
| 10 | suppliers | Nhà cung cấp | 🆕 Mới |
| 11 | warehouses | Kho hàng | 🆕 Mới |
| 12 | inventories | Tồn kho | 🆕 Mới |
| 13 | stock_transactions | Giao dịch kho | 🆕 Mới |
| 14 | purchase_orders | Đơn nhập hàng | 🆕 Mới |
| 15 | purchase_order_items | Chi tiết nhập hàng | 🆕 Mới |
| 16 | orders | Đơn hàng | ✅ Hiện có |
| 17 | transactions | Giao dịch tài chính | 🆕 Mới |
| 18 | debts | Công nợ | 🆕 Mới |
| 19 | services | Dịch vụ | 🆕 Mới |
| 20 | service_items | Chi tiết dịch vụ | 🆕 Mới |
| 21 | warranty_cards | Phiếu bảo hành | 🆕 Mới |
| 22 | reviews | Đánh giá | ✅ Hiện có |
| 23 | loyalty_points | Tích điểm | 🆕 Mới |
| 24 | coupons | Mã giảm giá | 🆕 Mới |
| 25 | promotions | Khuyến mãi | 🆕 Mới |
| 26 | blogs | Tin tức | ✅ Hiện có |
| 27 | popup_banners | Banner quảng cáo | ✅ Hiện có |
| 28 | components | Linh kiện phụ kiện | ✅ Hiện có |
| 29 | software | Phần mềm | ✅ Hiện có |
| 30 | visitors | Thống kê truy cập | ✅ Hiện có |

**Tổng cộng: 30 bảng**
- ✅ Hiện có: 13 bảng
- 🆕 Mới: 17 bảng
