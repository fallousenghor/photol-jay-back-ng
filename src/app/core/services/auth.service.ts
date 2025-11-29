import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, Utilisateur } from '../models/utilisateur.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  /**
   * Connexion
   */
  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getCurrentUserProfile(): Observable<ApiResponse<Utilisateur>> {
    return this.http.get<ApiResponse<Utilisateur>>(`${this.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  /**
   * Sauvegarder la session
   */
  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    
    const user: Utilisateur = {
      id: authResponse.id,
      email: authResponse.email,
      nom: authResponse.nom,
      prenom: authResponse.prenom,
      telephone: authResponse.telephone,
      role: authResponse.role as any,
      actif: true,
      emailVerifie: true,
      telephoneVerifie: false,
      dateInscription: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Charger l'utilisateur depuis le localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Erreur lors du parsing de l\'utilisateur', e);
      }
    }
  }

  /**
   * Récupérer le token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate > new Date();
    } catch (e) {
      return false;
    }
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN';
  }

  /**
   * Vérifier si l'utilisateur est modérateur
   */
  isModerator(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'MODERATEUR' || user?.role === 'ADMIN';
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }
}