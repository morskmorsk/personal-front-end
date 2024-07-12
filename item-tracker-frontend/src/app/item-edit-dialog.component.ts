import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
        <!-- Add more fields as needed -->
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Save</button>
    </mat-dialog-actions>
  `
})
export class ItemEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}