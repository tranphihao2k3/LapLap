# 📋 Tài Liệu Kiểm Tra API - LapLap Cần Thơ

## Mục Lục
1. [Tổng Quan](#1-tổng-quan)
2. [Luồng Hoạt Động](#2-luồng-hoạt-động)
3. [Danh Sách API Endpoints](#3-danh-sách-api-endpoints)
4. [Test Cases](#4-test-cases)
5. [Hạn Chế & Lưu Ý](#5-hạn-chế--lưu-ý)

---

## 1. Tổng Quan

### 1.1 Mô Tả Hệ Thống

Website **LapLap Cần Thơ** là hệ thống bán laptop và linh kiện máy tính với các chức năng:
- 🛒 Bán hàng online/offline
- 📦 Quản lý kho (Inventory)
- 🛡️ Bảo hành tự động
- ⭐ Loyalty Points (tích điểm)
- 🔄 Thu cũ đổi mới (Buyback)
- ↩️ Trả hàng/Đổi hàng
- 📝 Đánh giá sản phẩm

### 1.2 Các Module Chính

| Module | Mô Tả |
|--------|-------|
| Orders | Quản lý đơn hàng |
| Customers | Quản lý khách hàng |
| Products | Quản lý sản phẩm |
| Inventory | Quản lý tồn kho |
| Warranty | Bảo hành |
| Loyalty Points | Điểm tích lũy |
| Buyback | Thu cũ đổi mới |
| Returns | Trả hàng |
| Reviews | Đánh giá |

---

## 2. Luồng Hoạt Động

### 2.1 Sơ Đồ Luồng Chính

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LUỒNG MUA HÀNG CHÍNH                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Khách    │───▶│ Tạo     │───▶│ Thanh    │───▶│ Giao     │───▶│ Hoàn     │
  │ Hàng     │    │ Order   │    │ Toán     │    │ Hàng     │    │ Thành    │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │                                                            │
       │         ┌────────────────────────────────────────────────┘
       │         ▼
       │    ┌─────────────────────────────────────────────────────────────┐
       │    │              TỰ ĐỘNG HÓA (Automation)                    │
       │    ├─────────────────────────────────────────────────────────────┤
       │    │  1. Inventory    - Trừ tồn kho                            │
       │    │  2. WarrantyCard - Tạo thẻ bảo hành                       │
       │    │  3. LoyaltyPoints- Cộng điểm tích lũy                      │
       │    │  4. Notification  - Gửi thông báo                          │
       │    └─────────────────────────────────────────────────────────────┘
       │
       ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Bảo      │───▶│ Đánh    │───▶│ Feedback │
  │ Hành     │    │ Giá     │    │          │
  └──────────┘    └──────────┘    └──────────┘
```

### 2.2 Chi Tiết Từng Luồng

#### Luồng 1: Mua Hàng
```
1. Khách đặt hàng (tạo Order)
   ↓
2. Admin xác nhận đơn (confirmed)
   ↓
3. Xử lý đơn (processing)
   ↓
4. Giao hàng (shipped)
   ↓
5. Giao thành công (delivered) → TỰ ĐỘNG HÓA:
   - Trừ tồn kho (Inventory)
   - Tạo thẻ bảo hành (WarrantyCard)
   - Cộng điểm tích lũy (LoyaltyPoints)
   - Gửi thông báo (Notification)
```

#### Luồng 2: Hủy Đơn
```
1. Admin hủy đơn hàng
   ↓
2. Tự động hoàn kho (nếu đã xuất kho)
```

#### Luồng 3: Thu Cũ Đổi Mới
```
1. Khách gửi máy cũ cần bán lại
   ↓
2. Admin đánh giá và báo giá
   ↓
3. Duyệt đơn thu cũ (approved)
   ↓
4. Tự động tạo voucher (Coupon)
   ↓
5. Khách sử dụng voucher mua máy mới
```

#### Luồng 4: Trả Hàng
```
1. Khách yêu cầu trả hàng
   ↓
2. Admin xác nhận và duyệt
   ↓
3. Nếu hoàn tiền (refund) → Hoàn kho
```

---

## 3. Danh Sách API Endpoints

### 3.1 Admin API Endpoints

| STT | Module | Endpoint | Methods | Mô Tả |
|-----|-------|----------|---------|-------|
| 1 | Orders | `/api/admin/orders` | GET | Lấy danh sách đơn hàng |
| 2 | Orders | `/api/admin/orders/[slug]` | GET, PUT, PATCH | Chi tiết/Cập nhật đơn |
| 3 | Customers | `/api/customers` | GET, POST | Quản lý khách hàng |
| 4 | Products | `/api/products` | GET | Lấy danh sách sản phẩm |
| 5 | Inventory | `/api/admin/inventory` | GET | Lấy danh sách tồn kho |
| 6 | Inventory | `/api/admin/inventory/[id]` | GET, PUT | Chi tiết/Cập nhật tồn kho |
| 7 | Warranty | `/api/admin/warranty-cards` | GET, POST | Quản lý thẻ bảo hành |
| 8 | Loyalty | `/api/admin/loyalty-points` | GET, POST | Quản lý điểm tích lũy |
| 9 | Buyback | `/api/admin/buyback-orders` | GET, POST | Quản lý thu cũ |
| 10 | Buyback | `/api/admin/buyback-orders/[id]` | GET, PUT | Chi tiết/Cập nhật |
| 11 | Returns | `/api/admin/returns` | GET, POST | Quản lý trả hàng |
| 12 | Returns | `/api/admin/returns/[id]` | GET, PUT | Chi tiết/Cập nhật |
| 13 | Reviews | `/api/admin/reviews` | GET | Quản lý đánh giá |
| 14 | Reviews | `/api/admin/reviews/[slug]` | GET, PUT, DELETE | Chi tiết đánh giá |
| 15 | Transactions | `/api/transactions` | GET, POST | Quản lý giao dịch |

### 3.2 Public API Endpoints

| STT | Module | Endpoint | Methods | Mô Tả |
|-----|-------|----------|---------|-------|
| 1 | Brands | `/api/brands` | GET | Lấy danh sách thương hiệu |
| 2 | Categories | `/api/categories` | GET | Lấy danh sách danh mục |
| 3 | Banner | `/api/banner` | GET | Lấy danh sách banner |
| 4 | Blog | `/api/blog` | GET | Lấy danh sách blog |
| 5 | Services | `/api/services` | GET | Lấy danh sách dịch vụ |
| 6 | Warranty | `/api/warranty` | GET | Tra cứu bảo hành theo SĐT |
| 7 | Reviews | `/api/reviews/[slug]` | GET | Lấy đánh giá theo sản phẩm |
| 8 | Feedback | `/api/feedback` | GET, POST | Phản hồi khách hàng |

### 3.3 API Endpoints Tự Động Hóa

Các automation được gọi từ `lib/automations.ts`:

| Trigger | Action | Mô Tả |
|---------|--------|-------|
| Order delivered | `onOrderDelivered(orderId)` | Trừ kho, tạo bảo hành, cộng điểm |
| Buyback approved | `onBuybackApproved(orderId)` | Tạo voucher tự động |
| Return processed | `onReturnApproved(returnId)` | Hoàn kho nếu refund |

---

## 4. Test Cases

### 4.1 Test API Cơ Bản

| STT | Test Case | Method | Endpoint | Expected |
|-----|-----------|--------|----------|----------|
| TC_001 | Lấy danh sách đơn hàng | GET | /admin/orders | 200 |
| TC_002 | Lấy danh sách khách hàng | GET | /customers | 200 |
| TC_003 | Lấy danh sách sản phẩm | GET | /products | 200 |
| TC_004 | Lấy danh sách tồn kho | GET | /admin/inventory | 200 |
| TC_005 | Lấy danh sách bảo hành | GET | /admin/warranty-cards | 200 |
| TC_006 | Lấy danh sách loyalty | GET | /admin/loyalty-points | 200 |
| TC_007 | Lấy danh sách thu cũ | GET | /admin/buyback-orders | 200 |
| TC_008 | Lấy danh sách trả hàng | GET | /admin/returns | 200 |
| TC_009 | Lấy danh sách đánh giá | GET | /admin/reviews | 200 |
| TC_010 | Lấy danh sách giao dịch | GET | /transactions | 200 |

### 4.2 Test Public API

| STT | Test Case | Method | Endpoint | Expected |
|-----|-----------|--------|----------|----------|
| TC_011 | Lấy thương hiệu | GET | /brands | 200 |
| TC_012 | Lấy danh mục | GET | /categories | 200 |
| TC_013 | Lấy banner | GET | /banner | 200 |
| TC_014 | Lấy blog | GET | /blog | 200 |
| TC_015 | Lấy dịch vụ | GET | /services | 200 |

### 4.3 Test Tra Cứu

| STT | Test Case | Method | Endpoint | Expected |
|-----|-----------|--------|----------|----------|
| TC_016 | Tra cứu bảo hành | GET | /warranty?phone=xxx | 200 |

### 4.4 Test Tạo Mới

| STT | Test Case | Method | Endpoint | Data | Expected |
|-----|-----------|--------|----------|------|----------|
| TC_017 | Tạo đơn thu cũ | POST | /admin/buyback-orders | sellerName, sellerPhone, productInfo, buyPrice | 201 |

---

## 5. Hạn Chế & Lưu Ý

### 5.1 Các API Chưa Đầy Đủ

1. **Tạo đơn hàng (POST /admin/orders)**: Hiện tại API chỉ có GET, cần thêm POST để tạo đơn hàng mới.

2. **Middleware xác thực**: Một số API yêu cầu đăng nhập (auth token).

3. **Warehouse Model**: Cần đảm bảo Warehouse model đã được đăng ký trong hệ thống.

### 5.2 Cách Test Thủ Công

Do một số API cần thao tác qua Admin Dashboard, các bước test thủ công:

1. **Tạo đơn hàng**: Vào Admin > Orders > Tạo mới
2. **Cập nhật trạng thái**: Admin > Orders > Click vào đơn > Cập nhật status
3. **Kiểm tra automation**: Sau khi đổi status thành "delivered", kiểm tra:
   - Inventory giảm
   - WarrantyCard được tạo
   - LoyaltyPoints được cộng
   - Notification được gửi

### 5.3 Chạy Test

```
bash
# Chạy test API tự động
npx ts-node scripts/test-api-flow.ts
```

### 5.4 Kiểm Tra Xung Đột

Các điểm cần kiểm tra xung đột:

| STT | Tình Huống | Kiểm Tra |
|-----|------------|----------|
| 1 | Đặt hàng khi hết hàng | Báo lỗi |
| 2 | Giao hàng 2 lần | Chỉ trừ kho 1 lần |
| 3 | Hủy đơn 2 lần | Chỉ hoàn kho 1 lần |
| 4 | Sử dụng voucher quá số lần | Báo lỗi |
| 5 | Điểm loyalty âm | Báo lỗi |

---

## Phụ Lục

### A. Mã Lỗi HTTP

| Mã | Mô Tả |
|----|-------|
| 200 | OK - Thành công |
| 201 | Created - Tạo mới thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa đăng nhập |
| 403 | Forbidden - Không có quyền |
| 404 | Not Found - Không tìm thấy |
| 405 | Method Not Allowed - Phương thức không được phép |
| 500 | Internal Server Error - Lỗi server |

### B. Order Status

| Status | Mô Tả |
|--------|-------|
| pending | Chờ xác nhận |
| confirmed | Đã xác nhận |
| processing | Đang xử lý |
| shipped | Đang giao |
| delivered | Đã giao |
| cancelled | Đã hủy |

### C. Warranty Status

| Status | Mô Tả |
|--------|-------|
| active | Còn bảo hành |
| expired | Hết bảo hành |
| voided | Bị vô hiệu |
| claimed | Đã yêu cầu bảo hành |

---

*Document Version: 1.1*
*Last Updated: 2024-01-15*
*Author: Development Team*
