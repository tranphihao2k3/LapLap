import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  Order,
  Product,
} from '@/types/api';

// Order endpoints
export const getOrders = async (
  params: Record<string, any> = {}
): Promise<ApiResponse<Order[]>> => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  return apiClient.get(`/orders?${query.toString()}`);
};

export const filterOrders = getOrders;

export const getOrder = async (
  id: string
): Promise<ApiResponse<Order>> => {
  return apiClient.get(`/orders/${id}`);
};

export const getMyOrders = async (): Promise<ApiResponse<Order[]>> => {
  return apiClient.get('/orders/my');
};

export const createOrder = async (
  payload: Partial<Order>
): Promise<ApiResponse<Order>> => {
  return apiClient.post('/orders', payload);
};

export const updateOrder = async (
  id: string,
  payload: Partial<Order>
): Promise<ApiResponse<Order>> => {
  return apiClient.put(`/orders/${id}`, payload);
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<ApiResponse<Order>> => {
  return apiClient.put(`/orders/${id}`, { status });
};

export const cancelOrder = async (
  id: string
): Promise<ApiResponse<Order>> => {
  return apiClient.post(`/orders/${id}/cancel`, {});
};

export const confirmOrderPayment = async (
  id: string
): Promise<ApiResponse<Order>> => {
  return apiClient.post(`/orders/${id}/confirm-payment`, {});
};

export const generateTrackingNumber = async (
  id: string
): Promise<ApiResponse<{ trackingNumber: string }>> => {
  return apiClient.post(`/orders/${id}/generate-tracking`, {});
};

// purchase order
export const getPurchaseOrders = async (): Promise<
  ApiResponse<any[]>
> => {
  return apiClient.get('/purchase-orders');
};

export const createPurchaseOrder = async (
  payload: any
): Promise<ApiResponse<any>> => {
  return apiClient.post('/purchase-orders', payload);
};
