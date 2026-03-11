import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest, OrderStatus } from '../models/order.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  
  constructor(private http: HttpClient) {}
  
  createOrder(orderRequest: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderRequest);
  }
  
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  
  getBuyerOrders(buyerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/buyer/${buyerId}`);
  }
  
  getFarmerOrders(farmerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/farmer/${farmerId}`);
  }
  
  getMyFarmerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/farmer/my-orders`);
  }
  
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
  
  updateOrderStatus(id: string, status: OrderStatus, description?: string): Observable<ApiResponse<Order>> {
    let params = new HttpParams().set('status', status);
    if (description) {
      params = params.set('description', description);
    }
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${id}/status`, null, { params });
  }
  
  cancelOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.delete<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }
}
