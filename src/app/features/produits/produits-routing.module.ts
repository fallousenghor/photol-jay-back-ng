import { Routes } from '@angular/router';

export const PRODUITS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./liste-produits/liste-produits.component').then(m => m.ListeProduitsComponent)
  }
];