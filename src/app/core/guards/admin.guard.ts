import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn() && authService.isModerator()) {
    return true;
  }
  
  // Rediriger vers dashboard ou login
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};