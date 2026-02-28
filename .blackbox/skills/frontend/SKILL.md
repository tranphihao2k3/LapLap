---
name: frontend
description: Hướng dẫn phát triển frontend cho dự án LapLap Next.js
---

# Frontend Skill cho LapLap

## Giới thiệu
Dự án LapLap là website thương mại điện tử bán laptop, được xây dựng bằng Next.js 14+ với TypeScript.

## Cấu trúc thư mục

### App Directory (Next.js 14+)
```
app/
├── page.tsx              # Trang chủ
├── layout.tsx           # Root layout
├── globals.css          # Global styles
├── (client)/            # Client components group
├── admin/               # Admin pages (dashboard, products, etc.)
├── api/                 # API routes
├── blog/                # Blog pages
├── laptops/             # Laptop listing & detail
├── checkout/            # Checkout page
└── [slug]/             # Dynamic routes
```

### Components
```
components/
├── ui/                  # Reusable UI components (Button, Input, etc.)
├── admin/               # Admin-specific components
├── Header.tsx          # Site header
├── Footer.tsx           # Site footer
├── LaptopCard.tsx       # Product card
└── ...
```

### Context
```
context/
├── CartContext.tsx     # Shopping cart state
└── ComparisonContext.tsx # Product comparison
```

## Quy tắc Code

### 1. Component Naming
- Sử dụng PascalCase: `LaptopCard.tsx`, `Header.tsx`
- Component files: `*.tsx`
- Logic files: `*.ts`

### 2. Client vs Server Components
- Mặc định là Server Components
- Thêm `'use client'` khi cần:
  - useState, useEffect
  - Event handlers (onClick, onChange)
  - Browser APIs
  - Context providers

### 3. Import Paths
```
typescript
// Sử dụng alias @ (đã được cấu hình trong tsconfig.json)
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Product } from '@/models/Product';
```

### 4. CSS/Tailwind
- Sử dụng Tailwind CSS
- Custom styles trong `app/globals.css`
- Responsive: mobile-first

### 5. API Calls
```
typescript
// Server Component
async function getData() {
  const res = await fetch('/api/products');
  return res.json();
}

// Client Component
'use client';
const handleSubmit = async () => {
  const res = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

## Các Trang Chính

### 1. Trang chủ (`app/page.tsx`)
- Hero banner
- Featured products
- Promotion sections

### 2. Danh sách laptop (`app/laptops/page.tsx`)
- Filter sidebar
- Product grid
- Pagination

### 3. Chi tiết sản phẩm (`app/laptops/[slug]/page.tsx`)
- Product images
- Specifications
- Add to cart

### 4. Admin (`app/admin/`)
- Dashboard
- Product management
- Order management

## Ví dụ Code

### Tạo Client Component
```
tsx
'use client';

import { useState } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Tìm kiếm laptop..."
      className="border p-2 rounded"
    />
  );
}
```

### Sử dụng Context
```
tsx
'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();

  return (
    <button onClick={() => addItem(product)}>
      Thêm vào giỏ
    </button>
  );
}
```

### Fetch dữ liệu trong Server Component
```
tsx
async function ProductList() {
  const res = await fetch('https://laplapcantho.store/api/products');
  const products = await res.json();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.data.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

## Best Practices

1. **Luôn sử dụng TypeScript types** cho props và data
2. **Tách logic** ra custom hooks khi cần
3. **Sử dụng Next.js Image** thay cho img tag
4. **Optimize fonts** với next/font
5. **Lazy loading** cho components nặng
6. **Error boundaries** cho các component có thể lỗi

## Chạy Development
```
bash
npm run dev
# Server chạy tại http://localhost:3000
```

## Build Production
```
bash
npm run build
npm start
