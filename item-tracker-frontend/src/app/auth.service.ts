import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.9:8000/api/'; //'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}token/`, { username, password })
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access);
    localStorage.setItem('refresh_token', authResult.refresh);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.apiUrl}token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access);
        })
      );
  }
}