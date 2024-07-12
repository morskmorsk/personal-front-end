// src/app/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.1.9:8000/api/';  // Update with your actual API URL

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}items/`, { headers: this.getHeaders() });
  }

  createItem(item: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}items/`, item, { headers: this.getHeaders() });
  }

  updateItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}items/${id}/`, item, { headers: this.getHeaders() });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}items/${id}/`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}categories/`, { headers: this.getHeaders() });
  }

  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}locations/`, { headers: this.getHeaders() });
  }

  // Add similar methods for categories and locations...
}
