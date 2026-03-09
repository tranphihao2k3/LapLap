# Phase 3 – API Client Guide

This document explains the structure and usage of the LapLap API client created during Phase 3. The client abstracts communication with the NexGear backend and provides typed helpers to keep frontend code clean and consistent.

---

## 1. Overview

All HTTP requests that used to access the local database or internal routes now flow through the NexGear API. The API client sits in `lib/api` and exports a small set of functions which wrap `fetch`.

Base URL is read from `NEXT_PUBLIC_NEXGEAR_API_URL` in `.env.local`.

Authentication is handled via JWT stored in `localStorage` under `jwt_token`; the client automatically attaches the `Authorization` header when available.

Responses conform to the following interface in `types/api.ts`:

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}
```

Every exported function from the sub-modules returns a `Promise<ApiResponse<…>>`.

---

## 2. File Structure

```
LapLap/
  lib/
    api.ts            // core wrapper logic
    api/
      index.ts       // barrel export
      products.ts    // product related calls
      orders.ts      // order related calls
      auth.ts        // authentication helpers
      admin.ts       // admin-specific endpoints
  types/
    api.ts          // shared types for API responses
```

---

## 3. Core Helper (`lib/api.ts`)

- `callApi<T>(path, options)` performs fetch, attaches headers, handles JSON parsing, error wrapping.
- `apiClient` provides shorthand `get`, `post`, `put`, `del` methods.
- Token retrieval from `localStorage` is done with `getToken()`.

Usage example:

```ts
import { apiClient } from '@/lib/api';

const res = await apiClient.get<Product[]>('/products');
if (res.success) {
  console.log(res.data);
}
```

---

## 4. API Modules

### 4.1 Products (`lib/api/products.ts`)

Functions:
- `getProducts(params?)` – public listing, supports filter query params
- `filterProducts` – alias
- `getFilterOptions()` – returns `{ categories, brands }`
- `getProduct(idOrSlug)` – fetch single item
- CRUD operations: `createProduct`, `updateProduct`, `deleteProduct`
- Category/brand lookups and review operations

### 4.2 Orders (`lib/api/orders.ts`)

Functions for order management, including customer-facing and admin utilities.
Key functions: `getOrders`, `getOrder`, `getMyOrders`, `createOrder`, `updateOrderStatus`, `cancelOrder`, etc.

### 4.3 Auth (`lib/api/auth.ts`)

Provides:
- `login(payload)` – stores token on success
- `authMe()` – fetch current user info
- `verifyToken(token)` – auxiliary check
- Utility helpers: `storeToken`, `getToken`, `clearToken`

### 4.4 Admin (`lib/api/admin.ts`)

Admin-only endpoints such as user/customer/coupon/inventory management, blog CRUD, and dashboard stats.

---

## 5. Using in Components

Client components should be declared with `'use client'` then call the appropriate function in `useEffect` or event handlers. Example:

```tsx
'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api/products';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getProducts({ page: 1, limit: 10 });
      if (res.success && res.data) setProducts(res.data);
    })();
  }, []);

  return <ProductGrid products={products} />;
}
```

Server components may also call the client by importing `callApi` directly and awaiting.

---

## 6. Error Handling

Always inspect the `success` flag. Errors are communicated by `error` field and may originate from network failures or backend business rules.

Example:

```ts
const res = await createOrder(orderPayload);
if (!res.success) {
  console.error('Order failed:', res.error);
}
```

---

## 7. Advanced Features

- **Retries/Caching**: Not implemented yet; can be added by wrapping `callApi`.
- **Token Refresh**: Future work when NexGear supports refresh tokens.

---

## 8. Migration Checklist

When converting pages from DB access to API calls, replace old direct imports (e.g., `import Product from '@/models/Product'`) with functions from this client. See `PHASE_4_IMPLEMENTATION_GUIDE.md` for snippets.

---

## 9. Troubleshooting

- 401 responses usually mean missing or expired JWT; call `clearToken()` and redirect to login.
- CORS errors indicate misconfigured `NEXT_PUBLIC_NEXGEAR_API_URL` or NexGear origin.
- Unexpected JSON means backend route may be down.

---

With the client in place, Phase 4 page conversions can proceed confidently.
