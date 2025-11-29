import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ModerationService } from '../../core/services/moderation.service';
import { StatistiquesModeration } from '../../core/models/produit.model';
import { Utilisateur } from '../../core/models/utilisateur.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: StatistiquesModeration | null = null;
  currentUser: Utilisateur | null = null;
  isModerator = false;
  isAdmin = false;
  loading = true;

  constructor(
    private authService: AuthService,
    private moderationService: ModerationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isModerator = this.authService.isModerator();
    this.isAdmin = this.authService.isAdmin();

    this.loadStats();
  }

  private loadStats(): void {
    this.moderationService.getStatistiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
        this.loading = false;
      }
    });
  }
}
