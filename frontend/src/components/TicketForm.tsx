import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateTicketRequest, User } from '../types';
import { usersApi } from '../api/users';
import { toast } from '@/hooks/use-toast';

interface TicketFormProps {
  initialData?: Partial<CreateTicketRequest>;
  onSubmit: (data: CreateTicketRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  title: string;
}

export default function TicketForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel, 
  title 
}: TicketFormProps) {
  const [formData, setFormData] = useState<CreateTicketRequest>({
    titre: initialData?.titre || '',
    description: initialData?.description || '',
    demandeur: initialData?.demandeur || '',
    categorie_id: initialData?.categorie_id || 1,
    statut_id: initialData?.statut_id || 1,
    type_id: initialData?.type_id || 1,
    departement_demandeur: initialData?.departement_demandeur || '',
    technicien_ids: Array.isArray(initialData?.technicien_ids) ? initialData.technicien_ids : [],
  });

  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const users = await usersApi.getAll();
        setTechnicians(users.filter(user => user.role === 'technicien' || user.role === 'admin'));
      } catch (error) {
        console.error('Error fetching technicians:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des techniciens",
          variant: "destructive",
        });
      }
    };

    fetchTechnicians();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTechnicianChange = (technicianId: number, checked: boolean) => {
    const currentIds = Array.isArray(formData.technicien_ids) ? formData.technicien_ids : [];
    
    if (checked) {
      setFormData({
        ...formData,
        technicien_ids: [...currentIds, technicianId]
      });
    } else {
      setFormData({
        ...formData,
        technicien_ids: currentIds.filter(id => id !== technicianId)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                placeholder="Résumé du problème"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="demandeur">Demandeur *</Label>
              <Input
                id="demandeur"
                value={formData.demandeur}
                onChange={(e) => setFormData({...formData, demandeur: e.target.value})}
                placeholder="Nom du demandeur"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description détaillée du problème"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="departement">Département *</Label>
            <Input
              id="departement"
              value={formData.departement_demandeur}
              onChange={(e) => setFormData({...formData, departement_demandeur: e.target.value})}
              placeholder="Département du demandeur"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Catégorie</Label>
              <Select 
                value={formData.categorie_id.toString()} 
                onValueChange={(value) => setFormData({...formData, categorie_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Technique</SelectItem>
                  <SelectItem value="2">Fonctionnel</SelectItem>
                  <SelectItem value="3">Réseau</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Statut</Label>
              <Select 
                value={formData.statut_id.toString()} 
                onValueChange={(value) => setFormData({...formData, statut_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nouveau</SelectItem>
                  <SelectItem value="2">En cours</SelectItem>
                  <SelectItem value="3">Résolu</SelectItem>
                  <SelectItem value="4">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Type</Label>
              <Select 
                value={formData.type_id.toString()} 
                onValueChange={(value) => setFormData({...formData, type_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Incident</SelectItem>
                  <SelectItem value="2">Demande</SelectItem>
                  <SelectItem value="3">Problème</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {technicians.length > 0 && (
            <div>
              <Label>Techniciens assignés</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-3">
                {technicians.map(tech => (
                  <div key={tech.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech.id}`}
                      checked={Array.isArray(formData.technicien_ids) && formData.technicien_ids.includes(tech.id)}
                      onCheckedChange={(checked) => handleTechnicianChange(tech.id, !!checked)}
                    />
                    <Label 
                      htmlFor={`tech-${tech.id}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tech.nom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}