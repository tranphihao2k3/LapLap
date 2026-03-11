import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import {
    getProducts,
    getProduct,
    getFilterOptions,
    getProductSpecs,
    getBrands,
    getProductReviews,
} from '@/lib/api/products'
import { ProductFilterParams } from '@/types/api'

// ── DANH SÁCH SẢN PHẨM (có pagination) ──────────────────────
export function useProducts(params: ProductFilterParams) {
    const filtered = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    )
    return useQuery({
        queryKey: queryKeys.products.list(filtered),
        queryFn: async () => {
            const res = await getProducts(filtered)
            if (!res.success) throw new Error(res.error || 'Lỗi tải sản phẩm')
            return {
                data: res.data ?? [],
                pagination: res.pagination ?? { total: 0, page: 1, limit: 12 },
            }
        },
        placeholderData: (prev) => prev,
    })
}

// ── CHI TIẾT SẢN PHẨM ───────────────────────────────────────
export function useProduct(slug: string) {
    return useQuery({
        queryKey: queryKeys.products.detail(slug),
        queryFn: async () => {
            const res = await getProduct(slug)
            if (!res.success || !res.data) throw new Error(res.error || 'Không tìm thấy sản phẩm')
            return res.data
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 10,
    })
}

// ── FILTER OPTIONS (categories + brands) ─────────────────────
export function useFilterOptions() {
    return useQuery({
        queryKey: queryKeys.filterOptions.base(),
        queryFn: async () => {
            const res = await getFilterOptions()
            if (!res.success || !res.data) throw new Error(res.error || 'Lỗi tải filter')
            return res.data
        },
        staleTime: 1000 * 60 * 30, // 30 phút — ít thay đổi
    })
}

// ── BRANDS (theo category) ───────────────────────────────────
export function useBrands(params: { categorySlug?: string; hasProducts?: boolean; limit?: number } = {}) {
    return useQuery({
        queryKey: queryKeys.filterOptions.brands(params),
        queryFn: async () => {
            const res = await getBrands(params)
            if (!res.success) throw new Error(res.error || 'Lỗi tải brands')
            return res.data ?? []
        },
        staleTime: 1000 * 60 * 30,
    })
}

// ── PRODUCT SPECS (CPU, RAM, SSD...) ─────────────────────────
export function useProductSpecs(categorySlug: string) {
    return useQuery({
        queryKey: queryKeys.filterOptions.specs(categorySlug),
        queryFn: async () => {
            const res = await getProductSpecs(categorySlug)
            if (!res.success || !res.data) throw new Error(res.error || 'Lỗi tải specs')
            return res.data.filters
        },
        enabled: !!categorySlug,
        staleTime: 1000 * 60 * 30,
    })
}

// ── REVIEWS ──────────────────────────────────────────────────
export function useProductReviews(productId: string) {
    return useQuery({
        queryKey: queryKeys.reviews.product(productId),
        queryFn: async () => {
            const res = await getProductReviews(productId)
            if (!res.success) throw new Error(res.error || 'Lỗi tải reviews')
            return res.data ?? []
        },
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
    })
}

// ── SEARCH (cho Header) ─────────────────────────────────────
export function useProductSearch(searchTerm: string) {
    return useQuery({
        queryKey: queryKeys.products.list({ search: searchTerm, limit: 5, active: true }),
        queryFn: async () => {
            const res = await getProducts({ search: searchTerm, limit: 5, active: true })
            if (!res.success) throw new Error(res.error || 'Lỗi tìm kiếm')
            return res.data ?? []
        },
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 2,
    })
}
