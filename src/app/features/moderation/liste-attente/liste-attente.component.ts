import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModerationService } from '../../../core/services/moderation.service';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-liste-attente',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './liste-attente.component.html',
  styleUrl: './liste-attente.component.scss'
})
export class ListeAttenteComponent implements OnInit {
  produits: Produit[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(
    private moderationService: ModerationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;
    
    this.moderationService.getProduitsEnAttente(this.currentPage, this.pageSize).subscribe({
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProduits();
  }

  voirDetail(produitId: number): void {
    this.router.navigate(['/moderation/detail', produitId]);
  }

  approuver(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir approuver le produit "${produit.nom}" ?`)) {
      this.moderationService.approuverProduit(produit.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Produit approuvé avec succès !');
            this.loadProduits();
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'approbation:', error);
          alert('Erreur lors de l\'approbation du produit');
        }
      });
    }
  }

  rejeter(produit: Produit): void {
    const motif = prompt('Motif du rejet (obligatoire) :');
    
    if (motif && motif.trim()) {
      this.moderationService.rejeterProduit(produit.id, {
        action: 'REJETER',
        commentaire: motif
      }).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Produit rejeté avec succès !');
            this.loadProduits();
          }
        },
        error: (error) => {
          console.error('Erreur lors du rejet:', error);
          alert('Erreur lors du rejet du produit');
        }
      });
    } else if (motif !== null) {
      alert('Le motif du rejet est obligatoire');
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.png';
  }
}