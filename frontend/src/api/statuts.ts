import api from './config';
import type { Statut } from '../types';

export const statutsApi = {
  getAll: async (): Promise<Statut[]> => {
    const response = await api.get<Statut[]>('/statuts');
    return response.data;
  },

  create: async (statut: Omit<Statut, 'id'>): Promise<Statut> => {
    const response = await api.post<Statut>('/statuts', statut);
    return response.data;
  },

  update: async (id: number, statut: Partial<Statut>): Promise<Statut> => {
    const response = await api.put<Statut>(`/statuts/${id}`, statut);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/statuts/${id}`);
  },
};