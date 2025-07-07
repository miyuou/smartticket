import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets';
import { usersApi } from '../api/users';
import type { Ticket, CreateTicketRequest, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TicketForm from '../components/TicketForm';

const STATUS_COLORS: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-red-100 text-red-800',
};

const STATUS_NAMES: Record<number, string> = {
  1: 'Nouveau',
  2: 'En cours',
  3: 'Résolu',
  4: 'Fermé',
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTechnician, setFilterTechnician] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();

  // Form state for creating/editing tickets
  const [formData, setFormData] = useState<CreateTicketRequest>({
    titre: '',
    description: '',
    demandeur: '',
    categorie_id: 1,
    statut_id: 1,
    type_id: 1,
    departement_demandeur: '',
    technicien_ids: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsData, usersData] = await Promise.all([
        ticketsApi.getAll(),
        usersApi.getAll()
      ]);
      setTickets(ticketsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (formData: CreateTicketRequest) => {
    try {
      await ticketsApi.create(formData);
      toast({
        title: "Succès",
        description: "Ticket créé avec succès",
      });
      setIsCreateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTicket = async (formData: CreateTicketRequest) => {
    if (!editingTicket) return;

    try {
      await ticketsApi.update(editingTicket.id, formData);
      toast({
        title: "Succès",
        description: "Ticket modifié avec succès",
      });
      setIsEditDialogOpen(false);
      setEditingTicket(null);
      fetchData();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  const editTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTicket = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;
    
    try {
      await ticketsApi.delete(id);
      toast({
        title: "Succès",
        description: "Ticket supprimé avec succès",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le ticket",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await ticketsApi.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'tickets.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Succès",
        description: "Export CSV téléchargé",
      });
    } catch (error) {
      console.error('Error exporting tickets:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les tickets",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await ticketsApi.importCsv(file);
      toast({
        title: "Succès",
        description: "Import CSV réussi",
      });
      fetchData();
    } catch (error) {
      console.error('Error importing tickets:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'importer le fichier",
        variant: "destructive",
      });
    }
  };

  const viewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const getTechnicianNames = (technicianIds: number[]) => {
    return users
      .filter(user => technicianIds.includes(user.id))
      .map(user => user.nom)
      .join(', ') || 'Non assigné';
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.demandeur.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.statut_id.toString() === filterStatus;
    const matchesCategory = filterCategory === 'all' || ticket.categorie_id.toString() === filterCategory;
    const matchesTechnician = filterTechnician === 'all' || 
                             ticket.technicien_ids.some(id => id.toString() === filterTechnician);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesTechnician;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const canCreateTickets = user?.role === 'admin';
  const canDeleteTickets = user?.role === 'admin';
  const canEditTickets = user?.role === 'admin' || user?.role === 'technicien';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Tickets</h1>
          <p className="text-muted-foreground">
            Gérez et suivez l'ensemble des tickets de support
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            id="import-csv"
          />
          <label htmlFor="import-csv">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Importer CSV
            </Button>
          </label>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>

          {canCreateTickets && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau ticket</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du ticket à créer
                  </DialogDescription>
                </DialogHeader>
                <TicketForm
                  onSubmit={handleCreateTicket}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  submitLabel="Créer le ticket"
                  title=""
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher dans les tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="1">Nouveau</SelectItem>
                  <SelectItem value="2">En cours</SelectItem>
                  <SelectItem value="3">Résolu</SelectItem>
                  <SelectItem value="4">Fermé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="1">Technique</SelectItem>
                  <SelectItem value="2">Fonctionnel</SelectItem>
                  <SelectItem value="3">Réseau</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {users.filter(u => u.role === 'technicien' || u.role === 'admin').map(tech => (
                    <SelectItem key={tech.id} value={tech.id.toString()}>
                      {tech.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchData}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        #{ticket.id} - {ticket.titre}
                      </h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Par <strong>{ticket.demandeur}</strong></span>
                        <span>{ticket.departement_demandeur}</span>
                        <span>Catégorie: {ticket.categorie_id}</span>
                        <span>Type: {ticket.type_id}</span>
                        {ticket.technicien_ids.length > 0 && (
                          <span>Techniciens: {getTechnicianNames(ticket.technicien_ids)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={STATUS_COLORS[ticket.statut_id] || 'bg-gray-100 text-gray-800'}>
                        {STATUS_NAMES[ticket.statut_id] || `Statut ${ticket.statut_id}`}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewTicket(ticket)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {canEditTickets && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editTicket(ticket)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDeleteTickets && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">Aucun ticket trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Ticket #{selectedTicket?.id} - {selectedTicket?.titre}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-foreground bg-muted p-3 rounded border">
                  {selectedTicket.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Demandeur</Label>
                  <p className="mt-1 font-medium">{selectedTicket.demandeur}</p>
                </div>
                <div>
                  <Label>Département</Label>
                  <p className="mt-1 font-medium">{selectedTicket.departement_demandeur}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Catégorie</Label>
                  <p className="mt-1 font-medium">Catégorie {selectedTicket.categorie_id}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="mt-1 font-medium">Type {selectedTicket.type_id}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Badge className={STATUS_COLORS[selectedTicket.statut_id]}>
                    {STATUS_NAMES[selectedTicket.statut_id]}
                  </Badge>
                </div>
              </div>
              
              {selectedTicket.technicien_ids.length > 0 && (
                <div>
                  <Label>Techniciens assignés</Label>
                  <p className="mt-1 font-medium">
                    {getTechnicianNames(selectedTicket.technicien_ids)}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier le ticket #{editingTicket?.id}
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du ticket
            </DialogDescription>
          </DialogHeader>
          {editingTicket && (
            <TicketForm
              initialData={{
                titre: editingTicket.titre,
                description: editingTicket.description,
                demandeur: editingTicket.demandeur,
                categorie_id: editingTicket.categorie_id,
                statut_id: editingTicket.statut_id,
                type_id: editingTicket.type_id,
                departement_demandeur: editingTicket.departement_demandeur,
                technicien_ids: editingTicket.technicien_ids,
              }}
              onSubmit={handleUpdateTicket}
              onCancel={() => setIsEditDialogOpen(false)}
              submitLabel="Sauvegarder les modifications"
              title=""
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}