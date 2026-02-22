/**
 * Script tạo bài blog SEO về công cụ test laptop
 * Chạy: node create-blog-test-laptop.js
 * (Yêu cầu server Next.js đang chạy ở localhost:3000)
 */

const blog = {
    title: "Công Cụ Test Laptop Miễn Phí: Kiểm Tra Toàn Diện Trước Khi Mua",
    excerpt: "Hướng dẫn sử dụng các công cụ test laptop chuyên nghiệp để kiểm tra CPU, RAM, SSD, màn hình, pin và nhiệt độ — giúp bạn đánh giá chính xác tình trạng máy trước khi mua.",
    content: `## Tại Sao Cần Test Laptop Trước Khi Mua?

Mua laptop cũ mà không test kỹ là một trong những sai lầm phổ biến nhất. Một chiếc máy nhìn ngoài bóng đẹp nhưng bên trong có thể ẩn chứa nhiều vấn đề: ổ cứng sắp hỏng, RAM lỗi, màn hình chớp, hay pin chai đến 20%. Chỉ cần 15–20 phút test laptop đúng cách, bạn sẽ tránh được rủi ro mua phải máy "bom" và tiết kiệm hàng triệu đồng sửa chữa.

Tại **LapLap Cần Thơ**, chúng tôi cung cấp **dịch vụ kiểm tra laptop miễn phí** trước khi bán — đảm bảo mọi máy đều được test toàn diện bằng phần mềm chuyên nghiệp.

---

## Bộ Công Cụ Test Laptop Toàn Diện

### 🖥️ 1. CPU-Z — Kiểm Tra CPU & RAM

**CPU-Z** là công cụ test laptop miễn phí phổ biến nhất, dùng để:
- Xem tên, thế hệ, tốc độ xung nhịp CPU
- Kiểm tra loại RAM (DDR3/DDR4/DDR5), bus speed, số khe
- Xác minh thông số có khớp với quảng cáo không

**Cách dùng:**
1. Tải CPU-Z tại cpuid.com
2. Mở tab **CPU** → kiểm tra tên model, tốc độ
3. Mở tab **Memory** → kiểm tra dung lượng, loại, bus
4. Mở tab **Mainboard** → xem thông tin bo mạch chủ

✅ **Dấu hiệu tốt:** Thông số khớp 100% với mô tả sản phẩm
⚠️ **Cảnh báo:** CPU chạy dưới tốc độ công bố → có thể đang bị throttle

---

### 💾 2. CrystalDiskInfo — Test Ổ Cứng SSD/HDD

**CrystalDiskInfo** là công cụ test ổ cứng laptop không thể thiếu:
- Hiển thị tình trạng sức khỏe SSD/HDD: Good / Caution / Bad
- Đọc nhiệt độ ổ cứng
- Kiểm tra số giờ sử dụng, số lần bật máy
- Phát hiện bad sector, reallocated sectors

**Cách đọc kết quả:**
- 🟢 **Good** → Ổ cứng tốt, dùng bình thường
- 🟡 **Caution** → Có dấu hiệu cảnh báo, cần theo dõi
- 🔴 **Bad** → Ổ cứng sắp hỏng, cần thay ngay

**CrystalDiskMark** (cùng bộ): Test tốc độ đọc/ghi thực tế của SSD:
- SSD NVMe mới: Đọc > 3000 MB/s
- SSD SATA mới: Đọc > 500 MB/s
- SSD/HDD cũ dưới mức này nhiều → có vấn đề

---

### 🌡️ 3. HWMonitor — Kiểm Tra Nhiệt Độ

Nhiệt độ quá cao là "kẻ giết thầm lặng" của laptop. **HWMonitor** giúp:
- Theo dõi nhiệt độ CPU, GPU real-time
- Kiểm tra nhiệt độ ổ cứng
- Xem tốc độ quạt (RPM)

**Ngưỡng nhiệt độ an toàn:**
| Linh kiện | Bình thường | Chú ý | Nguy hiểm |
|-----------|-------------|--------|-----------|
| CPU (idle) | < 50°C | 50–65°C | > 65°C |
| CPU (tải) | < 80°C | 80–90°C | > 90°C |
| GPU | < 85°C | 85–90°C | > 90°C |
| SSD | < 50°C | 50–60°C | > 60°C |

💡 **Mẹo test:** Mở 10 tab Chrome + chạy video YouTube 4K và quan sát nhiệt độ sau 5 phút.

---

### 🔋 4. BatteryInfoView — Kiểm Tra Pin

Pin là thứ hao mòn nhiều nhất theo thời gian. **BatteryInfoView** cho biết:
- **Design Capacity**: Dung lượng pin ban đầu (khi mới)
- **Full Charge Capacity**: Dung lượng tối đa hiện tại
- **Cycle Count**: Số lần sạc đầy (< 300 là tốt)

**Tính độ hao pin:**
> Sức khỏe pin (%) = (Full Charge Capacity / Design Capacity) × 100

Ví dụ:
- Design: 6000 mAh, Full Charge: 5400 mAh → Pin còn **90%** → Rất tốt ✅
- Design: 6000 mAh, Full Charge: 3000 mAh → Pin còn **50%** → Cần thay ⚠️

---

### 📺 5. Kiểm Tra Màn Hình

Dùng website **[screen.sodagreen.net](https://screen.sodagreen.net)** hoặc **Dead Pixel Test** để:

✅ **Test dead pixel** (điểm ảnh chết): Hiển thị màn hình toàn màu đỏ, xanh, trắng, đen → xem có điểm lạ không

✅ **Test độ đồng đều backlight**: Màn hình toàn trắng mà có vùng tối/sáng khác nhau = màn hình lỗi backlight

✅ **Test tần số quét (Hz)**: Dùng [testufo.com](https://testufo.com) → test thực tế tốc độ màn hình

✅ **Test màu sắc**: Video gradient 4K để xem màu có dải đều không

---

### ⚡ 6. AIDA64 / Cinebench — Stress Test Toàn Hệ Thống

**AIDA64 Extreme** (dùng thử 30 ngày): Chạy Stability Test để kiểm tra máy có ổn định không:
- Test CPU, FPU, Memory cùng lúc trong 15–30 phút
- Nếu máy tắt đột ngột, xanh màn hình → có vấn đề nghiêm trọng

**Cinebench R23**: Đo sức mạnh CPU thực tế:
- So sánh điểm với benchmark chuẩn trên net
- Điểm thấp hơn 20% so với chuẩn → CPU có vấn đề

---

## Quy Trình Test Laptop Trước Khi Mua (15 Phút)

Đây là quy trình chuẩn **LapLap Cần Thơ** sử dụng khi kiểm tra máy:

**Phút 1–3: Kiểm tra ngoại hình**
- Vỏ máy, bàn phím, touchpad, cổng kết nối
- Mở các cổng USB, cắm thiết bị test

**Phút 3–6: Kiểm tra phần mềm cơ bản**
- Chạy CPU-Z → xác minh CPU, RAM
- Chạy CrystalDiskInfo → kiểm tra SSD

**Phút 6–10: Kiểm tra kết nối & phần cứng**
- Test WiFi: kết nối mạng, tốc độ
- Test Bluetooth: kết nối thiết bị
- Test âm thanh, webcam, micro
- Test tất cả phím bàn phím (dùng keyboardtest.com)

**Phút 10–13: Stress test nhanh**
- Chạy video 4K, mở nhiều ứng dụng
- Theo dõi nhiệt độ với HWMonitor

**Phút 13–15: Kiểm tra màn hình & pin**
- Dead pixel test
- Xem BatteryInfoView → sức khỏe pin

---

## Dịch Vụ Test Laptop Miễn Phí Tại LapLap Cần Thơ

Không có thời gian tự test? Đến **LapLap Cần Thơ**, chúng tôi sẽ:

✅ **Test toàn diện miễn phí** — CPU, RAM, SSD, màn hình, pin, nhiệt độ
✅ **Xuất báo cáo kết quả** test chi tiết
✅ **Tư vấn nâng cấp** phù hợp nếu máy cần cải thiện
✅ **Bảo hành 6 tháng** cho laptop cũ đã qua kiểm tra

> 📍 **Địa chỉ:** LapLap Cần Thơ — Chuyên laptop cũ uy tín
> 📞 **Hotline:** 0978.648.720
> 🕐 **Giờ mở cửa:** 8:00 – 20:00 (Tất cả các ngày)

---

## Tóm Tắt: Các Công Cụ Test Laptop Cần Biết

| Công cụ | Kiểm tra | Miễn phí |
|---------|----------|-----------|
| **CPU-Z** | CPU, RAM, bo mạch | ✅ |
| **CrystalDiskInfo** | Sức khỏe SSD/HDD | ✅ |
| **CrystalDiskMark** | Tốc độ SSD/HDD | ✅ |
| **HWMonitor** | Nhiệt độ, quạt | ✅ |
| **BatteryInfoView** | Sức khỏe pin | ✅ |
| **Dead Pixel Test** | Màn hình | ✅ |
| **TestUFO** | Tần số quét màn hình | ✅ |
| **AIDA64** | Stress test toàn diện | Dùng thử |
| **Cinebench R23** | Hiệu năng CPU | ✅ |

Tất cả các công cụ trên đều **hoàn toàn miễn phí** và có thể tải về từ website chính thức.

---

*Bài viết được biên soạn bởi đội kỹ thuật **LapLap Cần Thơ** — đơn vị chuyên kiểm tra, mua bán và nâng cấp laptop uy tín tại Cần Thơ từ năm 2018.*`,

    author: "LapLap Team",
    tags: [
        "test laptop",
        "công cụ kiểm tra laptop",
        "kiểm tra laptop trước khi mua",
        "phần mềm test laptop",
        "CrystalDiskInfo",
        "CPU-Z",
        "HWMonitor",
        "laptop cần thơ",
        "laptop cũ cần thơ",
        "mua laptop cũ"
    ],
    metaTitle: "Công Cụ Test Laptop Miễn Phí 2026: Hướng Dẫn Kiểm Tra Toàn Diện | LapLap Cần Thơ",
    metaDescription: "Hướng dẫn sử dụng CPU-Z, CrystalDiskInfo, HWMonitor để test laptop trước khi mua. Kiểm tra CPU, RAM, SSD, pin, nhiệt độ chính xác. Dịch vụ test laptop miễn phí tại LapLap Cần Thơ.",
    status: "published"
};

async function createBlog() {
    console.log('📝 Đang tạo bài blog...\n');
    console.log(`Tiêu đề: ${blog.title}`);

    try {
        const res = await fetch('http://localhost:3000/api/admin/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blog)
        });

        const data = await res.json();

        if (data.success) {
            console.log(`\n✅ Tạo bài blog thành công!`);
            console.log(`   Slug: ${data.data?.slug}`);
            console.log(`   ID: ${data.data?._id}`);
            console.log(`   URL: http://localhost:3000/blog/${data.data?.slug}`);
        } else {
            console.log(`\n❌ Lỗi: ${data.error || data.message}`);
        }
    } catch (err) {
        console.error('\n❌ Không thể kết nối server:', err.message);
        console.log('💡 Hãy chắc chắn server đang chạy: npm run dev');
    }
}

createBlog();
