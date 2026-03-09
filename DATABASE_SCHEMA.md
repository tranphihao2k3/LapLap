# Danh sách các bảng Database (Mongoose Models) - Dự án LapLap

Tài liệu này tổng hợp cấu trúc các bảng dữ liệu (Collections) hiện có trong dự án LapLap, được xây dựng trên nền tảng **MongoDB** sử dụng **Mongoose**.

---

## 1. Nhóm Sản phẩm & Thương hiệu (Core Products)

### `Product`
Quản lý thông tin chung của sản phẩm (Laptop, linh kiện).
- `name`, `model`, `slug`: Thông tin định danh.
- `categoryId`, `brandId`: Liên kết danh mục và thương hiệu.
- `price`, `costPrice`: Giá bán và giá vốn.
- `specs`: Cấu hình chi tiết (CPU, GPU, RAM, SSD, màn hình...).
- `isUsed`, `condition`: Phân loại máy mới/cũ và tình trạng.
- `isFeatured`: Đánh dấu sản phẩm nổi bật.
- `status`: `active` | `inactive`.

### `Category`
Danh mục sản phẩm đa cấp.
- `name`, `slug`: Tên và đường dẫn.
- `parentId`: Liên kết danh mục cha (để tạo menu đa cấp).
- `sortOrder`: Thứ tự hiển thị.
- `metaTitle`, `metaDescription`: Hỗ trợ SEO.

### `Brand`
Thương hiệu sản phẩm.
- `name`, `slug`, `logo`.
- `description`, `country`, `website`.

### `ProductUnit` (Sản phẩm cụ thể - Serial Number)
Quản lý từng máy lẻ dựa trên số Serial/IMEI.
- `productId`: Liên kết với model sản phẩm.
- `serialNumber`, `barcode`: Mã định danh duy nhất của từng máy.
- `purchasePrice`, `sellingPrice`: Giá nhập/bán thực tế của máy đó.
- `status`: `available`, `reserved`, `sold`, `service`, `returned`, `scrapped`.
- `batteryHealth`, `batteryCycleCount`: Tình trạng pin (cho máy cũ).
- `warrantyEndDate`: Ngày hết hạn bảo hành.

### `ProductHistory`
Ghi lại lịch sử thay đổi thông tin sản phẩm (giá, cấu hình).

---

## 2. Nhóm Bán hàng & Khách hàng

### `Customer`
Thông tin khách hàng thân thiết.
- `name`, `phone`, `email`, `address`.
- `customerType`: `regular` | `vip`.
- `loyaltyPoints`, `totalSpent`, `totalOrders`: Thống kê mua hàng.

### `Order`
Thông tin đơn hàng bán lẻ.
- `orderNumber`: Mã đơn hàng duy nhất.
- `customer`: Thông tin khách hàng (nhập tay hoặc liên kết `customerId`).
- `items`: Danh sách sản phẩm (nhúng `OrderItemSchema`).
- `subtotal`, `discount`, `totalAmount`.
- `status`: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`.
- `paymentMethod`: `cash`, `bank`, `card`, `qr`.

### `Coupon` & `Promotion`
- `Coupon`: Mã giảm giá nhập tay.
- `Promotion`: Chương trình giảm giá tự động áp dụng theo điều kiện.

### `Review`
Đánh giá sản phẩm từ người dùng (Rating + Nội dung).

### `Shipping`
Quản lý vận đơn, đơn vị vận chuyển và trạng thái giao nhận.

---

## 3. Nhóm Kho hàng & Tồn kho (Supply Chain)

### `Warehouse`
Danh sách các chi nhánh/kho hàng.
- `warehouseCode`, `name`, `address`.
- `managerId`: Người quản lý kho.

### `Inventory`
Bảng trung gian quản lý số lượng tồn kho theo sản phẩm tại từng kho.
- `productId`, `warehouseId`.
- `quantity`: Tổng tồn.
- `availableQuantity`: Tồn thực tế có thể bán (trừ hàng đã giữ chỗ).
- `minStock`, `maxStock`: Cảnh báo nhập hàng.

### `InventoryLog`
Nhật ký nhập/xuất/điều chuyển kho.
- `type`: `IN` | `OUT` | `ADJUST` | `TRANSFER`.
- `referenceType`: Tham chiếu tới đơn hàng, đơn nhập, hoặc phiếu dịch vụ.

### `Supplier`
Thông tin nhà cung cấp máy và linh kiện.

### `PurchaseOrder`
Đơn đặt hàng nhập từ nhà cung cấp (Order nhập kho).

---

## 4. Nhóm Nhân sự (HRM)

### `Employee`
Thông tin nhân viên nội bộ.
- `employeeCode`, `firstName`, `lastName`, `phone`, `email`.
- `position`: `admin`, `manager`, `sales`, `technician`, `accountant`...
- `status`: `active`, `on_leave`, `terminated`.

### `Attendance`
Ghi nhận ngày công, check-in/check-out của nhân viên.

### `Salary`
Bảng tính lương hàng tháng cho nhân viên.

---

## 5. Nhóm Tài chính & Giao dịch

### `Transaction`
Ghi nhận mọi biến động dòng tiền (Thu/Chi).
- `transactionType`: `income` | `expense`.
- `category`: `sale`, `purchase`, `salary`, `rent`, `marketing`...
- `amount`, `paymentMethod`.

### `Debt`
Quản lý công nợ khách hàng (mua trả chậm) hoặc nợ nhà cung cấp.

---

## 6. Nhóm Dịch vụ & Bảo trì

### `Service` & `ServiceItem`
Quản lý dịch vụ sửa chữa, vệ sinh, bảo trì laptop.

### `WarrantyCard`
Phiếu bảo hành liên kết với thiết bị cụ thể.

### `BuybackOrder`
Đơn thu mua máy cũ từ khách hàng (nhập kho máy cũ/linh kiện).

---

## 7. Nhóm Hệ thống & Nội dung (Administration)

### `User`
Tài khoản đăng nhập hệ thống quản trị.
- `email`, `password` (hashed).
- `role`: `admin` | `superadmin`.
- `status`: `active`, `locked`.

### `AuditLog`
Lưu vết mọi hành động của nhân viên trên hệ thống (ai đã sửa gì, khi nào).

### `Blog`
Quản lý bài viết tin tức, hướng dẫn.

### `Banner` & `PopupBanner`
Quản lý hình ảnh quảng cáo hiển thị trên giao diện người dùng.

### `Settings`
Cấu hình global cho website (Hotline, Logo, Email nhận thông báo...).

---

**Ghi chú:** Tất cả các bảng đều tự động có 2 trường `createdAt` và `updatedAt` nhờ option `timestamps: true` của Mongoose.
