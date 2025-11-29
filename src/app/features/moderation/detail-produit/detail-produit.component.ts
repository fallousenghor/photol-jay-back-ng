import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../../core/services/produit.service';
import { ModerationService } from '../../../core/services/moderation.service';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-dialog-rejet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Rejeter le produit</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Motif du rejet</mat-label>
          <textarea 
            matInput 
            formControlName="motif"
            rows="5"
            placeholder="Expliquez pourquoi ce produit est rejeté..."
            required></textarea>
          <mat-error *ngIf="form.get('motif')?.hasError('required')">
            Le motif est obligatoire
          </mat-error>
          <mat-error *ngIf="form.get('motif')?.hasError('minlength')">
            Le motif doit contenir au moins 10 caractères
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button 
        mat-raised-button 
        color="warn" 
        [disabled]="form.invalid"
        (click)="onSubmit()">
        Rejeter
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }
  `]
})
export class DialogRejetComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogRejetComponent>
  ) {
    this.form = this.fb.group({
      motif: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.motif);
    }
  }
}

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './detail-produit.component.html',
  styleUrl: './detail-produit.component.scss'
})
export class DetailProduitComponent implements OnInit {
  produit: Produit | null = null;
  loading = false;
  error = '';
  actionEnCours = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    private moderationService: ModerationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadProduit(+id);
    }
  }

  loadProduit(id: number): void {
    this.loading = true;
    this.error = '';

    this.produitService.getProduitById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.produit = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit:', error);
        this.error = 'Impossible de charger le produit';
        this.loading = false;
      }
    });
  }

  approuver(): void {
    if (!this.produit || this.actionEnCours) return;

    if (confirm(`Êtes-vous sûr de vouloir approuver le produit "${this.produit.nom}" ?`)) {
      this.actionEnCours = true;

      this.moderationService.approuverProduit(this.produit.id, {
        action: 'APPROUVER',
        commentaire: 'Produit conforme aux critères de validation'
      }).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Produit approuvé avec succès !');
            this.retour();
          }
          this.actionEnCours = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'approbation:', error);
          alert('Erreur lors de l\'approbation du produit');
          this.actionEnCours = false;
        }
      });
    }
  }

  ouvrirDialogRejet(): void {
    if (!this.produit || this.actionEnCours) return;

    const dialogRef = this.dialog.open(DialogRejetComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((motif: string) => {
      if (motif) {
        this.rejeter(motif);
      }
    });
  }

  rejeter(motif: string): void {
    if (!this.produit || this.actionEnCours) return;

    this.actionEnCours = true;

    this.moderationService.rejeterProduit(this.produit.id, {
      action: 'REJETER',
      commentaire: motif
    }).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Produit rejeté avec succès !');
          this.retour();
        }
        this.actionEnCours = false;
      },
      error: (error) => {
        console.error('Erreur lors du rejet:', error);
        alert('Erreur lors du rejet du produit');
        this.actionEnCours = false;
      }
    });
  }

  suspendre(): void {
    if (!this.produit || this.actionEnCours) return;

    const motif = prompt('Motif de la suspension :');
    if (motif && motif.trim()) {
      this.actionEnCours = true;

      this.moderationService.suspendreProduit(this.produit.id, {
        action: 'SUSPENDRE',
        commentaire: motif
      }).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Produit suspendu avec succès !');
            this.retour();
          }
          this.actionEnCours = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suspension:', error);
          alert('Erreur lors de la suspension du produit');
          this.actionEnCours = false;
        }
      });
    }
  }

  retour(): void {
    this.router.navigate(['/moderation']);
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