// src/app/categories/categories.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { CategoryEditDialogComponent } from './category-edit-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatGridListModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <mat-tab-group>
      <mat-tab label="Category List">
        <div class="category-list">
          <mat-card *ngFor="let category of categories" class="category-card">
            <mat-card-header>
              <mat-card-title>{{ category.name }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ category.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="editCategory(category)">EDIT</button>
              <button mat-button color="warn" (click)="deleteCategory(category)">DELETE</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </mat-tab>
      <mat-tab label="Add New Category">
        <form (ngSubmit)="createCategory()" class="category-form">
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput [(ngModel)]="newCategory.name" name="name" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="newCategory.description" name="description"></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Create Category</button>
        </form>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .category-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .category-card {
      height: 100%;
    }
    .category-form {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 2rem auto;
      padding: 1rem;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  newCategory: any = {};

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data.results || data;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.showSnackBar('Error loading categories');
      }
    );
  }

  createCategory(): void {
    this.apiService.createCategory(this.newCategory).subscribe(
      (data) => {
        this.categories.push(data);
        this.newCategory = {};
        this.showSnackBar('Category created successfully');
      },
      (error) => {
        console.error('Error creating category:', error);
        this.showSnackBar('Error creating category');
      }
    );
  }

  editCategory(category: any): void {
    const dialogRef = this.dialog.open(CategoryEditDialogComponent, {
      width: '400px',
      data: { ...category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateCategory(category.id, result).subscribe(
          updatedCategory => {
            const index = this.categories.findIndex(c => c.id === updatedCategory.id);
            if (index !== -1) {
              this.categories[index] = updatedCategory;
            }
            this.showSnackBar('Category updated successfully');
          },
          error => {
            console.error('Error updating category:', error);
            this.showSnackBar('Error updating category');
          }
        );
      }
    });
  }

  deleteCategory(category: any): void {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      this.apiService.deleteCategory(category.id).subscribe(
        () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.showSnackBar('Category deleted successfully');
        },
        error => {
          console.error('Error deleting category:', error);
          this.showSnackBar('Error deleting category');
        }
      );
    }
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}