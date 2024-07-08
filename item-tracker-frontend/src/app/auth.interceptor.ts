// src/app/auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Get the new token
              const token = this.authService.getToken();
              // Clone the request and replace the old header with the new one
              const clonedRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              // Retry the request with the new token
              return next.handle(clonedRequest);
            }),
            catchError(refreshError => {
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}