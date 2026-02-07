# Hướng dẫn Debug Gift Field

## Bước 1: Xóa cache Next.js và restart
```powershell
# Stop dev server (Ctrl+C trong terminal)
Remove-Item -Recurse -Force .next
npm run dev
```

## Bước 2: Clear browser cache
- Mở DevTools (F12)
- Vào tab Application
- Click "Clear storage" > "Clear site data"
- Hoặc hard refresh: Ctrl + Shift + R

## Bước 3: Test tạo sản phẩm mới
1. Vào http://localhost:3000/admin/laptops
2. Click "Add Laptop"
3. Điền đầy đủ thông tin
4. **QUAN TRỌNG:** Nhập text vào ô "Gift Info / Promotion"
5. Mở DevTools > Network tab TRƯỚC KHI nhấn Save
6. Nhấn "Create"
7. Xem request trong Network tab:
   - Click vào request POST /api/admin/laptops
   - Vào tab "Payload" 
   - Kiểm tra xem có trường "gift" không

## Bước 4: Kiểm tra Console
- Mở Console (F12)
- Xem có lỗi gì không
- Nếu có lỗi, chụp lại và gửi cho tôi

## Nếu vẫn không được
Chạy lệnh này để kiểm tra file admin page có đúng không:
```powershell
Get-Content "d:\laptop-test-web\app\admin\laptops\page.tsx" | Select-String -Pattern "gift" -Context 1
```

Kết quả phải có:
- `gift?: string;` (trong interface)
- `gift: '',` (trong formData)
- `gift: laptop.gift || '',` (trong handleEdit)
- `value={formData.gift}` (trong textarea)
