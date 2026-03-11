import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private apiUrl = `${environment.apiUrl}/farmers`;
  
  constructor(private http: HttpClient) {}
  
  getAllFarmers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/public/all`);
  }
  
  getFarmerById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/public/${id}`);
  }
  
  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }
  
  updateProfile(user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/profile`, user);
  }
  
  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/my-products`);
  }
}
