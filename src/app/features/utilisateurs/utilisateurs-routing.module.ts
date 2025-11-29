import { Routes } from '@angular/router';

export const UTILISATEURS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./liste-utilisateurs/liste-utilisateurs.component').then(m => m.ListeUtilisateursComponent)
  }
];