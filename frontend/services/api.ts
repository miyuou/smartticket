import { Ticket } from '@/types/ticket';

// Simulation d'appels API pour être prêt à brancher sur Flask

export const ticketAPI = {
  // GET /api/tickets
  getTickets: async (): Promise<Ticket[]> => {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ici, on retournerait fetch('/api/tickets')
        console.log('API Call: GET /api/tickets');
        resolve([]);
      }, 500);
    });
  },

  // POST /api/tickets
  createTicket: async (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ici, on ferait fetch('/api/tickets', { method: 'POST', body: JSON.stringify(ticket) })
        console.log('API Call: POST /api/tickets', ticket);
        const newTicket: Ticket = {
          ...ticket,
          id: Date.now().toString(),
        };
        resolve(newTicket);
      }, 500);
    });
  },

  // PUT /api/tickets/:id
  updateTicket: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ici, on ferait fetch(`/api/tickets/${id}`, { method: 'PUT', body: JSON.stringify(ticket) })
        console.log(`API Call: PUT /api/tickets/${id}`, ticket);
        resolve({ ...ticket, id } as Ticket);
      }, 500);
    });
  },

  // DELETE /api/tickets/:id
  deleteTicket: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ici, on ferait fetch(`/api/tickets/${id}`, { method: 'DELETE' })
        console.log(`API Call: DELETE /api/tickets/${id}`);
        resolve();
      }, 500);
    });
  },

  // GET /api/export
  exportTickets: async (format: 'excel' | 'csv' = 'excel'): Promise<Blob> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ici, on ferait fetch(`/api/export?format=${format}`)
        console.log(`API Call: GET /api/export?format=${format}`);
        
        // Simulation d'un fichier Excel/CSV
        const data = 'Simulation de données exportées';
        const blob = new Blob([data], { 
          type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv'
        });
        resolve(blob);
      }, 1000);
    });
  },
};

// Fonction utilitaire pour les vrais appels API quand le backend sera prêt
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com' 
    : 'http://localhost:5000';
  
  const response = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};