import api from './config';
import type { Type } from '../types';

export const typesApi = {
  getAll: async (): Promise<Type[]> => {
    const response = await api.get<Type[]>('/types');
    return response.data;
  },

  create: async (type: Omit<Type, 'id'>): Promise<Type> => {
    const response = await api.post<Type>('/types', type);
    return response.data;
  },

  update: async (id: number, type: Partial<Type>): Promise<Type> => {
    const response = await api.put<Type>(`/types/${id}`, type);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/types/${id}`);
  },
};