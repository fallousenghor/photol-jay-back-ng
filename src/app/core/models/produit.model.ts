export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  photoUrl: string;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'SUSPENDU' | 'ARCHIVE';
  disponible: boolean;
  nombreVues: number;
  
  // Catégorie
  categorieId: number;
  categorieNom: string;
  
  // Vendeur
  vendeurId: number;
  vendeurNom: string;
  vendeurTelephone: string;
  vendeurVille?: string;
  
  // Métadonnées photo
  metadataPhoto?: MetadataPhoto;
  
  // Modération
  motifRejet?: string;
  dateModerationDecision?: string;
  
  // Dates
  dateCreation: string;
  dateModification?: string;
}

export interface MetadataPhoto {
  modeleAppareil?: string;
  fabricantAppareil?: string;
  datePrisePhoto?: string;
  latitude?: number;
  longitude?: number;
  largeur?: number;
  hauteur?: number;
  formatImage?: string;
  tailleOctets?: number;
  metadataValides: boolean;
  priseParAppareil: boolean;
  logicielUtilise?: string;
}

export interface ModerationRequest {
  action: 'APPROUVER' | 'REJETER' | 'SUSPENDRE';
  commentaire?: string;
}

export interface StatistiquesModeration {
  en_attente: number;
  approuves: number;
  rejetes: number;
  suspendus: number;
}