import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryRoute } from '../models/delivery.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/delivery`;

  constructor(private http: HttpClient) {}

  // Get all delivery routes
  getAllRoutes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/routes`);
  }

  // Get route by ID
  getRouteById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/routes/${id}`);
  }

  // Get routes by status
  getRoutesByStatus(status: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/routes/status/${status}`);
  }

  // Get driver's routes
  getMyRoutes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-routes`);
  }

  // Create new delivery route
  createRoute(route: DeliveryRoute): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/routes`, route);
  }

  // Update delivery route
  updateRoute(id: string, route: Partial<DeliveryRoute>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/routes/${id}`, route);
  }

  // Start route
  startRoute(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/routes/${id}/start`, {});
  }

  // Complete route
  completeRoute(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/routes/${id}/complete`, {});
  }

  // Update delivery stop status
  updateStopStatus(routeId: string, stopIndex: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/routes/${routeId}/stops/${stopIndex}`, updates);
  }

  // Delete route
  deleteRoute(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/routes/${id}`);
  }
}
