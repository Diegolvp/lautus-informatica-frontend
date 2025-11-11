import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ServiceOrder,
  ServiceOrderDetail,
  ServiceOrderResponse,
  ServiceOrderDetailResponse,
} from '../interfaces/service-orders.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  private baseUrl = 'http://localhost:5170/api/service-orders';

  constructor(private http: HttpClient) {}

  getServiceOrders(): Observable<ServiceOrderResponse> {
    return this.http.get<ServiceOrderResponse>(this.baseUrl);
  }

  getServiceOrderById(id: number): Observable<ServiceOrderDetailResponse> {
    return this.http.get<ServiceOrderDetailResponse>(`${this.baseUrl}/${id}`);
  }
}
