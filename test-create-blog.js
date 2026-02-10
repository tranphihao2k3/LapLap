const sampleBlog = {
    title: "Hướng dẫn chọn mua laptop phù hợp tại Cần Thơ",
    excerpt: "Tìm hiểu cách chọn laptop phù hợp với nhu cầu và ngân sách của bạn tại Cần Thơ",
    content: `Việc chọn mua laptop phù hợp là một quyết định quan trọng. Dưới đây là những tiêu chí bạn nên cân nhắc:

1. Xác định mục đích sử dụng
- Văn phòng: Cần CPU tốt, RAM 8GB trở lên
- Đồ họa: Cần GPU mạnh, màn hình chất lượng cao
- Gaming: Cần cấu hình cao, tản nhiệt tốt

2. Ngân sách
Xác định rõ ngân sách để tìm laptop phù hợp nhất. Tại LapLap Cần Thơ, chúng tôi có nhiều dòng laptop từ 5 triệu đến 50 triệu đồng.

3. Thương hiệu uy tín
Chọn các thương hiệu có dịch vụ bảo hành tốt tại Cần Thơ như Dell, HP, Asus, Lenovo, Acer.

4. Cấu hình phù hợp
- CPU: Intel Core i5/i7 hoặc AMD Ryzen 5/7
- RAM: Tối thiểu 8GB, khuyến nghị 16GB
- Ổ cứng: SSD 256GB trở lên
- Màn hình: Full HD (1920x1080) trở lên

5. Kiểm tra kỹ trước khi mua
Tại LapLap, chúng tôi cung cấp dịch vụ test laptop miễn phí để bạn yên tâm trước khi quyết định mua.

Liên hệ LapLap Cần Thơ để được tư vấn miễn phí!`,
    featuredImage: "",
    author: "LapLap Team",
    tags: ["hướng dẫn", "mua laptop", "laptop cần thơ"],
    metaTitle: "Hướng dẫn chọn mua laptop phù hợp tại Cần Thơ | LapLap",
    metaDescription: "Tìm hiểu cách chọn laptop phù hợp với nhu cầu và ngân sách. Tư vấn miễn phí tại LapLap Cần Thơ. Giao hàng tận nơi, bảo hành uy tín.",
    status: "published"
};

fetch('http://localhost:3000/api/admin/blog', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(sampleBlog)
})
    .then(res => res.json())
    .then(data => console.log('Blog created:', data))
    .catch(err => console.error('Error:', err));
