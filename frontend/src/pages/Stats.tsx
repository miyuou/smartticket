import { useEffect, useState } from 'react';
import { statsApi } from '../api/stats';
import type { Stats } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const COLORS = [
  'hsl(var(--primary))', 
  'hsl(var(--success))', 
  'hsl(var(--warning))', 
  'hsl(var(--destructive))', 
  'hsl(var(--accent))',
  'hsl(var(--muted))'
];

export default function Stats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getAll();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const statusData = stats.repartition_statut.map((item, index) => ({
    name: `Statut ${item.statut_id}`,
    value: item.count,
    color: COLORS[index % COLORS.length],
    percentage: ((item.count / stats.total_tickets) * 100).toFixed(1)
  }));

  const categoryData = stats.repartition_categorie.map((item, index) => ({
    name: `Catégorie ${item.categorie_id}`,
    value: item.count,
    color: COLORS[index % COLORS.length],
    percentage: ((item.count / stats.total_tickets) * 100).toFixed(1)
  }));

  const technicianData = stats.repartition_technicien.map((item, index) => ({
    name: item.technicien,
    tickets: item.count,
    color: COLORS[index % COLORS.length],
    percentage: ((item.count / stats.total_tickets) * 100).toFixed(1)
  }));

  const performanceData = [
    {
      metric: "Taux de résolution",
      value: stats.taux_resolution,
      target: 85,
      icon: CheckCircle,
      color: stats.taux_resolution >= 85 ? "text-success" : "text-warning"
    },
    {
      metric: "Temps moyen de résolution",
      value: stats.temps_moyen_resolution_h,
      target: 4,
      icon: Clock,
      color: stats.temps_moyen_resolution_h <= 4 ? "text-success" : "text-warning",
      unit: "h"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques & Analytics</h1>
          <p className="text-muted-foreground">
            Analyse détaillée des performances de votre service IT
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_tickets}</div>
            <p className="text-xs text-muted-foreground">Tickets créés au total</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.tickets_resolus}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.tickets_resolus / stats.total_tickets) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.temps_moyen_resolution_h.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">Temps de résolution</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Résolution</CardTitle>
            {stats.taux_resolution >= 80 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-warning" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.taux_resolution >= 80 ? 'text-success' : 'text-warning'}`}>
              {stats.taux_resolution.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Performance globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2">
        {performanceData.map((perf, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <perf.icon className={`h-5 w-5 ${perf.color}`} />
                {perf.metric}
              </CardTitle>
              <CardDescription>Objectif vs Performance actuelle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Actuel</span>
                  <span className={`text-lg font-bold ${perf.color}`}>
                    {perf.value.toFixed(1)}{perf.unit || '%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Objectif</span>
                  <span className="text-lg font-bold text-muted-foreground">
                    {perf.target}{perf.unit || '%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      perf.value >= perf.target ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ 
                      width: `${Math.min((perf.value / perf.target) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Répartition par Statut
            </CardTitle>
            <CardDescription>Distribution des tickets selon leur statut actuel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tickets']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}</div>
                      <div className="text-muted-foreground text-xs">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Répartition par Catégorie
            </CardTitle>
            <CardDescription>Types de problèmes les plus fréquents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tickets']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}</div>
                      <div className="text-muted-foreground text-xs">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technician Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance des Techniciens
          </CardTitle>
          <CardDescription>Charge de travail et répartition des tickets par technicien</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technicianData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="tickets" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {technicianData.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{tech.name}</span>
                <div className="text-right">
                  <div className="font-bold text-primary">{tech.tickets}</div>
                  <div className="text-xs text-muted-foreground">{tech.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}