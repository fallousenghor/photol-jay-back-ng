import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Categorie, CategorieRequest } from '../models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les catégories actives
   */
  getCategoriesActives(): Observable<ApiResponse<Categorie[]>> {
    return this.http.get<ApiResponse<Categorie[]>>(this.apiUrl);
  }

  /**
   * Récupérer toutes les catégories (Admin)
   */
  getToutesCategories(): Observable<ApiResponse<Categorie[]>> {
    return this.http.get<ApiResponse<Categorie[]>>(`${this.apiUrl}/toutes`);
  }

  /**
   * Créer une catégorie
   */
  creerCategorie(request: CategorieRequest): Observable<ApiResponse<Categorie>> {
    return this.http.post<ApiResponse<Categorie>>(this.apiUrl, request);
  }

  /**
   * Mettre à jour une catégorie
   */
  updateCategorie(id: number, request: CategorieRequest): Observable<ApiResponse<Categorie>> {
    return this.http.put<ApiResponse<Categorie>>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Activer une catégorie
   */
  activerCategorie(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/activer`, {});
  }

  /**
   * Désactiver une catégorie
   */
  desactiverCategorie(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/desactiver`, {});
  }
}