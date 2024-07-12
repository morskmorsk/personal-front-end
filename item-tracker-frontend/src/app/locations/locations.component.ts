// src/app/locations/locations.component.ts

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
import { LocationEditDialogComponent } from './location-edit-dialog.component';

@Component({
  selector: 'app-locations',
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
      <mat-tab label="Location List">
        <div class="location-list">
          <mat-card *ngFor="let location of locations" class="location-card">
            <mat-card-header>
              <mat-card-title>{{ location.name }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ location.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="editLocation(location)">EDIT</button>
              <button mat-button color="warn" (click)="deleteLocation(location)">DELETE</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </mat-tab>
      <mat-tab label="Add New Location">
        <form (ngSubmit)="createLocation()" class="location-form">
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput [(ngModel)]="newLocation.name" name="name" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="newLocation.description" name="description"></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Create Location</button>
        </form>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .location-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .location-card {
      height: 100%;
    }
    .location-form {
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
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  newLocation: any = {};

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.apiService.getLocations().subscribe(
      (data) => {
        this.locations = data.results || data;
      },
      (error) => {
        console.error('Error loading locations:', error);
        this.showSnackBar('Error loading locations');
      }
    );
  }

  createLocation(): void {
    this.apiService.createLocation(this.newLocation).subscribe(
      (data) => {
        this.locations.push(data);
        this.newLocation = {};
        this.showSnackBar('Location created successfully');
      },
      (error) => {
        console.error('Error creating location:', error);
        this.showSnackBar('Error creating location');
      }
    );
  }

  editLocation(location: any): void {
    const dialogRef = this.dialog.open(LocationEditDialogComponent, {
      width: '400px',
      data: { ...location }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateLocation(location.id, result).subscribe(
          updatedLocation => {
            const index = this.locations.findIndex(l => l.id === updatedLocation.id);
            if (index !== -1) {
              this.locations[index] = updatedLocation;
            }
            this.showSnackBar('Location updated successfully');
          },
          error => {
            console.error('Error updating location:', error);
            this.showSnackBar('Error updating location');
          }
        );
      }
    });
  }

  deleteLocation(location: any): void {
    if (confirm(`Are you sure you want to delete ${location.name}?`)) {
      this.apiService.deleteLocation(location.id).subscribe(
        () => {
          this.locations = this.locations.filter(l => l.id !== location.id);
          this.showSnackBar('Location deleted successfully');
        },
        error => {
          console.error('Error deleting location:', error);
          this.showSnackBar('Error deleting location');
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
