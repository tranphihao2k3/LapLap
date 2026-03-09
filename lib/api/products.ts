import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  Product,
  ProductFilterParams,
  Category,
  Brand,
  Review,
} from '@/types/api';

// Public endpoints
export const getProducts = async (
  params: ProductFilterParams = {}
): Promise<ApiResponse<Product[]>> => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      if (k === 'category') {
        query.set('categorySlug', String(v));
      } else {
        query.set(k, String(v));
      }
    }
  });
  return apiClient.get(`/products?${query.toString()}`);
};

export const filterProducts = getProducts; // alias

export const getFilterOptions = async (): Promise<
  ApiResponse<{ categories: Category[]; brands: Brand[] }>
> => {
  return apiClient.get('/products/filter-options');
};

export const getProductSpecs = async (
  categorySlug: string
): Promise<ApiResponse<{ filters: Record<string, any[]>; rawMap: Record<string, any[]> }>> => {
  return apiClient.get(`/products/specs?categorySlug=${categorySlug}`);
};

export const getProduct = async (
  idOrSlug: string
): Promise<ApiResponse<Product>> => {
  return apiClient.get(`/products/${idOrSlug}`);
};

// Admin/CRUD endpoints below (token required)
export const createProduct = async (
  payload: Partial<Product>
): Promise<ApiResponse<Product>> => {
  return apiClient.post('/products', payload);
};

export const updateProduct = async (
  id: string,
  payload: Partial<Product>
): Promise<ApiResponse<Product>> => {
  return apiClient.put(`/products/${id}`, payload);
};

export const deleteProduct = async (id: string): Promise<ApiResponse<null>> => {
  return apiClient.del(`/products/${id}`);
};

export const getCategories = async (): Promise<
  ApiResponse<Category[]>
> => {
  return apiClient.get('/categories');
};

export const getBrands = async (
  params: { limit?: number; hasProducts?: boolean; categorySlug?: string } = {}
): Promise<ApiResponse<Brand[]>> => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  return apiClient.get(`/brands?${query.toString()}`);
};

export const getProductReviews = async (
  productId: string
): Promise<ApiResponse<Review[]>> => {
  return apiClient.get(`/products/${productId}/reviews`);
};

export const createReview = async (
  productId: string,
  payload: Partial<Review>
): Promise<ApiResponse<Review>> => {
  return apiClient.post(`/products/${productId}/reviews`, payload);
};

export const updateReview = async (
  reviewId: string,
  payload: Partial<Review>
): Promise<ApiResponse<Review>> => {
  return apiClient.put(`/reviews/${reviewId}`, payload);
};

export const deleteReview = async (
  reviewId: string
): Promise<ApiResponse<null>> => {
  return apiClient.del(`/reviews/${reviewId}`);
};

// advanced filter (POST to /products/filter)
export const filterProductsAdvanced = async (
  payload: Record<string, any>
): Promise<ApiResponse<any>> => {
  return apiClient.post('/products/filter', payload);
};
