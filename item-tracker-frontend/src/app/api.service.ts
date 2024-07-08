// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor() { }
// }

// src/app/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api/';  // Replace with your Django API URL
  private token = 'your_auth_token_here';  // Replace with actual token management

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.token}`
    });
  }

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}items/`, { headers: this.getHeaders() });
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