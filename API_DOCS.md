# 🚀 LapLap API Documentation

Tài liệu này cung cấp chi tiết các API của hệ thống LapLap để tích hợp với các ứng dụng khác (Mobile, Web portal, ...).

## 📌 Thông tin chung
- **Base URL**: `https://laplapcantho.store` (hoặc localhost khi chạy dev)
- **Content-Type**: `application/json`
- **Response Format**: Tất cả các phản hồi đều ở dạng JSON.

---

## 💻 1. Sản phẩm (Products)

### 📋 Lấy danh sách sản phẩm
- **Endpoint**: `/api/products`
- **Method**: `GET`
- **Query Params**:
  - `search` (Optional): Từ khóa tìm kiếm (tên, model, cpu, ram).
  - `limit` (Optional): Số lượng sản phẩm (Mặc định: 50).
  - `status` (Optional): Trạng thái (`active`, `sold_out`, ...).
- **Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "67af...",
      "name": "Dell XPS 13 9310",
      "slug": "dell-xps-13-9310",
      "price": 25000000,
      "originalPrice": 28000000,
      "specs": {
        "cpu": "i7-1165G7",
        "ram": "16GB",
        "ssd": "512GB",
        "screen": "13.3 inch FHD+"
      },
      "brandId": { "name": "Dell" },
      "categoryId": { "name": "Văn phòng" }
    }
  ]
}
```

### 🔍 Lấy chi tiết sản phẩm
- **Endpoint**: `/api/products/[slug_hoac_id]`
- **Method**: `GET`
- **Response**: Trả về chi tiết 1 sản phẩm kèm theo thông tin Brand và Category đầy đủ.

### 🎭 Lấy các tùy chọn lọc (Filter Options)
- **Endpoint**: `/api/products/filter-options`
- **Method**: `GET`
- **Mô tả**: Lấy danh sách các CPU, RAM, SSD, Brands, Categories hiện có trong DB để hiển thị giao diện lọc.

### ⚙️ Lọc sản phẩm nâng cao
- **Endpoint**: `/api/products/filter`
- **Method**: `POST`
- **Body**:
```json
{
  "search": "xps",
  "categories": ["id_category_1"],
  "brands": ["id_brand_1"],
  "cpus": ["i5", "i7"],
  "priceRanges": [{ "min": 10000000, "max": 20000000 }],
  "page": 1,
  "limit": 12
}
```

---

## 📝 2. Bài viết (Blog)

### 📋 Lấy danh sách bài viết
- **Endpoint**: `/api/admin/blog?status=published`
- **Method**: `GET`
- **Response**: Danh sách các bài viết đã xuất bản.

### 🔍 Lấy chi tiết bài viết
- **Endpoint**: `/api/blog/[slug]`
- **Method**: `GET`
- **Response**: Thông tin chi tiết bài viết.

---

## 📦 3. Đơn hàng (Orders)

### 🛒 Tạo đơn hàng mới
- **Endpoint**: `/api/orders`
- **Method**: `POST`
- **Body**:
```json
{
  "customer": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "vana@gmail.com",
    "address": "Cần Thơ"
  },
  "items": [
    {
      "productId": "67af...",
      "name": "Dell XPS 13",
      "price": 25000000,
      "quantity": 1
    }
  ],
  "totalAmount": 25000000,
  "paymentMethod": "cod", // hoặc 'transfer'
  "note": "Giao hàng giờ hành chính"
}
```

---

## 💾 4. Phần mềm & Driver (Software)

### 📋 Lấy danh sách phần mềm
- **Endpoint**: `/api/software`
- **Method**: `GET`
- **Query Params**:
  - `category` (Optional): Lọc theo danh mục (Driver, Office, Browser, ...).
  - `limit` (Optional): Số lượng (Mặc định: 100).

### 🔍 Lấy chi tiết phần mềm
- **Endpoint**: `/api/software/[slug]`
- **Method**: `GET`

---

## 🤖 5. AI Search (Tìm kiếm thông minh)

- **Endpoint**: `/api/search-laptops-ai`
- **Method**: `POST`
- **Body**:
```json
{
  "query": "Tôi cần tìm laptop Dell dưới 20 triệu để làm văn phòng"
}
```
- **Response**: AI sẽ tự phân tích query và trả về danh sách các sản phẩm phù hợp dựa trên specs.

---

## 🌟 6. Các API khác

### ⭐ Đánh giá (Reviews)
- **Endpoint**: `/api/reviews`
- **Method**: `GET` (Lấy review), `POST` (Tạo review mới).

### 📧 Gửi Email (Newsletter/Contact)
- **Endpoint**: `/api/send-email`
- **Method**: `POST`
- **Body**: `{ "email": "customer@gmail.com", "type": "newsletter" }`

### 📊 Thống kê (Stats)
- **Endpoint**: `/api/stats/visitors`
- **Method**: `GET` (Lấy số lượt truy cập).

---

## 🏷️ 7. Danh mục & Thương hiệu (Categories & Brands)

### 📋 Lấy danh sách danh mục
- **Endpoint**: `/api/admin/categories`
- **Method**: `GET`
- **Response**: Danh sách các danh mục sản phẩm (Văn phòng, Gaming, Đồ họa, ...).

### 📋 Lấy danh sách thương hiệu
- **Endpoint**: `/api/admin/brands`
- **Method**: `GET`
- **Response**: Danh sách các thương hiệu (Dell, HP, Asus, ...).

---

## ⚠️ Lưu ý cho Frontend
1. **Giá tiền**: Đơn vị mặc định là VND.
2. **Hình ảnh**: Các URL hình ảnh có thể là URL tuyệt đối hoặc tương đối. Nếu là tương đối, hãy nối với Base URL.
3. **Phân trang**: Các API danh sách thường hỗ trợ `page` và `limit`.
4. **Xử lý lỗi**: Kiểm tra trường `success` trong response. Nếu `false`, hãy kiểm tra trường `message` hoặc `error`.
5. **Dữ liệu quan hệ**: Một số API trả về `categoryId` và `brandId` dưới dạng ID hoặc Object tùy theo việc có `populate` hay không. Hầu hết các API public đều đã được `populate` thông tin cơ bản.
