import { apiClient } from '@/lib/api';
import { ApiResponse, User, Customer, Order, Product } from '@/types/api';

// user management
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiClient.get('/users');
};

export const createUser = async (
  payload: Partial<User>
): Promise<ApiResponse<User>> => {
  return apiClient.post('/users', payload);
};

export const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<ApiResponse<User>> => {
  return apiClient.put(`/users/${id}`, payload);
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  return apiClient.del(`/users/${id}`);
};

// customer management
export const getCustomers = async (): Promise<ApiResponse<Customer[]>> => {
  return apiClient.get('/customers');
};

export const searchCustomers = async (
  query: string
): Promise<ApiResponse<Customer[]>> => {
  return apiClient.get(`/customers?search=${encodeURIComponent(query)}`);
};

export const addLoyaltyPoints = async (
  customerId: string,
  points: number
): Promise<ApiResponse<any>> => {
  return apiClient.post(`/customers/${customerId}/loyalty`, { points });
};

// coupons
export const getCoupons = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/coupons');
};

export const validateCouponCode = async (
  code: string
): Promise<ApiResponse<any>> => {
  return apiClient.post('/coupons/validate', { code });
};

// inventory
export const getInventory = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/inventories');
};

export const restockProduct = async (
  productId: string,
  quantity: number
): Promise<ApiResponse<any>> => {
  return apiClient.post(`/inventories/${productId}/restock`, { quantity });
};

export const getLowStockProducts = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/inventories/low-stock');
};

// blog
export const getBlogs = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/blog');
};

// fetch single blog by slug or id
export const getBlog = async (slug: string): Promise<ApiResponse<any>> => {
  return apiClient.get(`/blog/${slug}`);
};

export const createBlog = async (
  payload: any
): Promise<ApiResponse<any>> => {
  return apiClient.post('/blog', payload);
};

export const updateBlog = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  return apiClient.put(`/blog/${id}`, payload);
};

export const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
  return apiClient.del(`/blog/${id}`);
};

// dashboard
export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
  return apiClient.get('/dashboard');
};

export const getSalesReport = async (params: any = {}): Promise<ApiResponse<any>> => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  return apiClient.get(`/dashboard/sales?${query.toString()}`);
};
