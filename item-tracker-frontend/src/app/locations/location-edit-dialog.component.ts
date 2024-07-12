// src/app/locations/location-edit-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-location-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Location</h2>
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
export class LocationEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LocationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}