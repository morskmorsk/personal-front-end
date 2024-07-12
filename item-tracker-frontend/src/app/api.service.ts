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

  // updateItem(id: number, item: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}items/${id}/`, item, { headers: this.getHeaders() });
  // }
  updateItem(id: number, item: any, image: File | null): Observable<any> {
    const formData = new FormData();
    for (const key in item) {
      if (key !== 'image') {
        formData.append(key, item[key]);
      }
    }
    if (image) {
      formData.append('image', image, image.name);
    }
    return this.http.put(`${this.apiUrl}items/${id}/`, formData, { headers: this.getHeaders() });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}items/${id}/`, { headers: this.getHeaders() });
  }

  // getCategories(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}categories/`, { headers: this.getHeaders() });
  // }

  // getLocations(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}locations/`, { headers: this.getHeaders() });
  // }

  // Add similar methods for categories and locations...

  // Location methods
  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}locations/`, { headers: this.getHeaders() });
  }

  getLocation(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}locations/${id}/`, { headers: this.getHeaders() });
  }

  createLocation(location: any): Observable<any> {
    return this.http.post(`${this.apiUrl}locations/`, location, { headers: this.getHeaders() });
  }

  updateLocation(id: number, location: any): Observable<any> {
    return this.http.put(`${this.apiUrl}locations/${id}/`, location, { headers: this.getHeaders() });
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}locations/${id}/`, { headers: this.getHeaders() });
  }

  // Category methods
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}categories/`, { headers: this.getHeaders() });
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}categories/${id}/`, { headers: this.getHeaders() });
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}categories/`, category, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}categories/${id}/`, category, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}categories/${id}/`, { headers: this.getHeaders() });
  }

}
