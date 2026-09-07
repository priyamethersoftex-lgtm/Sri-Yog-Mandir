import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../../types';
import { reservationService } from '../../services/reservationService';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/data/LoadingState';
import { PageContainer } from '../../components/ui/PageContainer';
import { Card, CardContent } from '../../components/ui/Card';
import { parseISO, format } from 'date-fns';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const TABS = ['All', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];
const TAB_LABELS: Record<string, string> = {
  'All': 'All',
  'PENDING': 'Pending',
  'CONFIRMED': 'Confirmed',
  'CHECKED_IN': 'Checked In',
  'CHECKED_OUT': 'Checked Out',
  'CANCELLED': 'Cancelled'
};

export default function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [page, activeTab]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const statusParam = activeTab === 'All' ? null : activeTab;
      const data = await reservationService.getReservations({
        page,
        limit: pageSize,
        reservation_status: statusParam
      });
      setReservations(data.list);
      setTotalRecords(data.pagination.total);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'CHECKED_IN': return 'success';
      case 'CHECKED_OUT': return 'default';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  if (isLoading && reservations.length === 0) return <LoadingState />;

  return (
    <PageContainer
      title="Reservations"
      description="Manage all guest bookings and arrivals."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Reservations' }
      ]}
      action={
        <Button onClick={() => navigate('/reservations/new')} className="gap-2">
          <Plus size={18} /> New Booking
        </Button>
      }
    >
      <div className="bg-surface border border-theme rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Custom Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar border-b border-theme bg-muted/20 px-4 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-4 py-3 text-[14px] font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 outline-none ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-secondary hover:text-primary hover:border-theme'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            data={reservations}
            keyExtractor={(r) => r.id.toString()}
            loading={isLoading}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={setPage}
            columns={[
              {
                header: 'GUEST INFO',
                cell: (r) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[15px] flex-shrink-0">
                      {r.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-extrabold text-brand-dark text-[13px] uppercase tracking-wide">{r.customer_name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5 tracking-wider font-medium">
                        {r.reservation_number} <span className="mx-1">•</span> {r.customer_phone || 'No Phone'}
                      </p>
                    </div>
                  </div>
                )
              },
              {
                header: 'ROOM',
                cell: (r) => (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-text">{r.room_name || 'N/A'}</span>
                    <span className="text-[11px] text-text-muted font-medium">{r.total_guests} Guests</span>
                  </div>
                )
              },
              {
                header: 'DATES',
                cell: (r) => (
                  <div className="text-[13px] font-bold text-text flex flex-col gap-1">
                    <span className="flex items-center gap-1.5"><span className="text-[11px] opacity-70">In:</span> {format(parseISO(r.check_in), 'dd MMM yyyy')}</span>
                    <span className="flex items-center gap-1.5"><span className="text-[11px] opacity-70">Out:</span> {format(parseISO(r.check_out), 'dd MMM yyyy')}</span>
                  </div>
                )
              },
              {
                header: 'AMOUNT',
                cell: (r) => <span className="font-bold text-text">₹{r.total_amount.toLocaleString('en-IN')}</span>
              },
              {
                header: 'PAYMENT',
                cell: (r) => <Badge variant={getStatusColor(r.payment_status) as any}>{r.payment_status}</Badge>
              },
              {
                header: 'STATUS',
                cell: (r) => <Badge variant={getStatusColor(r.reservation_status) as any}>{r.reservation_status}</Badge>
              },
              {
                header: '',
                cell: (r) => (
                  <Button variant="outline" size="sm" onClick={() => navigate(`/reservations/${r.id}`)}>
                    View
                  </Button>
                ),
                className: 'text-right'
              }
            ]}
          />
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4 bg-[var(--bg-app)]">
          {reservations.length === 0 ? (
            <div className="text-center text-secondary py-8 flex flex-col items-center">
              <p className="font-medium">No reservations found.</p>
            </div>
          ) : (
            reservations.map((r) => (
              <Card key={r.id} className="cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => navigate(`/reservations/${r.id}`)}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-500 text-[13px]">{r.reservation_number}</span>
                      </div>
                      <h3 className="font-bold text-primary text-[15px] mt-0.5">{r.customer_name}</h3>
                      <p className="text-[12px] text-text-secondary mt-0.5">{r.customer_phone || 'No Phone'}</p>
                    </div>
                    <Badge variant={getStatusColor(r.reservation_status) as any}>{r.reservation_status}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-[12px] text-text-secondary bg-surface-muted p-2 rounded-lg mt-1">
                    <span className="font-semibold text-text">{r.room_name || 'N/A'}</span>
                    <span>{r.total_guests} Guests</span>
                  </div>
                  
                  <div className="flex justify-between items-end text-[13px] mt-2">
                    <div className="text-secondary font-medium">
                      <p>{format(parseISO(r.check_in), 'dd MMM')} - {format(parseISO(r.check_out), 'dd MMM')}</p>
                    </div>
                    <div className="font-bold text-[15px] text-primary">
                      ₹{r.total_amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {/* Mobile Pagination Controls if needed */}
          <div className="flex justify-between items-center mt-4">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <span className="text-sm font-medium text-text-muted">Page {page}</span>
            <Button size="sm" variant="outline" disabled={reservations.length < pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
