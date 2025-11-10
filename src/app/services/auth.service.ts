import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { jwtDecode } from 'jwt-decode';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  email: string;
  role: 0 | 1; // ← ADICIONAR role no token
  name: string;
}

export interface LoginResponse extends ApiResponse<LoginResponseData> {
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5170/api';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  setToken(token: string | undefined): void {
    if (token) localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return parseInt(decoded.role);
    } catch (error) {
      return null;
    }
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<User>(token);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 0;
  }
}