import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { ModerationService } from '../../../core/services/moderation.service';
import { Utilisateur } from '../../../core/models/utilisateur.model';

interface Notification {
  icon: string;
  title: string;
  time: string;
  type: 'info' | 'warning';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  currentUser: Utilisateur | null = null;
  notificationCount = 0;
  notifications: Notification[] = [];

  constructor(
    private authService: AuthService,
    private moderationService: ModerationService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur actuel
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Charger le nombre de produits en attente
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.moderationService.compterEnAttente().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.notificationCount = response.data as number;
          
          if (this.notificationCount > 0) {
            this.notifications = [{
              icon: 'pending_actions',
              title: `${this.notificationCount} produit(s) en attente de modération`,
              time: 'Maintenant',
              type: 'warning'
            }];
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}