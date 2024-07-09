// src/app/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.1.9:8000/api/'; //'http://localhost:8000/api/';  // Make sure this matches your Django API URL

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getItems(): Observable<any> {
    console.log('ApiService: Fetching items');
    return this.http.get(`${this.apiUrl}items/`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('ApiService: Items fetched', response)),
        catchError(error => {
          console.error('ApiService: Error fetching items', error);
          throw error;
        })
      );
  }

  createItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}items/`, item, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}categories/`, { headers: this.getHeaders() });
  }

  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}locations/`, { headers: this.getHeaders() });
  }
}