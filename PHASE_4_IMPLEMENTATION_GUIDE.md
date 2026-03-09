# Phase 4 Implementation Guide: Frontend Conversion Details

**Status**: In Progress (Authentication System)
**Last Updated**: Phase 4 Cleanup Complete

---

## Critical Changes Made So Far ✅

### Phase 4.1-4.3 Cleanup ✅ COMPLETE
- ✅ Deleted models/ directory (41 files)
- ✅ Deleted app/api/ directory (40+ directories with 149 routes)
- ✅ Deleted lib/mongodb.ts (MongoDB connection)
- ✅ Deleted lib/auth.config.ts (NextAuth config)
- ✅ Deleted lib/audit.ts (Audit logging)

### Phase 4.5 Environment Update ✅ COMPLETE
- ✅ Updated .env.local:
  - Removed MONGODB_URI
  - Removed NEXTAUTH_SECRET
  - Removed NEXTAUTH_URL
  - Added NEXT_PUBLIC_NEXGEAR_API_URL=http://localhost:3000/api

### Phase 4.8 Authentication System ✅ IN PROGRESS
- ✅ Created context/JWTAuthContext.tsx
  - JWT token management
  - useJWTAuth() hook
  - withAuth() HOC
  - useIsAuthenticated() hook

- ✅ Created lib/auth/helpers.ts
  - Token utility functions
  - Role checking (isAdmin, isEmployee, isCustomer)
  - User info decoding from JWT
  - Auth guards (requireAuth, requireAdmin, requireRole)

---

## Remaining Changes (Phase 4.6-4.81)

### CRITICAL: Update Admin Layout File
**File**: `app/admin/(dashboard)/layout.tsx`

**Changes Required**:

```typescript
// Line 1-3: Replace NextAuth imports
// FROM:
import { signOut, useSession } from "next-auth/react";

// TO:
import { useJWTAuth } from "@/context/JWTAuthContext";
import { useRouter } from "next/navigation";
```

```typescript
// Line ~410: Header function - Replace useSession with useJWTAuth
// FROM:
function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();

// TO:
function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { user, logout, isAuthenticated } = useJWTAuth();
  const pathname = usePathname();
  const router = useRouter();
```

```typescript
// Line ~475: User display - Replace session?.user with JWT user
// FROM:
<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
  {session?.user?.name?.charAt(0).toUpperCase() || "A"}
</div>

// TO:
<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-blue-700 transition-colors">
  {(user?.fullName || user?.email || "A").charAt(0).toUpperCase()}
</div>
```

```typescript
// Line ~480: Logout button - Replace NextAuth signOut with JWT logout
// FROM:
onClick={() => signOut({ callbackUrl: "/admin/login" })}

// TO:
onClick={() => {
  logout();
  router.push("/admin/(auth)/login");
}}
```

**Add new function at end of file** (Before ` export default`):
```typescript
// Auth Check wrapper
function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useJWTAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/(auth)/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-slate-500">Vui lòng chờ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

**Wrap children with AdminLayoutContent**:
```typescript
// In main return statement
// FROM:
<main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>

// TO:
<main className="flex-1 p-4 lg:p-6 overflow-auto">
  <AdminLayoutContent>{children}</AdminLayoutContent>
</main>
```

---

### CRITICAL: Create Admin Login Page
**File**: `app/admin/(auth)/login/page.tsx`

**Purpose**: Replace NextAuth login with NexGear JWT login

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJWTAuth } from '@/context/JWTAuthContext';
import { Laptop, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useJWTAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Laptop className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">LapLap</h1>
          </div>
          <p className="text-blue-100">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexgear.vn"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Demo credentials (test):</p>
            <p>Email: admin@nexgear.vn</p>
            <p>Password: password123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 mt-4 text-sm">
          Đăng nhập qua NexGear API (Phase 4)
        </p>
      </div>
    </div>
  );
}
```

---

### CRITICAL: Update Root Layout with JWT Provider
**File**: `app/layout.tsx` or `app/admin/layout.tsx` (metadata file)

**Add JWTAuthProvider wrapper** (likely in a client wrapper component):

```typescript
import { JWTAuthProvider } from "@/context/JWTAuthContext";

// Wrap the app with JWTAuthProvider in the root or app-level client component
// This ensures JWT auth is available throughout the admin section
```

---

## Phase 4 Sequential Steps (Recommended)

### Step 1: Update Main Layout
- [ ] Update `app/admin/(dashboard)/layout.tsx` to use JWT auth
- [ ] Test: Admin dashboard should require login
- [ ] Test: Logout should work and redirect to login

### Step 2: Create Login Page
- [ ] Create `app/admin/(auth)/login/page.tsx` with JWT login form
- [ ] Connect to NexGear API login endpoint
- [ ] Test: Can login with demo credentials
- [ ] Test: Token is stored after successful login
- [ ] Test: Redirects to admin dashboard

### Step 3: Verify Build
```bash
npm run lint
npm run build
```
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Build succeeds

### Step 4: Test Authentication Flow
```bash
npm run dev
```
- [ ] Visit http://localhost:3000/admin
- [ ] Should redirect to /admin/(auth)/login
- [ ] Can submit login form
- [ ] On success, redirects to /admin/
- [ ] Can see user info in header
- [ ] Logout button works

---

## Next Steps After Auth (Phase 4.9-4.51)

Once authentication is working, update all admin pages:

### Admin Pages to Update
Each requires replacing DB queries with API calls:
- [ ] Dashboard → getDashboardStats() API
- [ ] Products CRUD → Product API calls
- [ ] Orders CRUD → Order API calls
- [ ] Customers → Customer API calls
- [ ] Categories, Brands, Coupons, etc.

### Template for Admin Page Updates

**Before (with DB)**:
```typescript
async function getProducts() {
  const response = await Product.find();
  return response;
}
```

**After (with API)**:
```typescript
'use client';
import { getProducts } from '@/lib/api/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getProducts(1, 20);
      if (res.success) setProducts(res.data.products);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;
  return <ProductsList products={products} />;
}
```

---

## Troubleshooting Common Issues

### Issue: "useJWTAuth must be used within JWTAuthProvider"
**Solution**: Ensure `JWTAuthProvider` wraps the application:
```typescript
// In root layout or auth layout
<JWTAuthProvider>
  {children}
</JWTAuthProvider>
```

### Issue: Token not persisting after refresh
**Solution**: Token is stored in localStorage by storeToken(). Check:
1. Browser DevTools → Application → Local Storage → nexgear_token
2. Ensure storeToken() is called after successful login

### Issue: Redirecting to login even after successful login
**Solution**: 
1. Check if isAuthenticated() returns true
2. Check localStorage for nexgear_token
3. Verify token is not expired

### Issue: Build fails with TypeScript errors
**Solution**:
1. Check all imports are correct
2. Verify @/context and @/lib paths exist
3. Run `npm run lint --fix` to auto-fix issues

---

## Files Status Summary

### Created ✅
- context/JWTAuthContext.tsx (JWT authentication provider)
- lib/auth/helpers.ts (Auth utility functions)
- PHASE_4_EXECUTION_PLAN.md
- This file (PHASE_4_IMPLEMENTATION_GUIDE.md)

### To Create ⏳
- app/admin/(auth)/login/page.tsx (Login page)
- Update app/admin/(dashboard)/layout.tsx (Dashboard layout with JWT)
- Update app/layout.tsx or wrapper (Add JWT Provider)

### Deleted ✅
- models/ directory (all 41 model files)
- app/api/ directory (all 149 route files)
- lib/mongodb.ts
- lib/auth.config.ts
- lib/audit.ts

---

## Validation Checklist

**After completing auth system updates, verify:**

- [ ] No errors in browser console
- [ ] No TypeScript build errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Can navigate to /admin/(auth)/login
- [ ] Can submit login form
- [ ] Can login with credentials
- [ ] Token appears in localStorage after login
- [ ] Redirects to /admin after successful login
- [ ] Admin pages show user info in header
- [ ] Logout works and clears token
- [ ] Can't access /admin without valid token

---

## API Credentials for Testing

**From NexGear:**
- Email: admin@nexgear.vn
- Password: password123
- Role: admin

---

**Next Document**: PHASE_4_API_PAGES_CONVERSION.md (after auth is complete)
