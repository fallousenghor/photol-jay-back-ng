import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Produit, ModerationRequest, StatistiquesModeration } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  private apiUrl = `${environment.apiUrl}/moderation`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les produits en attente de modération
   */
  getProduitsEnAttente(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Produit>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<Produit>>>(`${this.apiUrl}/en-attente`, { params });
  }

  /**
   * Approuver un produit
   */
  approuverProduit(produitId: number, request?: ModerationRequest): Observable<ApiResponse<Produit>> {
    return this.http.post<ApiResponse<Produit>>(
      `${this.apiUrl}/${produitId}/approuver`,
      request || { action: 'APPROUVER' }
    );
  }

  /**
   * Rejeter un produit
   */
  rejeterProduit(produitId: number, request: ModerationRequest): Observable<ApiResponse<Produit>> {
    return this.http.post<ApiResponse<Produit>>(
      `${this.apiUrl}/${produitId}/rejeter`,
      request
    );
  }

  /**
   * Suspendre un produit
   */
  suspendreProduit(produitId: number, request: ModerationRequest): Observable<ApiResponse<Produit>> {
    return this.http.post<ApiResponse<Produit>>(
      `${this.apiUrl}/${produitId}/suspendre`,
      request
    );
  }

  /**
   * Récupérer les statistiques de modération
   */
  getStatistiques(): Observable<ApiResponse<StatistiquesModeration>> {
    return this.http.get<ApiResponse<StatistiquesModeration>>(`${this.apiUrl}/stats`);
  }

  /**
   * Compter les produits en attente
   */
  compterEnAttente(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count-en-attente`);
  }
}