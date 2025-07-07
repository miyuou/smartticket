import api from './config';
import type { Categorie } from '../types';

export const categoriesApi = {
  getAll: async (): Promise<Categorie[]> => {
    const response = await api.get<Categorie[]>('/categories');
    return response.data;
  },

  create: async (categorie: Omit<Categorie, 'id'>): Promise<Categorie> => {
    const response = await api.post<Categorie>('/categories', categorie);
    return response.data;
  },

  update: async (id: number, categorie: Partial<Categorie>): Promise<Categorie> => {
    const response = await api.put<Categorie>(`/categories/${id}`, categorie);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};