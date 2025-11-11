// interfaces/service-order.interface.ts

import { ApiResponse } from './api-response';

export interface ServiceOrder {
  id: number;
  equipment: string;
  problem: string;
  description: string;
  servicePrice: number;
  entryDate: string; // DateOnly no back, string no front (YYYY-MM-DD)
  completionDate?: string; // Opcional
  status: string;
  userId: number;
  usedItemsCount: number;
  totalCost: number;
}
// interfaces/service-order.interface.ts
export enum Status {
  Pending = 1,
  InProgress = 2,
  WaitingParts = 3,
  Completed = 4,
  Cancelled = 5,
  Archived = 6,
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

// Para criar uma ordem de serviço
export interface ServiceOrderCreateRequest {
  equipment: string;
  problem: string;
  userId: number;
  description?: string;
  servicePrice: number;
  entryDate: string; // Formato YYYY-MM-DD
  completionDate?: string; // Formato YYYY-MM-DD
}

// Para atualizar uma ordem de serviço
export interface ServiceOrderUpdateRequest {
  equipment: string;
  problem: string;
  userId: number;
  description?: string;
  servicePrice: number;
  entryDate: string;
  completionDate?: string;
}

// Para mudar o status
// interfaces/service-order.interface.ts
export interface ChangeStatusRequest {
  changeStatusRequestDTO: {
    Status: number;
  };
}

// Respostas da API
export interface ServiceOrderResponse extends ApiResponse<ServiceOrder[]> {}
export interface ServiceOrderDetailResponse extends ApiResponse<ServiceOrderDetail> {}
export interface ServiceOrderCreateResponse extends ApiResponse<ServiceOrder> {}
export interface ServiceOrderUpdateResponse extends ApiResponse<ServiceOrder> {}
