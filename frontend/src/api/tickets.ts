import api from './config';
import type { Ticket, CreateTicketRequest } from '../types';

export const ticketsApi = {
  getAll: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },

  getById: async (id: number): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticket: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets', ticket);
    return response.data;
  },

  update: async (id: number, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.put<Ticket>(`/tickets/${id}`, ticket);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  exportCsv: async (): Promise<Blob> => {
    const response = await api.get('/import_export/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importCsv: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/import_export/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};