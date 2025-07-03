import { useState, useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ticket } from '@/types/ticket';
import { STATUTS, CATEGORIES, TECHNICIENS } from '@/data/mockData';

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [technicienFilter, setTechnicienFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Ticket>('date_ouverture');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter((ticket) => {
      const matchesSearch = ticket.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.demandeur.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatut = statutFilter === 'all' || ticket.statut === statutFilter;
      const matchesCategorie = categorieFilter === 'all' || ticket.categorie === categorieFilter;
      const matchesTechnicien = technicienFilter === 'all' || ticket.technicien === technicienFilter;

      return matchesSearch && matchesStatut && matchesCategorie && matchesTechnicien;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date_ouverture' || sortField === 'date_resolution') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tickets, searchTerm, statutFilter, categorieFilter, technicienFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Ticket) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'Résolu':
        return 'default';
      case 'En cours':
        return 'secondary';
      case 'Nouveau':
        return 'destructive';
      case 'En attente':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const calculateDuration = (dateOuverture: string, dateResolution?: string) => {
    const start = new Date(dateOuverture);
    const end = dateResolution ? new Date(dateResolution) : new Date();
    
    return formatDistanceToNow(start, { locale: fr, addSuffix: false });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des tickets</CardTitle>
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {statut}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categorieFilter} onValueChange={setCategorieFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map((categorie) => (
                <SelectItem key={categorie} value={categorie}>
                  {categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={technicienFilter} onValueChange={setTechnicienFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les techniciens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les techniciens</SelectItem>
              {TECHNICIENS.map((technicien) => (
                <SelectItem key={technicien} value={technicien}>
                  {technicien}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setStatutFilter('all');
              setCategorieFilter('all');
              setTechnicienFilter('all');
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('titre')}
                >
                  Titre {sortField === 'titre' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('statut')}
                >
                  Statut {sortField === 'statut' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('type')}
                >
                  Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('categorie')}
                >
                  Catégorie {sortField === 'categorie' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('technicien')}
                >
                  Technicien {sortField === 'technicien' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('demandeur')}
                >
                  Demandeur {sortField === 'demandeur' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('date_ouverture')}
                >
                  Date ouverture {sortField === 'date_ouverture' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{ticket.titre}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {ticket.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatutBadgeVariant(ticket.statut)}>
                      {ticket.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ticket.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.categorie}</TableCell>
                  <TableCell>{ticket.technicien}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.demandeur}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.groupe_demandeur}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(ticket.date_ouverture), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {calculateDuration(ticket.date_ouverture, ticket.date_resolution)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedTickets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun ticket trouvé avec ces critères de recherche.
          </div>
        )}
      </CardContent>
    </Card>
  );
}