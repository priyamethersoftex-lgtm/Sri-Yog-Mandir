import React, { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '../../services/dashboardService';
import { LoadingState } from '../../components/data/LoadingState';
import { PageContainer } from '../../components/ui/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BedDouble, ArrowDownToLine, CalendarDays, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !stats) return <LoadingState />;

  return (
    <PageContainer
      title="Daily Overview"
      description="Real-time operational status for Banaras Yog Mandir"
      action={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-semibold text-text-secondary">
            <Calendar size={16} />
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
          <Button variant="primary">Sync PMS</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Room Status */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BedDouble size={20} />
              </div>
              <CardTitle>Room Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-muted p-4 rounded-xl border border-border">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Available</p>
                <p className="text-3xl font-extrabold text-semantic-success">{stats.availableToday}</p>
              </div>
              <div className="bg-surface-muted p-4 rounded-xl border border-border">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Occupied</p>
                <p className="text-3xl font-extrabold text-primary">{stats.occupiedToday}</p>
              </div>
            </div>
            <div className="bg-surface-muted p-4 rounded-xl border border-border mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Maintenance</p>
                  <p className="text-xl font-bold text-semantic-danger">{stats.maintenanceToday}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Rooms</p>
                  <p className="text-xl font-bold text-text">{stats.totalRooms}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Movements */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-semantic-info/10 text-semantic-info">
                <ArrowDownToLine size={20} />
              </div>
              <CardTitle>Today's Movements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="bg-surface-muted p-5 rounded-xl border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Arrivals</p>
                <p className="text-sm text-text-muted">Expected to check-in</p>
              </div>
              <p className="text-3xl font-extrabold text-semantic-info">{stats.arrivalsToday}</p>
            </div>
            
            <div className="bg-surface-muted p-5 rounded-xl border border-border flex items-center justify-between mt-auto">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Departures</p>
                <p className="text-sm text-text-muted">Expected to check-out</p>
              </div>
              <p className="text-3xl font-extrabold text-semantic-warning">{stats.departuresToday}</p>
            </div>
          </CardContent>
        </Card>

        {/* Column 3: Reservations */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-semantic-warning/10 text-semantic-warning">
                <CalendarDays size={20} />
              </div>
              <CardTitle>Reservations Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-semantic-warning" />
                <span className="text-sm font-semibold text-text">Pending Approval</span>
              </div>
              <span className="font-bold text-semantic-warning">{stats.pendingReservations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-semantic-success" />
                <span className="text-sm font-semibold text-text">Confirmed</span>
              </div>
              <span className="font-bold text-text">{stats.confirmedReservations}</span>
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-semibold text-text">Checked In Guests</span>
              </div>
              <span className="font-bold text-text">{stats.checkedInGuests}</span>
            </div>
            
            <div className="mt-auto pt-4">
              <Button variant="outline" className="w-full">
                View All Reservations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
