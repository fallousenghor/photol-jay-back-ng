import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les produits approuvés
   */
  getProduitsApprouves(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Produit>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<Produit>>>(this.apiUrl, { params });
  }

  /**
   * Récupérer un produit par ID
   */
  getProduitById(id: number): Observable<ApiResponse<Produit>> {
    return this.http.get<ApiResponse<Produit>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rechercher des produits
   */
  rechercherProduits(query: string, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Produit>>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<Produit>>>(`${this.apiUrl}/recherche`, { params });
  }

  /**
   * Récupérer les produits par catégorie
   */
  getProduitsByCategorie(categorieId: number, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Produit>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<Produit>>>(`${this.apiUrl}/categorie/${categorieId}`, { params });
  }

  /**
   * Supprimer un produit (Admin)
   */
  supprimerProduit(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}