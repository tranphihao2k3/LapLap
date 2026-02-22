# 🚀 KẾ HOẠCH TRIỂN KHAI SEO - LAPLAP

## 📅 TUẦN 1-2: TECHNICAL SEO (Tối ưu kỹ thuật)

### 1. Hoàn thiện Structured Data (Schema.org)
- [x] **FAQPage Schema** - Cho các trang dịch vụ
    - [x] Trang "Sửa chữa laptop" (Quy trình, giá cả)
    - [x] Trang "Vệ sinh laptop" (Thời gian, chất liệu keo)
    - [x] Trang "Nâng cấp laptop" (RAM, SSD tương thích)
    - [x] Trang "Thu cũ đổi mới" (Định giá, thủ tục)
- [x] **Service Schema** - Cho từng dịch vụ
    - [x] Sửa chữa laptop
    - [x] Vệ sinh laptop
    - [x] Nâng cấp laptop
    - [x] Thu cũ đổi mới
- [x] **Organization Schema** - Cải thiện (Logo, contact, social, opening hours, payment methods)
- [x] **WebSite Schema** - Với SearchAction (Hộp tìm kiếm Google)
- [ ] **Review/Rating Schema** - Nếu có reviews

### 2. Tối ưu Robots.txt
- [x] Basic robots.txt
- [x] Sitemap reference
- [x] Block admin pages: `/admin/*`
- [x] Block API routes không cần index: `/api/*` (trừ public APIs)


### 3. Performance Optimization
- [x] **Refactor to Server Components** (Cải thiện SEO & Loading speed)
- [ ] **Image Optimization** (Sharp, WebP, Lazy load)
- [x] **Next.js Speed Insights** (Đã tích hợp)
    - [ ] Chuyển đổi sang WebP format
    - [ ] Lazy loading cho images
    - [ ] Responsive images với srcset
    - [ ] Nén ảnh (giảm kích thước file)
- [ ] **Code Optimization**
    - [ ] Minify CSS/JS
    - [ ] Remove unused code
    - [ ] Code splitting / Tree shaking

---

## 📅 TUẦN 3-4: ON-PAGE SEO (Tối ưu nội dung trang)

### 1. Title Tags Optimization
- [ ] **Homepage**: "Laptop Cần Thơ | Mua Bán Laptop Cũ Mới Chính Hãng Giá Tốt - LapLap"
- [x] **Product Pages Template**: "{Tên Laptop} | Giá {Giá} VNĐ | LapLap Cần Thơ"
- [x] **Category Pages Template**: "{Danh mục} Laptop Cần Thơ | Giá Tốt Nhất | LapLap"
- [x] **Service Pages Template**: "{Dịch vụ} Laptop Cần Thơ | Uy Tín Lấy Liền | LapLap"



### 2. Meta Descriptions
- [ ] Viết Meta Descriptions duy nhất cho mỗi trang (150-160 ký tự)
- [ ] Bao gồm từ khóa chính và CTA

### 3. Heading Structure (H1-H6)
- [ ] Kiểm tra và đảm bảo mỗi trang chỉ có 1 thẻ H1
- [ ] Hợp nhất cấu trúc H2-H6 hợp lý

### 4. Image Optimization (Alt Text & File Names)
- [x] Cập nhật Alt Text cho tất cả ảnh (Mô tả rõ ràng, chứa từ khóa)
- [ ] Đổi tên file ảnh sang dạng SEO (ví dụ: `dell-xps-13-bac.jpg`)


### 5. Internal Linking Strategy
- [ ] Link từ Homepage đến các Categories & Services
- [ ] Related products section
- [ ] Link từ Blog đến Products/Services liên quan

---

## 📅 TUẦN 5-8: CONTENT SEO (Chiến lược nội dung)

### 1. Blog Content Strategy
- [ ] Lên lịch 2-3 bài/tuần (1500+ từ)
- [ ] Các chủ đề: Hướng dẫn mua laptop, So sánh sản phẩm, Review, Thủ thuật & News.

### 2. Product Descriptions Optimization
- [ ] Viết nội dung duy nhất cho từng sản phẩm (300-500 từ)
- [ ] Bao gồm Specs chi tiết, Use cases và Benefits.

### 3. Service Pages Content
- [ ] Bổ sung nội dung chi tiết cho trang Sửa chữa, Vệ sinh, Nâng cấp.

### 4. Cấu trúc trang Landing Pages (SEO-focused)
- [x] Tối ưu trang Danh mục: `/laptops?category=gaming` -> "Laptop Gaming Cần Thơ"
- [x] Tối ưu trang Thương hiệu: `/laptops?brand=apple` -> "MacBook Cần Thơ"
- [ ] Tạo Landing Pages chuyên sâu cho từng hãng lớn (Dell, HP, Thinkpad)

---

## 📅 TUẦN 9-10: LOCAL SEO (SEO địa phương)

### 1. Google Business Profile
- [ ] Tối ưu thông tin, upload ảnh, đăng bài và phản hồi review.

### 2. Local Citations & Content
- [ ] Đăng ký trên các directory (Vatgia, 5giay, Muaban, etc.)
- [ ] Tạo nội dung theo quận/huyện tại Cần Thơ.

---

## 📅 TUẦN 11-16: LINK BUILDING (Xây dựng backlinks)

- [ ] Chiến lược Guest Posting trên các tech blog Việt Nam (Tinhte, Genk, Voz).
- [ ] Xây dựng Social Media Presence.

---

## 🎯 CÔNG VIỆC ƯU TIÊN (LÀM NGAY)
1. [ ] **Setup Google Search Console** (Cần hướng dẫn user)
2. [x] **Thêm FAQ schema cho service pages**
3. [x] **Optimize images với alt text**

