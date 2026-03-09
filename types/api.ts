// Generic response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

// Core models
export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  basePrice?: number;
  salePrice?: number;
  category?: Category | string;
  brand?: Brand | string;
  images?: string[];
  specs?: Record<string, any>;
  isUsed?: boolean;
  condition?: string;
  usedGrade?: string;
  warranty?: number;
  viewCount?: number;
  gift?: string;
  status?: string;
  image?: string;
  originalPrice?: number;
  categoryId?: Category | string;
  brandId?: Brand | string;
  warrantyMonths?: number;
  costPrice?: number;
  description?: string;
  conditionNote?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  website?: string;
  logo?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: User | string;
  product?: Product | string;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  customer?: Customer | string;
  status: string;
  shippingAddress?: Address;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthMeResponse {
  user: User;
}

// filter parameter types
export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  isUsed?: boolean;
  active?: boolean;
  sort?: string;
  specs?: string;
}
