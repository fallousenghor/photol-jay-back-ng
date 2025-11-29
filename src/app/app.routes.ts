import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moderation',
    loadChildren: () => import('./features/moderation/moderation-routing.module').then(m => m.MODERATION_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'produits',
    loadChildren: () => import('./features/produits/produits-routing.module').then(m => m.PRODUITS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories-routing.module').then(m => m.CATEGORIES_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'utilisateurs',
    loadChildren: () => import('./features/utilisateurs/utilisateurs-routing.module').then(m => m.UTILISATEURS_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];