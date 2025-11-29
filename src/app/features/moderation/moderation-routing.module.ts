import { Routes } from '@angular/router';

export const MODERATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./liste-attente/liste-attente.component').then(m => m.ListeAttenteComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detail-produit/detail-produit.component').then(m => m.DetailProduitComponent)
  }
];