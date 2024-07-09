// src/app/items/items.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatGridListModule],
  template: `
    <h2>Items</h2>
    <mat-grid-list cols="3" rowHeight="350px">
      <mat-grid-tile *ngFor="let item of items">
        <mat-card class="item-card">
          <mat-card-header>
            <mat-card-title>{{ item.name }}</mat-card-title>
          </mat-card-header>
          <img mat-card-image [src]="item.image" alt="{{ item.name }}" *ngIf="item.image">
          <mat-card-content>
            <p>{{ item.description }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <p>Price: {{ item.price | currency }}</p>
            <p>Category: {{ item.category }}</p>
            <p>Location: {{ item.location }}</p>
            <p>Barcode: {{ item.barcode }}</p>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>

    <h3>Add New Item</h3>
    <form (ngSubmit)="createItem()">
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="newItem.name" name="name" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="newItem.description" name="description"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Quantity</mat-label>
        <input matInput type="number" [(ngModel)]="newItem.quantity" name="quantity" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Price</mat-label>
        <input matInput type="number" [(ngModel)]="newItem.price" name="price" step="0.01" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="newItem.category" name="category" required>
          <mat-option *ngFor="let category of categories" [value]="category.id">
            {{ category.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Location</mat-label>
        <mat-select [(ngModel)]="newItem.location" name="location" required>
          <mat-option *ngFor="let location of locations" [value]="location.id">
            {{ location.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Barcode</mat-label>
        <input matInput [(ngModel)]="newItem.barcode" name="barcode">
      </mat-form-field>
      <input type="file" (change)="onFileSelected($event)" accept="image/*">
      <button mat-raised-button color="primary" type="submit">Create Item</button>
    </form>
  `,
  styles: [`
    .item-card {
      max-width: 300px;
      margin: 1em;
    }
    mat-form-field {
      display: block;
      margin-bottom: 1em;
    }
  `]
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  categories: any[] = [];
  locations: any[] = [];
  newItem: any = {};
  selectedFile: File | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    this.loadLocations();
  }

  loadItems(): void {
    this.apiService.getItems().subscribe(
      (data) => {
        this.items = data.results || data;
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data.results || data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadLocations(): void {
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
    this.selectedFile = event.target.files[0] as File;
  }

  createItem(): void {
    const formData = new FormData();
    for (const key in this.newItem) {
      formData.append(key, this.newItem[key]);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.createItem(formData).subscribe(
      (data) => {
        this.items.push(data);
        this.newItem = {};
        this.selectedFile = null;
        this.loadItems();  // Reload the items to get the updated list
      },
      (error) => {
        console.error('Error creating item:', error);
      }
    );
  }
}