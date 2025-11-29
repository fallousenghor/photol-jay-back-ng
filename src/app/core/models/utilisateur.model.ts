export interface Utilisateur {
  id: number;
  email: string;
  telephone: string;
  nom: string;
  prenom?: string;
  role: 'ADMIN' | 'MODERATEUR' | 'VENDEUR' | 'ACHETEUR';
  adresse?: string;
  ville?: string;
  pays?: string;
  actif: boolean;
  emailVerifie: boolean;
  telephoneVerifie: boolean;
  dateInscription: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nom: string;
  prenom?: string;
  telephone: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}