import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { ModerationService } from '../../../core/services/moderation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  
  isAdmin = false;
  isModerator = false;
  produitsEnAttente = 0;

  constructor(
    private authService: AuthService,
    private moderationService: ModerationService
  ) {}

  ngOnInit(): void {
    // Vérifier les rôles
    this.isAdmin = this.authService.isAdmin();
    this.isModerator = this.authService.isModerator();

    // Charger le nombre de produits en attente
    if (this.isModerator) {
      this.loadProduitsEnAttente();
      
      // Actualiser toutes les 30 secondes
      setInterval(() => {
        this.loadProduitsEnAttente();
      }, 30000);
    }
  }

  loadProduitsEnAttente(): void {
    this.moderationService.compterEnAttente().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.produitsEnAttente = response.data as number;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits en attente:', error);
      }
    });
  }

  toggle(): void {
    this.drawer.toggle();
  }
}