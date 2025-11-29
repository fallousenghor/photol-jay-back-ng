import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ProduitService } from '../../../core/services/produit.service';
import { AuthService } from '../../../core/services/auth.service';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-liste-produits',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './liste-produits.component.html',
  styleUrl: './liste-produits.component.scss'
})
export class ListeProduitsComponent implements OnInit {
  produits: Produit[] = [];
  displayedColumns: string[] = ['image', 'nom', 'prix', 'vendeur', 'statut', 'vues', 'date', 'actions'];
  loading = false;
  searchQuery = '';
  filtreStatut = '';
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  isAdmin = false;
  isModerator = false;

  constructor(
    private produitService: ProduitService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isModerator = this.authService.isModerator();
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;

    this.produitService.getProduitsApprouves(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.produits = response.data.content;
          this.totalElements = response.data.totalElements;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loading = false;
      }
    });
  }

  rechercher(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.currentPage = 0;

      this.produitService.rechercherProduits(this.searchQuery, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.produits = response.data.content;
            this.totalElements = response.data.totalElements;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadProduits();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadProduits();
  }

  appliquerFiltre(): void {
    // TODO: Implémenter le filtrage par statut
    // Pour l'instant, on recharge tous les produits
    this.loadProduits();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    if (this.searchQuery.trim()) {
      this.rechercher();
    } else {
      this.loadProduits();
    }
  }

  voirDetail(produitId: number): void {
    this.router.navigate(['/moderation/detail', produitId]);
  }

  moderer(produitId: number): void {
    this.router.navigate(['/moderation/detail', produitId]);
  }

  supprimerProduit(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${produit.nom}" ?\nCette action est irréversible.`)) {
      this.produitService.supprimerProduit(produit.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Produit supprimé avec succès');
            this.loadProduits();
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  getStatutLabel(statut: string): string {
    const labels: any = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'SUSPENDU': 'Suspendu',
      'ARCHIVE': 'Archivé'
    };
    return labels[statut] || statut;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.png';
  }
}