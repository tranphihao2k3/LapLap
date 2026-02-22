# 🚀 CÁC BƯỚC TIẾP THEO THEO KẾ HOẠCH SEO

## 📅 TUẦN 1-2: TECHNICAL SEO (Tối ưu kỹ thuật)

### 1. Hoàn thiện Structured Data (Schema.org)

#### ✅ Đã làm:
- ✅ Product Schema cho từng laptop
- ✅ BreadcrumbList Schema
- ✅ LocalBusiness Schema (trang chủ)

#### 🔲 Cần làm tiếp:

**a) FAQPage Schema** - Cho các trang dịch vụ
- Trang "Sửa chữa laptop" → FAQ về quy trình, giá cả
- Trang "Vệ sinh laptop" → FAQ về thời gian, chất liệu keo
- Trang "Nâng cấp laptop" → FAQ về RAM, SSD tương thích
- Trang "Thu cũ đổi mới" → FAQ về định giá, thủ tục

**b) Service Schema** - Cho từng dịch vụ
```json
{
  "@type": "Service",
  "serviceType": "Sửa chữa laptop",
  "provider": {
    "@type": "LocalBusiness",
    "name": "LapLap Cần Thơ"
  },
  "areaServed": "Cần Thơ",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://laplapcantho.store/sua-chua-laptop"
  }
}
```

**c) Organization Schema** - Cải thiện
- Thêm logo, contact info
- Social media profiles
- Opening hours
- Payment methods

**d) WebSite Schema** - Với SearchAction
- Cho phép Google hiển thị search box trong kết quả tìm kiếm

**e) Review/Rating Schema** - Nếu có reviews
- AggregateRating cho products
- IndividualReview cho từng review

---

### 2. Tối ưu Robots.txt

#### ✅ Đã có:
- ✅ Basic robots.txt
- ✅ Sitemap reference

#### 🔲 Cần cải thiện:
- [ ] Block admin pages: `/admin/*`
- [ ] Block API routes không cần index: `/api/*` (trừ public APIs)
- [ ] Allow important pages
- [ ] Crawl-delay nếu cần

---

### 3. Performance Optimization

#### 🔲 Image Optimization
- [ ] Convert tất cả ảnh sang WebP format
- [ ] Lazy loading cho images
- [ ] Responsive images với srcset
- [ ] Compress images (giảm kích thước file)

#### 🔲 Code Optimization
- [ ] Minify CSS/JS
- [ ] Remove unused code
- [ ] Code splitting
- [ ] Tree shaking

#### 🔲 Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

## 📅 TUẦN 3-4: ON-PAGE SEO (Tối ưu nội dung trang)

### 1. Title Tags Optimization

#### 🔲 Homepage
**Hiện tại:** "LapLap - Laptop Cần Thơ | Mua Bán Laptop Chính Hãng Giá Tốt"
**Tối ưu:** "Laptop Cần Thơ | Mua Bán Laptop Cũ Mới Chính Hãng Giá Tốt - LapLap"

#### 🔲 Product Pages
**Template:** "{Tên Laptop} | Giá {Giá} VNĐ | LapLap Cần Thơ"
**Ví dụ:** "Dell XPS 13 | Giá 15.000.000 VNĐ | LapLap Cần Thơ"

#### 🔲 Category Pages
**Template:** "{Danh mục} Laptop Cần Thơ | Giá Tốt Nhất | LapLap"
**Ví dụ:** "Laptop Gaming Cần Thơ | Giá Tốt Nhất | LapLap"

#### 🔲 Service Pages
**Template:** "{Dịch vụ} Laptop Cần Thơ | Uy Tín Lấy Liền | LapLap"
**Ví dụ:** "Sửa Chữa Laptop Cần Thơ | Uy Tín Lấy Liền | LapLap"

---

### 2. Meta Descriptions

#### 🔲 Yêu cầu:
- ✅ Unique cho mỗi trang (không trùng lặp)
- ✅ 150-160 ký tự
- ✅ Bao gồm từ khóa chính
- ✅ Call-to-action rõ ràng
- ✅ Hấp dẫn, thu hút click

#### 🔲 Ví dụ cho Product:
"Mua {Tên Laptop} giá chỉ {Giá} tại Cần Thơ. {Specs chính}. Bảo hành {X} tháng, hỗ trợ trả góp 0%. Giao hàng tận nơi, kiểm tra trước khi nhận. Đặt ngay!"

#### 🔲 Ví dụ cho Service:
"Sửa chữa laptop Cần Thơ lấy liền. Chuyên sửa màn hình, bàn phím, mainboard. Giá cả minh bạch, bảo hành dài hạn. Liên hệ ngay 0978.648.720"

---

### 3. Heading Structure (H1-H6)

#### 🔲 Quy tắc:
- ✅ Mỗi trang chỉ có 1 H1
- ✅ H1 chứa từ khóa chính
- ✅ H2-H6 phân cấp hợp lý
- ✅ Sử dụng semantic HTML

#### 🔲 Ví dụ cho Product Page:
```html
<h1>{Tên Laptop}</h1>
<h2>Thông số kỹ thuật</h2>
<h2>Mô tả sản phẩm</h2>
<h2>Đánh giá khách hàng</h2>
<h3>Ưu điểm</h3>
<h3>Nhược điểm</h3>
```

---

### 4. Image Optimization

#### 🔲 Alt Text
- ✅ Mô tả rõ ràng nội dung ảnh
- ✅ Bao gồm từ khóa nếu phù hợp
- ✅ Không spam keywords
- ✅ Unique cho mỗi ảnh

#### 🔲 Ví dụ:
- ❌ "laptop"
- ✅ "Dell XPS 13 màu bạc trên bàn gỗ"
- ✅ "Màn hình laptop Dell XPS 13 hiển thị Windows 11"

#### 🔲 File Names
- ❌ "IMG_1234.jpg"
- ✅ "dell-xps-13-bac.jpg"
- ✅ "laptop-gaming-asus-tuf-15.jpg"

---

### 5. Internal Linking Strategy

#### 🔲 Link từ Homepage:
- [ ] Link đến categories: "Laptop Gaming", "Laptop Văn Phòng"
- [ ] Link đến services: "Sửa chữa", "Vệ sinh", "Nâng cấp"
- [ ] Link đến blog posts mới nhất

#### 🔲 Link giữa Products:
- [ ] Related products section
- [ ] "Sản phẩm tương tự"
- [ ] "Khách hàng cũng xem"

#### 🔲 Link từ Blog:
- [ ] Link đến products được đề cập
- [ ] Link đến categories liên quan
- [ ] Link đến service pages

#### 🔲 Breadcrumb Navigation:
- ✅ Đã có breadcrumb
- 🔲 Cần thêm structured data (đã làm)

---

## 📅 TUẦN 5-8: CONTENT SEO (Chiến lược nội dung)

### 1. Blog Content Strategy

#### 🔲 Mục tiêu:
- 2-3 bài blog/tuần
- Mỗi bài 1500+ từ
- Bao gồm images, videos
- Internal links đến products

#### 🔲 Chủ đề đề xuất:

**a) Hướng dẫn mua laptop**
- "Hướng dẫn mua laptop cũ không bị lừa"
- "Checklist kiểm tra laptop cũ trước khi mua"
- "Nên mua laptop cũ hay mới? So sánh chi tiết"
- "Top 5 laptop tốt nhất cho sinh viên 2026"

**b) So sánh sản phẩm**
- "Dell XPS 13 vs MacBook Air M2: Nên chọn cái nào?"
- "Laptop Gaming giá dưới 20 triệu: Top 5 lựa chọn"
- "HP vs Dell: Thương hiệu nào tốt hơn?"

**c) Review sản phẩm**
- "Review chi tiết Dell Latitude 5520"
- "Trải nghiệm sử dụng MacBook Pro M3"
- "Laptop nào tốt cho designer?"

**d) Thủ thuật & Tips**
- "10 cách tăng tốc laptop cũ"
- "Cách kiểm tra laptop có bị thay linh kiện không"
- "Hướng dẫn nâng cấp RAM laptop tại nhà"

**e) Tin tức công nghệ**
- "Laptop mới ra mắt 2026"
- "Xu hướng laptop gaming 2026"
- "Công nghệ CPU mới nhất"

---

### 2. Product Descriptions Optimization

#### 🔲 Yêu cầu:
- ✅ Unique cho mỗi product (không copy-paste)
- ✅ 300-500 từ
- ✅ Bao gồm specs chi tiết
- ✅ Use cases và benefits
- ✅ Comparison với competitors
- ✅ Call-to-action

#### 🔲 Template:
```
{Tên Laptop} là sự lựa chọn hoàn hảo cho {đối tượng}. Với {specs nổi bật}, laptop này phù hợp cho {use cases}.

**Thông số kỹ thuật:**
- CPU: {CPU}
- RAM: {RAM}
- SSD: {SSD}
- Màn hình: {Screen}

**Ưu điểm:**
- {Ưu điểm 1}
- {Ưu điểm 2}
- {Ưu điểm 3}

**Phù hợp cho:**
- {Use case 1}
- {Use case 2}

Đặt mua ngay để nhận ưu đãi tốt nhất!
```

---

### 3. Service Pages Content

#### 🔲 Trang "Sửa chữa laptop"
- [ ] Mô tả chi tiết dịch vụ
- [ ] Quy trình làm việc (step-by-step)
- [ ] Bảng giá minh bạch
- [ ] FAQs (10-15 câu hỏi)
- [ ] Customer testimonials
- [ ] Before/After photos
- [ ] Warranty information

#### 🔲 Trang "Vệ sinh laptop"
- [ ] Tại sao cần vệ sinh laptop?
- [ ] Quy trình vệ sinh chuyên nghiệp
- [ ] Keo tản nhiệt sử dụng (MX4, MX6)
- [ ] Thời gian hoàn thành
- [ ] Giá cả
- [ ] FAQs

#### 🔲 Trang "Nâng cấp laptop"
- [ ] Các loại nâng cấp (RAM, SSD)
- [ ] Cách kiểm tra khả năng nâng cấp
- [ ] Linh kiện tương thích
- [ ] Bảng giá
- [ ] Warranty

---

### 4. Landing Pages Creation

#### 🔲 Tạo các landing pages mới:

**a) "Laptop Gaming Cần Thơ"**
- URL: `/laptops?category=gaming`
- Content: Giới thiệu laptop gaming
- Featured products
- Comparison table
- FAQs

**b) "Laptop Văn Phòng Cần Thơ"**
- URL: `/laptops?category=van-phong`
- Content: Laptop phù hợp văn phòng
- Specs requirements
- Price ranges

**c) "Laptop Sinh Viên Cần Thơ"**
- URL: `/laptops?category=sinh-vien`
- Content: Laptop giá rẻ cho sinh viên
- Budget recommendations
- Student discounts

**d) "MacBook Cần Thơ"**
- URL: `/laptops?brand=apple`
- Content: MacBook tại Cần Thơ
- MacBook models
- Comparison với Windows

---

## 📅 TUẦN 9-10: LOCAL SEO (SEO địa phương)

### 1. Google Business Profile

#### 🔲 Tối ưu Google My Business:
- [ ] Đảm bảo thông tin đầy đủ:
  - Tên cửa hàng: "LapLap - Laptop Cần Thơ"
  - Địa chỉ: {Địa chỉ đầy đủ}
  - Số điện thoại: 0978.648.720
  - Website: https://laplapcantho.store
  - Giờ mở cửa
  - Categories: "Cửa hàng máy tính", "Dịch vụ sửa chữa máy tính"

- [ ] Upload ảnh:
  - Logo cửa hàng
  - Ảnh cửa hàng (10-20 ảnh)
  - Ảnh sản phẩm
  - Ảnh team

- [ ] Posts thường xuyên:
  - Sản phẩm mới
  - Khuyến mãi
  - Tips & tricks
  - Tin tức

- [ ] Collect reviews:
  - Khuyến khích khách hàng để lại review
  - Reply tất cả reviews
  - Xử lý negative reviews

---

### 2. Local Citations

#### 🔲 Đăng ký trên các directory:

**a) Google Maps**
- ✅ Đã có Google Business Profile
- 🔲 Tối ưu thêm:
  - Thêm photos
  - Posts thường xuyên
  - Q&A section

**b) Facebook Business**
- [ ] Tạo Facebook Page
- [ ] Điền đầy đủ thông tin
- [ ] Link đến website
- [ ] Post thường xuyên

**c) Zalo Business**
- [ ] Tạo Zalo Official Account
- [ ] Điền thông tin cửa hàng
- [ ] Link đến website

**d) Các directory Việt Nam:**
- [ ] Vatgia.com
- [ ] 5giay.vn
- [ ] Chodocu.com
- [ ] Muaban.net
- [ ] Enbac.com

**e) Review sites:**
- [ ] Google Reviews
- [ ] Facebook Reviews
- [ ] Zalo Reviews

---

### 3. Local Content

#### 🔲 Tạo content địa phương:

**a) "Laptop ở {Quận} Cần Thơ"**
- Ninh Kiều
- Ô Môn
- Bình Thủy
- Cái Răng
- Thốt Nốt

**b) "Cửa hàng laptop gần {Địa điểm}"**
- Gần trường học
- Gần chợ
- Gần bệnh viện

**c) Local events:**
- Tham gia hội chợ công nghệ
- Workshop về laptop
- Event địa phương

---

## 📅 TUẦN 11-16: LINK BUILDING (Xây dựng backlinks)

### 1. Internal Linking

#### 🔲 Đã có:
- ✅ Breadcrumb navigation
- ✅ Related products

#### 🔲 Cần cải thiện:
- [ ] Link từ blog → products (3-5 links/bài)
- [ ] Link từ homepage → categories
- [ ] Link từ service pages → related services
- [ ] Link từ product pages → blog posts liên quan
- [ ] Sitemap HTML cho users

---

### 2. External Links

#### 🔲 Guest Posting:
- [ ] Tech blogs Việt Nam:
  - Tinhte.vn
  - Genk.vn
  - Voz.vn
  - Techz.vn
- [ ] Local business blogs
- [ ] Tech review sites

#### 🔲 Directory Submissions:
- [ ] Business directories
- [ ] Tech directories
- [ ] Local directories

#### 🔲 Social Media:
- [ ] Facebook Page
- [ ] Zalo Official Account
- [ ] YouTube channel
- [ ] TikTok account
- [ ] Instagram business

---

### 3. Backlink Strategy

#### 🔲 High-quality backlinks:
- [ ] Tech review sites (review sản phẩm)
- [ ] Local business directories
- [ ] Forum participation (voz.vn, tinhte.vn)
- [ ] Partnership với brands
- [ ] Press releases
- [ ] Infographics sharing

#### 🔲 Avoid:
- ❌ Link farms
- ❌ Paid links (trừ Google Ads)
- ❌ Spam directories
- ❌ Low-quality sites

---

## 📅 ONGOING: MONITORING & OPTIMIZATION

### 1. Tools Setup

#### 🔲 Đã có:
- ✅ Google Analytics
- ✅ Google Search Console (cần setup)

#### 🔲 Cần thêm:
- [ ] Google Search Console:
  - Submit sitemap
  - Monitor indexing
  - Check for errors
  - Track keywords

- [ ] Bing Webmaster Tools:
  - Submit sitemap
  - Monitor performance

- [ ] SEO Tools (nếu có budget):
  - Ahrefs
  - SEMrush
  - Moz

- [ ] Free Tools:
  - Google PageSpeed Insights
  - Google Rich Results Test
  - Schema Markup Validator

---

### 2. Key Metrics Tracking

#### 🔲 Traffic Metrics:
- [ ] Organic traffic (sessions)
- [ ] New vs returning visitors
- [ ] Bounce rate
- [ ] Average session duration
- [ ] Pages per session

#### 🔲 Ranking Metrics:
- [ ] Keyword rankings (top 10 keywords)
- [ ] Position changes
- [ ] Click-through rate (CTR)
- [ ] Impressions

#### 🔲 Conversion Metrics:
- [ ] Conversion rate từ organic
- [ ] Goal completions
- [ ] Revenue từ organic traffic

#### 🔲 Technical Metrics:
- [ ] Page load speed
- [ ] Core Web Vitals
- [ ] Mobile usability
- [ ] Indexed pages
- [ ] Crawl errors

---

### 3. Regular Tasks

#### 🔲 Weekly:
- [ ] Check keyword rankings
- [ ] Review Google Search Console
- [ ] Monitor backlinks
- [ ] Check for broken links
- [ ] Review competitor changes

#### 🔲 Monthly:
- [ ] Content audit
- [ ] Technical SEO audit
- [ ] Performance review
- [ ] Backlink analysis
- [ ] Competitor analysis

#### 🔲 Quarterly:
- [ ] Comprehensive SEO audit
- [ ] Strategy review
- [ ] Goal assessment
- [ ] Plan adjustments

---

## 🎯 PRIORITY ACTIONS (Ưu tiên làm ngay)

### ⚡ High Priority (Tuần này)
1. ✅ Thêm products vào sitemap (ĐÃ LÀM)
2. ✅ Thêm Product & Breadcrumb schema (ĐÃ LÀM)
3. [ ] Setup Google Search Console
4. [ ] Thêm FAQ schema cho service pages
5. [ ] Optimize images với alt text

### 🔥 Medium Priority (Tháng này)
1. [ ] Tạo 10 bài blog chất lượng
2. [ ] Optimize tất cả product descriptions
3. [ ] Internal linking strategy
4. [ ] Local SEO optimization
5. [ ] Performance optimization

### 📈 Long-term (3-6 tháng)
1. [ ] Content marketing campaign
2. [ ] Link building campaign
3. [ ] Brand awareness
4. [ ] Community building

---

## 📊 EXPECTED TIMELINE

### Tháng 1:
- Technical SEO hoàn thành
- On-page SEO cơ bản
- 10+ bài blog
- Google Search Console setup

### Tháng 2-3:
- Content marketing tăng tốc
- Local SEO optimization
- Link building bắt đầu
- +50% organic traffic

### Tháng 4-6:
- Top 10 cho 10 từ khóa chính
- 50+ quality backlinks
- +100% organic traffic
- Improved domain authority

---

*Kế hoạch này sẽ được cập nhật và điều chỉnh dựa trên kết quả thực tế.*
