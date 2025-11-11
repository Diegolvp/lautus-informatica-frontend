// services/service-order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  ServiceOrder,
  ServiceOrderDetail,
  ServiceOrderCreateRequest,
  ServiceOrderUpdateRequest,
  ChangeStatusRequest,
  ServiceOrderResponse,
  ServiceOrderDetailResponse,
  ServiceOrderCreateResponse,
  ServiceOrderUpdateResponse,
} from '../interfaces/service-orders.interface';
import { ApiResponse } from '../interfaces/api-response';
import { tap, catchError } from 'rxjs/operators';

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

  createServiceOrder(
    serviceOrder: ServiceOrderCreateRequest,
    token: string
  ): Observable<ServiceOrderCreateResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<ServiceOrderCreateResponse>(this.baseUrl, serviceOrder, { headers });
  }

  updateServiceOrder(
    id: number,
    serviceOrder: ServiceOrderUpdateRequest,
    token: string
  ): Observable<ServiceOrderUpdateResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<ServiceOrderUpdateResponse>(`${this.baseUrl}/${id}`, serviceOrder, {
      headers,
    });
  }

  deleteServiceOrder(id: number, token: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`, { headers });
  }

  // services/service-order.service.ts
  changeStatus(id: number, status: number, token: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // CONVERTER PARA NÚMERO - Isso é crítico!
    const statusNumber = Number(status);

    console.log(
      '🎯 SERVICE: Status convertido para número:',
      statusNumber,
      'Tipo:',
      typeof statusNumber
    );

    const body = {
      changeStatusRequestDTO: {
        Status: statusNumber, // ✅ Agora é número
      },
    };

    console.log('🎯 SERVICE: Enviando PATCH para:', `${this.baseUrl}/${id}/status`);
    console.log('🎯 SERVICE: Payload:', body);

    return this.http
      .patch<ApiResponse<boolean>>(`${this.baseUrl}/${id}/status`, body, { headers })
      .pipe(
        tap((response: any) => console.log('✅ SERVICE: Resposta:', response)),
        catchError((error: any) => {
          console.error('❌ SERVICE: Erro:', error);
          console.error('❌ SERVICE: Detalhes do erro:', error.error);
          return throwError(() => error);
        })
      );
  }
  completeServiceOrder(
    id: number,
    completionDate: string,
    token: string
  ): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch<ApiResponse<boolean>>(
      `${this.baseUrl}/${id}/complete`,
      { completionDate },
      { headers }
    );
  }
}
