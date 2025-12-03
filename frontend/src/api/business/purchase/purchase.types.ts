import type { CustomerModel } from "../../types/Models/CustomerModel";

export interface PurchaseModel {
  id: string;
  customer_id: string;
  business_id: string;
  amount: number;
  points: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  customer?: CustomerModel;
}

export interface PurchaseFilters {
  search?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number | null;
  to: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * GET purchases
 */
export interface GetPurchasesResponse {
  purchases: PurchaseModel[];
  pagination: PaginationMeta;
}

/**
 * POST create purchase
 */
export interface CreatePurchaseRequest {
  customer_id: string;
  amount: number;
  points: number;
  payment_method: string;
}

export interface CreatePurchaseResponse {
  purchase: PurchaseModel;
}
