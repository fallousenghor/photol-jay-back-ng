import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../../../core/services/categorie.service';
import { Categorie } from '../../../core/models/categorie.model';

@Component({
  selector: 'app-dialog-categorie',
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
    <h2 mat-dialog-title>{{ data.categorie ? 'Modifier' : 'Créer' }} une catégorie</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" required>
          <mat-error *ngIf="form.get('nom')?.hasError('required')">
            Le nom est obligatoire
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea 
            matInput 
            formControlName="description"
            rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Icône (Material Icon)</mat-label>
          <input matInput formControlName="icone" placeholder="ex: smartphone, home, shopping_cart">
          <mat-hint>Nom d'une icône Material Design</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="form.invalid"
        (click)="onSubmit()">
        {{ data.categorie ? 'Modifier' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }
  `]
})
export class DialogCategorieComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nom: [data.categorie?.nom || '', Validators.required],
      description: [data.categorie?.description || ''],
      icone: [data.categorie?.icone || '']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

@Component({
  selector: 'app-liste-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './liste-categories.component.html',
  styleUrl: './liste-categories.component.scss'
})
export class ListeCategoriesComponent implements OnInit {
  categories: Categorie[] = [];
  loading = false;

  constructor(
    private categorieService: CategorieService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categorieService.getToutesCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loading = false;
      }
    });
  }

  ouvrirDialogCreation(): void {
    const dialogRef = this.dialog.open(DialogCategorieComponent, {
      width: '500px',
      data: { categorie: null }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.creerCategorie(result);
      }
    });
  }

  creerCategorie(data: any): void {
    this.categorieService.creerCategorie(data).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Catégorie créée avec succès');
          this.loadCategories();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        alert('Erreur lors de la création de la catégorie');
      }
    });
  }

  modifier(categorie: Categorie): void {
    const dialogRef = this.dialog.open(DialogCategorieComponent, {
      width: '500px',
      data: { categorie }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.categorieService.updateCategorie(categorie.id, result).subscribe({
          next: (response) => {
            if (response.success) {
              alert('Catégorie modifiée avec succès');
              this.loadCategories();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification de la catégorie');
          }
        });
      }
    });
  }

  activer(categorie: Categorie): void {
    this.categorieService.activerCategorie(categorie.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Catégorie activée');
          this.loadCategories();
        }
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'activation');
      }
    });
  }

  desactiver(categorie: Categorie): void {
    if (confirm(`Désactiver la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.desactiverCategorie(categorie.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Catégorie désactivée');
            this.loadCategories();
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          alert('Erreur lors de la désactivation');
        }
      });
    }
  }
}