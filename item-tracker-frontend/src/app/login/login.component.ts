// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" name="username" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" [(ngModel)]="password" name="password" required>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Login</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .login-card {
      max-width: 400px;
      margin: 2em auto;
      text-align: center;
    }
    mat-form-field {
      display: block;
      margin-bottom: 1em;
    }
  `]
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