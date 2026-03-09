# Phase 4 Execution Plan: LapLap Frontend Conversion

**Status**: ⏳ IN-PROGRESS[🔄 EXECUTING]
**Target**: Convert LapLap to consume NexGear API
**Scope**: 50+ files to update/delete
**Estimated Duration**: 20-24 hours

---

## Phase 4 Overview

Convert LapLap from a full-stack Next.js application to a **frontend-only application** that consumes NexGear backend APIs.

### Key Changes:
- ❌ Remove: models/ (41 files), app/api/ (40+ directories), lib/mongodb.ts, lib/auth.config.ts, lib/audit.ts
- ✅ Update: All pages/components to use API client from Phase 3
- ✅ Update: Authentication to use JWT tokens from NexGear
- ✅ Update: Contexts to use API instead of direct DB queries
- ✅ Update: Environment configuration

---

## Phase 4 Execution Roadmap

### Section 1: Cleanup (Files to Delete)
**Estimated Time**: 30 minutes

#### 4.1: Delete models/ directory
Files to delete (41 total):
- Attendance.ts, AuditLog.ts, Banner.ts, Blog.ts, Brand.ts, BuybackOrder.ts
- Category.ts, Component.ts, Coupon.ts, Customer.ts, Debt.ts, Employee.ts
- FacebookGroup.ts, FAQ.ts, Feedback.ts, Inventory.ts, InventoryLog.ts
- License.ts, LoyaltyPoints.ts, Notification.ts, Order.ts, PopupBanner.ts
- Product.ts, ProductHistory.ts, ProductUnit.ts, Promotion.ts, PurchaseOrder.ts
- Return.ts, ReturnItem.ts, Review.ts, Salary.ts, Service.ts, ServiceItem.ts
- Settings.ts, Shipping.ts, Software.ts, Supplier.ts, Transaction.ts
- User.ts, Visitor.ts, Warehouse.ts, WarrantyCard.ts

**Action**: `rm -r models/`

#### 4.2: Delete app/api/ directory
40+ route directories to delete (approximately 149 route files total)

**Action**: `rm -r app/api/`

#### 4.3: Delete lib files
- [ ] lib/mongodb.ts (DB connection - no longer needed)
- [ ] lib/auth.config.ts (NextAuth config - switching to JWT)
- [ ] lib/audit.ts (audit logging - now handled by NexGear)

#### 4.4: Reference lib/automations.ts
- [ ] Keep file for reference but mark as deprecated
- [ ] Add note: "Business logic now handled by NexGear automations.ts"
- [ ] Can be deleted in Phase 5 after validation

---

### Section 2: Configuration Updates
**Estimated Time**: 30 minutes

#### 4.5: Update .env.local
**Remove**:
```env
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

**Keep/Add**:
```env
# NexGear API Configuration
NEXT_PUBLIC_NEXGEAR_API_URL=http://localhost:3000/api

# For production
# NEXT_PUBLIC_NEXGEAR_API_URL=https://api.nexgear.vn

# JWT Token storage (optional, for reference)
JWT_STORAGE_KEY=nexgear_token
```

#### 4.6: Update next.config.ts
- Remove any MongoDB-related rewrites
- Keep existing redirects and middleware
- Verify API proxy routes (if any)

#### 4.7: Update tsconfig.json
- No changes needed (paths already configured)

---

### Section 3: Authentication System (CRITICAL)
**Estimated Time**: 3-4 hours

#### 4.8: Authentication flow changes

**Before (NextAuth + Local DB)**:
```
Login Form → POST /api/auth/login → DB Query → Session Created
```

**After (NexGear JWT)**:
```
Login Form → POST /api/auth/login (NexGear) → JWT Token → Store in localStorage
```

#### 4.9: Update auth files

**Files to create/update**:
- [ ] `lib/auth/helpers.ts` - New: Token/auth helper functions
- [ ] `app/admin/(auth)/login/page.tsx` - Update: Use NexGear login API
- [ ] `app/admin/(auth)/register/page.tsx` - Create: User registration flow
- [ ] `middleware.ts` - Update: JWT verification instead of NextAuth

#### 4.10: Create JWT Auth Provider (Client-side)
**File**: `context/JWTAuthContext.tsx`
```typescript
// Manages JWT token lifecycle
// Provides: { token, user, login, logout, isLoading, isAuthenticated }
// Uses: lib/api/auth functions
```

#### 4.11: Update NextAuth removal
**Action**: Remove `next-auth` from dependencies (optional, can keep for reference)

---

### Section 4: Context Updates
**Estimated Time**: 2-3 hours

#### 4.12: Update CartContext
**Current**: Stores items locally
**Change**: 
- Keep local storage for cart UI
- Add sync to NexGear API when user logged in
- Add `syncCartToAPI()` function

#### 4.13: Update ComparisonContext
**Current**: Stores comparison items locally
**Change**: No change needed (keeps local storage)

#### 4.14: Create/Update AuthContext
**Current**: NextAuth-based
**Change**: Create new JWT-based context
- Replace NextAuth useSession with custom useAuth hook
- Provide token from NexGear login
- Handle token expiration and refresh

#### 4.15: Create UserContext (optional)
**File**: `context/UserContext.tsx`
**Purpose**: Store current logged-in user info
**Data**: From `GET /api/auth/me` endpoint

---

### Section 5: Pages Update (Public Pages)
**Estimated Time**: 6-8 hours

#### 4.16: Home Page (app/page.tsx)
**Update**:
- [ ] Replace `Product.find()` with `getProducts()` from @/lib/api
- [ ] Replace banner/promotion queries with API calls
- [ ] Replace blog list with API calls
- [ ] Handle loading/error states

#### 4.17: Product Listing (app/laptops/page.tsx)
**Update**:
- [ ] Replace `Product.find()` with `getProducts()` or `filterProducts()`
- [ ] Replace category/brand queries with API calls
- [ ] Keep filter UI logic (filters now work with API params)
- [ ] Handle pagination API-style

#### 4.18: Product Detail (app/laptops/[slug]/page.tsx)
**Update**:
- [ ] Replace `Product.findOne()` with `getProduct()`
- [ ] Replace related products query with API
- [ ] Replace reviews query with `getProductReviews()`
- [ ] Handle 404 when product not found

#### 4.19: Search Results (app/(client)/search/page.tsx or similar)
**Update**:
- [ ] Replace search query with `filterProducts()` API call
- [ ] Pass search term and filters as API parameters
- [ ] Handle empty results

#### 4.20: Blog Listing & Detail (app/blog/page.tsx)
**Update**:
- [ ] Replace `Blog.find()` with `getBlogs()` API
- [ ] Replace `Blog.findOne()` with `getBlog()` or `getBlogBySlug()`
- [ ] Update pagination

#### 4.21: FAQ Page (app/chinh-sach-bao-hanh or similar)
**Update**:
- [ ] Replace `FAQ.find()` with `getFAQs()` API

#### 4.22: Reviews Page (app/reviews/page.tsx)
**Update**:
- [ ] Replace `Review.find()` with `getProductReviews()` API

#### 4.23: Warranty Check (app/tra-cuu-bao-hanh/page.tsx)
**Update**:
- [ ] Replace warranty lookup query with API call
- [ ] Use new warranty API endpoint from NexGear

#### 4.24: Service Booking (app/sua-chua-laptop/page.tsx)
**Update**:
- [ ] Replace service list query with `getServices()` API
- [ ] Update booking form to POST to NexGear API

#### 4.25: Trade-in/Buyback (app/thu-cu-doi-moi/page.tsx)
**Update**:
- [ ] Replace buyback form submit with `createBuybackOrder()` API

#### 4.26: Checkout (app/checkout/page.tsx)
**Update**:
- [ ] Replace `Order.create()` with `createOrder()` API
- [ ] Handle payment confirmation
- [ ] Verify inventory via API before confirming

#### 4.27: Other Public Pages
**Update**: Any other pages with DB queries
- About (app/gioi-thieu)
- Terms (app/terms)
- Privacy (app/privacy)
- Contact (if exists)
- Installer (app/cai-dat-phan-mem)

---

### Section 6: Admin Pages Update
**Estimated Time**: 8-10 hours

#### 4.28: Admin Layout & Auth
**File**: `app/admin/layout.tsx`
**Update**:
- [ ] Replace NextAuth check with JWT auth check
- [ ] Redirect to login if no valid token
- [ ] Show user info from JWT token

#### 4.29: Admin Login Page
**File**: `app/admin/(auth)/login/page.tsx`
**Update**:
- [ ] Replace local DB login with `login()` API call
- [ ] Store JWT token from response
- [ ] Redirect to admin dashboard on success

#### 4.30: Admin Dashboard
**File**: `app/admin/(dashboard)/page.tsx`
**Update**:
- [ ] Replace stats query with `getDashboardStats()` API
- [ ] Update all charts/metrics to use API data

#### 4.31-4.50: Admin CRUD Pages (20+ pages)
Each admin resource page needs similar updates:

**For each resource (Products, Orders, Customers, Categories, etc.)**:

1. **List Page** (e.g., `app/admin/products/page.tsx`)
   - [ ] Replace `Model.find()` with corresponding `get*()` API
   - [ ] Replace search/filter with API parameters
   - [ ] Keep UI logic, just swap data source

2. **Create Page** (e.g., `app/admin/products/new/page.tsx`)
   - [ ] Replace `Model.create()` with `create*()` API
   - [ ] Handle file uploads (Cloudinary already integrated)
   - [ ] Show success/error feedback

3. **Edit/Detail Page** (e.g., `app/admin/products/[id]/page.tsx`)
   - [ ] Replace `Model.findById()` with `get*()` API
   - [ ] Replace `Model.updateOne()` with `update*()` API
   - [ ] Handle 404 when not found

4. **Delete Action**
   - [ ] Replace `Model.deleteOne()` with `delete*()` API

**Resources to update**:
- Products (+ specs, images)
- Orders (+ order items, tracking)
- Customers
- Users
- Employees
- Inventory/Warehouses
- Categories
- Brands
- Coupons
- Blogs
- FAQ
- Reviews
- Banners
- Services
- Warranty Cards
- Buyback Orders
- Settings
- Other resources as needed

#### 4.51: Admin Components
**Update common admin components**:
- [ ] `components/admin/DataTable.tsx` - Add API pagination
- [ ] `components/admin/SearchFilter.tsx` - Pass filters to API
- [ ] `components/admin/FormHandler.tsx` - Use API calls
- [ ] `components/admin/UploadHandler.tsx` - Keep Cloudinary integration

---

### Section 7: Components Update
**Estimated Time**: 3-4 hours

#### 4.52: Update Global Components
- [ ] `components/Header.tsx` - Replace user menu with JWT auth
- [ ] `components/Footer.tsx` - No DB queries needed
- [ ] `components/Navigation.tsx` - Update links if needed
- [ ] `components/ProductCard.tsx` - No changes (receives data from parent)
- [ ] `components/BookingForm.tsx` - Use API calls
- [ ] `components/CartDrawer.tsx` - Keep local state, sync with API on checkout

#### 4.53: Update Client-side Components
- [ ] `components/ClientLayoutWrapper.tsx` - Replace NextAuth with JWT context
- [ ] `components/SessionProviderWrapper.tsx` - Replace with JWTAuthProvider
- [ ] Any other auth-dependent components

---

### Section 8: Utilities & Helpers
**Estimated Time**: 1-2 hours

#### 4.54: Create new auth utilities
**File**: `lib/auth/helpers.ts`
- [ ] `checkAuthStatus()` - Verify JWT validity
- [ ] `redirectIfNotAuth()` - Redirect to login if needed
- [ ] `redirectIfNotAdmin()` - Check admin role

#### 4.55: Create API call wrappers
**File**: `lib/api-wrappers.ts` (optional convenience layer)
- [ ] Common error handling
- [ ] Loading states
- [ ] Success notifications

#### 4.56: Update middleware
**File**: `middleware.ts`
- [ ] Replace NextAuth with JWT check
- [ ] Verify token validity
- [ ] Handle token refresh if needed

#### 4.57: Update normalize.ts
**File**: `lib/normalize.ts`
- [ ] Remove any MongoDB-specific normalization
- [ ] Keep data transformation helpers

---

### Section 9: Testing & Validation
**Estimated Time**: 2-3 hours

#### 4.58: Test authentication flow
- [ ] Login page loads
- [ ] Can submit login form
- [ ] Redirects to admin on success
- [ ] Token stored correctly
- [ ] Admin pages require auth
- [ ] Logout clears token

#### 4.59: Test public pages
- [ ] Home page loads and displays data
- [ ] Product listing works with filters
- [ ] Product detail loads correctly
- [ ] Search works
- [ ] Blog listing works
- [ ] Checkout process works

#### 4.60: Test admin pages
- [ ] Dashboard loads with stats
- [ ] Product list, create, edit, delete works
- [ ] Order management works
- [ ] Customer management works
- [ ] All CRUD operations via API work

---

## Execution Order (Recommended)

1. **Phase 4.1-4.3**: Delete files (start fresh cleanup) ✅ FIRST
2. **Phase 4.5-4.7**: Update configuration (enable API usage) ✅ SECOND
3. **Phase 4.8-4.15**: Authentication system (critical path) ✅ THIRD
4. **Phase 4.16-4.27**: Public pages (customer-facing) ⏳ FOURTH
5. **Phase 4.28-4.51**: Admin pages (can work in parallel) ⏳ FIFTH
6. **Phase 4.52-4.57**: Components & utilities (support layer) ⏳ SIXTH
7. **Phase 4.58-4.60**: Testing & validation (final checks) ⏳ SEVENTH

---

## Dependencies & Requirements

### Must-Have Before Starting:
- ✅ Phase 3 completed (API client in place)
- ✅ NexGear API running and accessible
- ✅ NEXT_PUBLIC_NEXGEAR_API_URL configured

### Environment Setup:
```env
NEXT_PUBLIC_NEXGEAR_API_URL=http://localhost:3000/api
```

### Tool Requirements:
- Node.js 18+
- npm or yarn
- Git for version control

---

## Risk Mitigation

### Backup Strategy:
- [ ] Git commit: "Phase 3 complete - before Phase 4 cleanup"
- [ ] Git branch: `feature/phase-4-frontend-only`
- [ ] Database backup of both NexGear and LapLap before deleting models

### Rollback Plan:
- Keep git history intact
- Can revert to previous commit if needed
- Test on staging before production

### Validation Checkpoints:
After each section, verify:
1. No TypeScript errors: `npm run lint`
2. Next.js build succeeds: `npm run build`
3. Changes match expected behavior
4. No console errors when running `npm run dev`

---

## Deliverables

### At Phase 4 Completion:
✅ No models/ directory (deleted)
✅ No app/api/ directory (deleted)
✅ No lib/mongodb.ts (deleted)
✅ All pages use API client
✅ Authentication uses JWT from NexGear
✅ All admin pages functional
✅ All public pages functional
✅ Tests passing

### New Files Created:
- `context/JWTAuthContext.tsx` - JWT authentication context
- `lib/auth/helpers.ts` - Auth utilities
- `PHASE_4_IMPLEMENTATION_GUIDE.md` - Detailed implementation guide

---

## Next Steps After Phase 4

### Phase 5: Data Migration
- Migrate data from LapLap DB to NexGear DB
- Verify data integrity
- Test with migrated data

### Phase 6: Deployment
- Full integration testing
- Performance testing
- Production deployment

---

**Status**: Ready to begin Phase 4 deletion and updates
**First Task**: 4.1-4.3 File Deletion (30 minutes)
**Checkpoint**: After deletion, verify build still succeeds

