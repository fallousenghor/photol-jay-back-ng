export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  icone?: string;
  active: boolean;
  nombreProduits: number;
  dateCreation: string;
}

export interface CategorieRequest {
  nom: string;
  description?: string;
  icone?: string;
}