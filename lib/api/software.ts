import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';

// public software endpoints
export const getSoftwares = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/software');
};

export const getSoftware = async (slug: string): Promise<ApiResponse<any>> => {
  return apiClient.get(`/software/${slug}`);
};

// additional endpoints can be added as needed
