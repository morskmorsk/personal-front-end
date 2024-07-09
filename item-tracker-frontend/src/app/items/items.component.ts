// src/app/items/items.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  categories: any[] = [];
  locations: any[] = [];
  newItem: any = {};

  constructor(private apiService: ApiService) {
    console.log('ItemsComponent constructor called');
  }

  ngOnInit(): void {
    console.log('ItemsComponent ngOnInit called');
    this.loadItems();
    this.loadCategories();
    this.loadLocations();
  }

  loadItems(): void {
    console.log('Loading items...');
    this.apiService.getItems().subscribe(
      (data) => {
        console.log('Items loaded:', data);
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