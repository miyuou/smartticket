export interface Ticket {
  id: string;
  titre: string;
  description: string;
  date_ouverture: string;
  date_resolution?: string;
  statut: string;
  type: 'Incident' | 'Demande';
  categorie: string;
  technicien: string;
  demandeur: string;
  groupe_demandeur: string;
}

export interface TicketStats {
  total: number;
  resolus: number;
  temps_moyen_resolution: number; // en heures
}