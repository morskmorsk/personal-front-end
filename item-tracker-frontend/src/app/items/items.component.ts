import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { ItemEditDialogComponent } from '../item-edit-dialog.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatSelectModule, 
    MatGridListModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <mat-tab-group>
      <mat-tab label="Item List">
        <div class="item-list">
          <mat-card *ngFor="let item of items" class="item-card">
            <mat-card-header>
              <mat-card-title>{{ item.name || 'Unnamed Item' }}</mat-card-title>
              <mat-card-subtitle>
                <mat-chip-set>
                  <mat-chip *ngIf="item.category">{{ item.category.name || item.category }}</mat-chip>
                  <mat-chip *ngIf="item.location">{{ item.location.name || item.location }}</mat-chip>
                </mat-chip-set>
              </mat-card-subtitle>
            </mat-card-header>
            <img mat-card-image [src]="item.image" alt="{{ item.name }}" *ngIf="item.image">
            <mat-card-content>
              <p *ngIf="item.description">{{ item.description }}</p>
              <mat-divider></mat-divider>
              <p><strong>Quantity:</strong> {{ item.quantity !== undefined ? item.quantity : 'N/A' }}</p>
              <p *ngIf="item.price !== undefined"><strong>Price:</strong> {{ item.price | currency }}</p>
              <p *ngIf="item.barcode"><strong>Barcode:</strong> {{ item.barcode }}</p>
              <p *ngIf="item.date_added"><strong>Added:</strong> {{ item.date_added | date }}</p>
              <p><strong>Available:</strong> {{ item.is_available ? 'Yes' : 'No' }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="editItem(item)">EDIT</button>
              <button mat-button color="warn" (click)="deleteItem(item)">DELETE</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </mat-tab>
      <mat-tab label="Add New Item">
        <!-- Existing form for adding new items -->
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .item-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .item-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .item-card mat-card-content {
      flex-grow: 1;
    }
    .new-item-form {
      display: flex;
      flex-direction: column;
      max-width: 500px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .file-input {
      margin-bottom: 1rem;
    }
    .file-input button {
      margin-right: 1rem;
    }
  `]
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  categories: any[] = [];
  locations: any[] = [];
  newItem: any = {};
  selectedFile: File | null = null;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    this.loadLocations();
  }

  loadItems(): void {
    this.apiService.getItems().subscribe(
      (data) => {
        console.log('Received items data:', data);
        this.items = data.results || data;
        if (this.items.length > 0) {
          console.log('First item:', this.items[0]);
        }
      },
      (error) => {
        console.error('Error loading items:', error);
        this.showSnackBar('Error loading items');
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
        this.showSnackBar('Error loading categories');
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
        this.showSnackBar('Error loading locations');
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
        this.loadItems();
        this.showSnackBar('Item created successfully');
      },
      (error) => {
        console.error('Error creating item:', error);
        this.showSnackBar('Error creating item');
      }
    );
  }
//////////////////////////////////////////////////////////
// editItem(item: any): void {
//   // Open a dialog for editing the item
//   const dialogRef = this.dialog.open(ItemEditDialogComponent, {
//     width: '400px',
//     data: { ...item }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       this.apiService.updateItem(item.id, result).subscribe(
//         updatedItem => {
//           const index = this.items.findIndex(i => i.id === updatedItem.id);
//           if (index !== -1) {
//             this.items[index] = updatedItem;
//           }
//           this.showSnackBar('Item updated successfully');
//         },
//         error => {
//           console.error('Error updating item:', error);
//           this.showSnackBar('Error updating item');
//         }
//       );
//     }
//   });
// }
editItem(item: any): void {
  const dialogRef = this.dialog.open(ItemEditDialogComponent, {
    width: '400px',
    data: { ...item }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const updatedItem = { ...result };
      const updatedImage = result.image instanceof File ? result.image : null;
      delete updatedItem.image;  // Remove image from the main object

      this.apiService.updateItem(item.id, updatedItem, updatedImage).subscribe(
        updatedItem => {
          const index = this.items.findIndex(i => i.id === updatedItem.id);
          if (index !== -1) {
            this.items[index] = updatedItem;
          }
          this.showSnackBar('Item updated successfully');
        },
        error => {
          console.error('Error updating item:', error);
          this.showSnackBar('Error updating item');
        }
      );
    }
  });
}

deleteItem(item: any): void {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    this.apiService.deleteItem(item.id).subscribe(
      () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.showSnackBar('Item deleted successfully');
      },
      error => {
        console.error('Error deleting item:', error);
        this.showSnackBar('Error deleting item');
      }
    );
  }
}

//////////////////////////////////////////////////////////



  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}