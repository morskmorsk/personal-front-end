// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-items',
//   standalone: true,
//   imports: [],
//   templateUrl: './items.component.html',
//   styleUrl: './items.component.css'
// })
// export class ItemsComponent {

// }

// src/app/items/items.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  categories: any[] = [];
  locations: any[] = [];
  newItem: any = {};

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    this.loadLocations();
  }

  loadItems(): void {
    this.apiService.getItems().subscribe(
      (data) => {
        this.items = data.results;
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data.results;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadLocations(): void {
    this.apiService.getLocations().subscribe(
      (data) => {
        this.locations = data.results;
      },
      (error) => {
        console.error('Error loading locations:', error);
      }
    );
  }

  createItem(): void {
    this.apiService.createItem(this.newItem).subscribe(
      (data) => {
        this.items.push(data);
        this.newItem = {};
      },
      (error) => {
        console.error('Error creating item:', error);
      }
    );
  }
}