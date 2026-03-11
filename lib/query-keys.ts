// ============================================================
// LAPLAP — Query Key Factory
// Centralized keys — tránh typo, hỗ trợ invalidate theo nhóm
// ============================================================

export const queryKeys = {
    // ── PRODUCTS ──────────────────────────────────────────────
    products: {
        all: () => ['products'] as const,
        list: (params: Record<string, any>) => ['products', 'list', params] as const,
        detail: (slug: string) => ['products', 'detail', slug] as const,
    },

    // ── FILTER OPTIONS (categories, brands, specs) ───────────
    filterOptions: {
        all: () => ['filterOptions'] as const,
        base: () => ['filterOptions', 'base'] as const,
        brands: (params?: Record<string, any>) => ['filterOptions', 'brands', params ?? {}] as const,
        specs: (categorySlug: string) => ['filterOptions', 'specs', categorySlug] as const,
    },

    // ── REVIEWS ──────────────────────────────────────────────
    reviews: {
        all: () => ['reviews'] as const,
        product: (productId: string) => ['reviews', 'product', productId] as const,
    },

    // ── ORDERS ───────────────────────────────────────────────
    orders: {
        all: () => ['orders'] as const,
        list: (params: Record<string, any>) => ['orders', 'list', params] as const,
    },

    // ── CATEGORIES / BRANDS ──────────────────────────────────
    categories: {
        all: () => ['categories'] as const,
    },
    brands: {
        all: () => ['brands'] as const,
        list: (params?: Record<string, any>) => ['brands', 'list', params ?? {}] as const,
    },
}
