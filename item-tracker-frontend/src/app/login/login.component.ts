// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div>
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/items']);
      },
      err => {
        this.error = 'Failed to login. Please check your credentials.';
        console.error('Login error:', err);
      }
    );
  }
}