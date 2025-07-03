import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Ticket } from '@/types/ticket';

interface StatsDashboardProps {
  tickets: Ticket[];
}

export function StatsDashboard({ tickets }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const total = tickets.length;
    const resolus = tickets.filter(t => t.statut === 'Résolu').length;
    const pourcentageResolus = total > 0 ? Math.round((resolus / total) * 100) : 0;

    // Calcul du temps moyen de résolution
    const ticketsResolus = tickets.filter(t => t.date_resolution);
    const tempsMoyenResolution = ticketsResolus.length > 0 
      ? ticketsResolus.reduce((acc, ticket) => {
          const ouverture = new Date(ticket.date_ouverture);
          const resolution = new Date(ticket.date_resolution!);
          const duree = (resolution.getTime() - ouverture.getTime()) / (1000 * 60 * 60); // en heures
          return acc + duree;
        }, 0) / ticketsResolus.length
      : 0;

    // Statistiques par statut
    const statutStats = tickets.reduce((acc, ticket) => {
      acc[ticket.statut] = (acc[ticket.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statutData = Object.entries(statutStats).map(([statut, count]) => ({
      name: statut,
      value: count,
      percentage: Math.round((count / total) * 100)
    }));

    // Statistiques par technicien
    const technicienStats = tickets.reduce((acc, ticket) => {
      acc[ticket.technicien] = (acc[ticket.technicien] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const technicienData = Object.entries(technicienStats).map(([technicien, count]) => ({
      name: technicien.split(' ')[0], // Prénom seulement pour l'affichage
      tickets: count
    }));

    // Statistiques par catégorie
    const categorieStats = tickets.reduce((acc, ticket) => {
      acc[ticket.categorie] = (acc[ticket.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categorieData = Object.entries(categorieStats).map(([categorie, count]) => ({
      name: categorie,
      tickets: count
    }));

    return {
      total,
      resolus,
      pourcentageResolus,
      tempsMoyenResolution: Math.round(tempsMoyenResolution * 10) / 10,
      statutData,
      technicienData,
      categorieData
    };
  }, [tickets]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Résolus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolus}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pourcentageResolus}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen Résolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tempsMoyenResolution}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Résolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pourcentageResolus}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique camembert - Tickets par statut */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.statutData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.statutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique en barres - Tickets par technicien */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets par Technicien</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.technicienData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique en barres - Tickets par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categorieData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="tickets" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}