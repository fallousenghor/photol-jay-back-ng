import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./liste-categories/liste-categories.component').then(m => m.ListeCategoriesComponent)
  }
];