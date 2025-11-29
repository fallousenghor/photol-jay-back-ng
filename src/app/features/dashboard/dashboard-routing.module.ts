import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ModerationService } from '../../core/services/moderation.service';
import { Utilisateur } from '../../core/models/utilisateur.model';
import { StatistiquesModeration } from '../../core/models/produit.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: Utilisateur | null = null;
  stats: StatistiquesModeration | null = null;
  loading = false;
  isAdmin = false;
  isModerator = false;

  constructor(
    private authService: AuthService,
    private moderationService: ModerationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.isModerator = this.authService.isModerator();
    
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading = true;
    
    this.moderationService.getStatistiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.loading = false;
      }
    });
  }
}