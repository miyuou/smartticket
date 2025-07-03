import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from '@/types/ticket';
import { STATUTS, TYPES, CATEGORIES, TECHNICIENS } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id'>) => void;
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [formData, setFormData] = useState<{
    titre: string;
    description: string;
    statut: string;
    type: 'Incident' | 'Demande';
    categorie: string;
    technicien: string;
    demandeur: string;
    groupe_demandeur: string;
  }>({
    titre: '',
    description: '',
    statut: 'Nouveau',
    type: 'Incident',
    categorie: '',
    technicien: '',
    demandeur: '',
    groupe_demandeur: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.description || !formData.categorie || !formData.technicien || !formData.demandeur) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const newTicket: Omit<Ticket, 'id'> = {
      ...formData,
      date_ouverture: new Date().toISOString(),
    };

    onSubmit(newTicket);
    
    // Réinitialiser le formulaire
    setFormData({
      titre: '',
      description: '',
      statut: 'Nouveau',
      type: 'Incident',
      categorie: '',
      technicien: '',
      demandeur: '',
      groupe_demandeur: '',
    });

    toast({
      title: "Succès",
      description: "Le ticket a été créé avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre du ticket"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => 
                  setFormData({ ...formData, type: value as 'Incident' | 'Demande' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((categorie) => (
                    <SelectItem key={categorie} value={categorie}>
                      {categorie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => setFormData({ ...formData, statut: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUTS.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicien">Technicien *</Label>
              <Select
                value={formData.technicien}
                onValueChange={(value) => setFormData({ ...formData, technicien: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNICIENS.map((technicien) => (
                    <SelectItem key={technicien} value={technicien}>
                      {technicien}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demandeur">Demandeur *</Label>
              <Input
                id="demandeur"
                value={formData.demandeur}
                onChange={(e) => setFormData({ ...formData, demandeur: e.target.value })}
                placeholder="Nom du demandeur"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="groupe_demandeur">Groupe demandeur</Label>
              <Input
                id="groupe_demandeur"
                value={formData.groupe_demandeur}
                onChange={(e) => setFormData({ ...formData, groupe_demandeur: e.target.value })}
                placeholder="Service ou département"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée du problème ou de la demande"
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Créer le ticket
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}