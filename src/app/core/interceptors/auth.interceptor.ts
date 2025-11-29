import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Récupérer le token
  const token = authService.getToken();
  
  // Cloner la requête et ajouter le header Authorization
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Passer la requête et gérer les erreurs
  return next(authReq).pipe(
    catchError((error) => {
      // Si erreur 401 (non autorisé), déconnecter l'utilisateur
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};