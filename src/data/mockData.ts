import { Ticket } from '@/types/ticket';

export const STATUTS = ['Nouveau', 'En cours', 'Résolu', 'En attente'];
export const TYPES = ['Incident', 'Demande'] as const;
export const CATEGORIES = ['Réseau', 'Matériel', 'Logiciel', 'Sécurité', 'Infrastructure'];
export const TECHNICIENS = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lefevre', 'Thomas Bernard'];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    titre: 'Problème connexion réseau',
    description: 'Impossible de se connecter au réseau WiFi depuis ce matin',
    date_ouverture: '2024-01-15T08:00:00',
    date_resolution: '2024-01-15T14:30:00',
    statut: 'Résolu',
    type: 'Incident',
    categorie: 'Réseau',
    technicien: 'Jean Dupont',
    demandeur: 'Alice Johnson',
    groupe_demandeur: 'Comptabilité'
  },
  {
    id: '2',
    titre: 'Installation Office 365',
    description: 'Demande d\'installation d\'Office 365 sur nouveau poste',
    date_ouverture: '2024-01-16T09:15:00',
    statut: 'En cours',
    type: 'Demande',
    categorie: 'Logiciel',
    technicien: 'Marie Martin',
    demandeur: 'Bob Smith',
    groupe_demandeur: 'RH'
  },
  {
    id: '3',
    titre: 'Ordinateur ne démarre plus',
    description: 'L\'ordinateur reste bloqué sur l\'écran de démarrage',
    date_ouverture: '2024-01-17T10:30:00',
    statut: 'Nouveau',
    type: 'Incident',
    categorie: 'Matériel',
    technicien: 'Pierre Durand',
    demandeur: 'Carol Wilson',
    groupe_demandeur: 'Marketing'
  },
  {
    id: '4',
    titre: 'Mise à jour antivirus',
    description: 'Demande de mise à jour du logiciel antivirus',
    date_ouverture: '2024-01-18T11:45:00',
    date_resolution: '2024-01-18T16:20:00',
    statut: 'Résolu',
    type: 'Demande',
    categorie: 'Sécurité',
    technicien: 'Sophie Lefevre',
    demandeur: 'David Brown',
    groupe_demandeur: 'IT'
  },
  {
    id: '5',
    titre: 'Problème imprimante',
    description: 'L\'imprimante ne répond plus depuis hier',
    date_ouverture: '2024-01-19T13:20:00',
    statut: 'En attente',
    type: 'Incident',
    categorie: 'Matériel',
    technicien: 'Thomas Bernard',
    demandeur: 'Eva Davis',
    groupe_demandeur: 'Ventes'
  },
  {
    id: '6',
    titre: 'Accès base de données',
    description: 'Demande d\'accès à la base de données clients',
    date_ouverture: '2024-01-20T14:10:00',
    statut: 'En cours',
    type: 'Demande',
    categorie: 'Infrastructure',
    technicien: 'Jean Dupont',
    demandeur: 'Frank Miller',
    groupe_demandeur: 'Commercial'
  }
];