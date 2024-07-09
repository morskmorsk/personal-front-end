// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'items', component: ItemsComponent },
];