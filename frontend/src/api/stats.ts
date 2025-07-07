import api from './config';
import type { Stats } from '../types';

export const statsApi = {
  getAll: async (): Promise<Stats> => {
    const response = await api.get<Stats>('/stats');
    return response.data;
  },
};