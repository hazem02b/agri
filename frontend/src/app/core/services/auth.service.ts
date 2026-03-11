import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, SignupRequest, AuthResponse, User, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }
  
  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    const user: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      phone: response.phone || '',
      role: response.role as any,
      address: response.address,
      profileImage: response.profileImage,
      isVerified: response.isVerified || false,
      isActive: response.isActive || true,
      farmerProfile: response.farmerProfile,
      favoriteProducts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  private loadCurrentUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/profile`, data).pipe(
      tap(user => {
        const updatedUser = {
          ...this.currentUserSubject.value,
          ...user
        } as User;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/change-password`, data);
  }
}
