export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'admin' | 'technicien' | 'user';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Ticket {
  id: number;
  titre: string;
  description: string;
  demandeur: string;
  categorie_id: number;
  statut_id: number;
  type_id: number;
  departement_demandeur: string;
  technicien_ids: number[];
  date_creation?: string;
  date_resolution?: string;
  date_modification?: string;
}

export interface CreateTicketRequest {
  titre: string;
  description: string;
  demandeur: string;
  categorie_id: number;
  statut_id: number;
  type_id: number;
  departement_demandeur: string;
  technicien_ids: number[];
}

export interface Stats {
  total_tickets: number;
  tickets_resolus: number;
  temps_moyen_resolution_h: number;
  taux_resolution: number;
  repartition_statut: Array<{
    statut_id: number;
    count: number;
  }>;
  repartition_categorie: Array<{
    categorie_id: number;
    count: number;
  }>;
  repartition_technicien: Array<{
    technicien: string;
    count: number;
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Categorie {
  id: number;
  nom: string;
}

export interface Statut {
  id: number;
  nom: string;
  couleur?: string;
}

export interface Type {
  id: number;
  nom: string;
}