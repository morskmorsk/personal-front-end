// src/app/items/item-edit-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Item</h2>
    <mat-dialog-content>
      <form>
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="data.name" name="name" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="data.description" name="description"></textarea>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="data.quantity" name="quantity" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input matInput type="number" [(ngModel)]="data.price" name="price" step="0.01" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="data.category" name="category" required>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Location</mat-label>
          <mat-select [(ngModel)]="data.location" name="location" required>
            <mat-option *ngFor="let location of locations" [value]="location.id">
              {{ location.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Barcode</mat-label>
          <input matInput [(ngModel)]="data.barcode" name="barcode">
        </mat-form-field>
        <input type="file" (change)="onFileSelected($event)" accept="image/*">
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
  `]
})
export class ItemEditDialogComponent implements OnInit {
  categories: any[] = [];
  locations: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadLocations();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data.results || data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadLocations() {
    this.apiService.getLocations().subscribe(
      (data) => {
        this.locations = data.results || data;
      },
      (error) => {
        console.error('Error loading locations:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.data.image = file;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}