import { ApiResponse } from './api-response';

// interfaces/service-order.interface.ts
export interface ServiceOrder {
  id: number;
  equipment: string;
  problem: string;
  description: string;
  servicePrice: number;
  entryDate: string;
  completionDate?: string;
  status: string;
  userId: number;
  usedItemsCount: number;
  totalCost: number;
}

export interface ServiceOrderDetail {
  id: number;
  equipment: string;
  problem: string;
  description: string;
  servicePrice: number;
  entryDate: string;
  completionDate?: string;
  status: string;
  userId: number;
  usedItems: UsedItem[];
  totalItemsCost: number;
  totalCost: number;
}

export interface UsedItem {
  id: number;
  serviceOrderId: number;
  item: Item;
  quantity: number;
  totalPrice: number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: number;
}

export interface ServiceOrderResponse extends ApiResponse<ServiceOrder[]> {}
export interface ServiceOrderDetailResponse extends ApiResponse<ServiceOrderDetail> {}
