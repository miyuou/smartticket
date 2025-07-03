import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TicketForm } from '@/components/TicketForm';
import { TicketTable } from '@/components/TicketTable';
import { StatsDashboard } from '@/components/StatsDashboard';
import { Ticket } from '@/types/ticket';
import { mockTickets } from '@/data/mockData';
import { ticketAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [loading, setLoading] = useState(false);

  // Simuler le chargement des tickets depuis l'API
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        // Quand l'API sera prête, décommenter cette ligne et supprimer mockTickets
        // const apiTickets = await ticketAPI.getTickets();
        // setTickets(apiTickets);
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tickets.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleCreateTicket = async (ticketData: Omit<Ticket, 'id'>) => {
    try {
      setLoading(true);
      
      // Simulation de l'appel API
      const newTicket = await ticketAPI.createTicket(ticketData);
      
      // Ajouter le nouveau ticket à la liste locale (en attendant l'API)
      const localTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
      };
      
      setTickets(prev => [localTicket, ...prev]);
      
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le ticket.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      // Simulation de l'export
      const blob = await ticketAPI.exportTickets('excel');
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tickets-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Succès",
        description: "Export terminé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion des Tickets IT</h1>
            <p className="text-xl text-muted-foreground">
              Système de gestion et analyse intelligente des tickets
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              onClick={handleExport} 
              disabled={loading || tickets.length === 0}
              variant="outline"
            >
              {loading ? "Export en cours..." : "Exporter Excel"}
            </Button>
          </div>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="tickets">Liste des tickets</TabsTrigger>
            <TabsTrigger value="create">Nouveau ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsDashboard tickets={tickets} />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <TicketTable tickets={tickets} />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <TicketForm onSubmit={handleCreateTicket} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
