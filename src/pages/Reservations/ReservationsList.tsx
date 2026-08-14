import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../../types';
import { reservationService } from '../../services/reservationService';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/data/LoadingState';
import { PageContainer } from '../../components/ui/PageContainer';
import { Card, CardContent } from '../../components/ui/Card';
import { parseISO, format } from 'date-fns';
import { Plus } from 'lucide-react';

const TABS = ['All', 'Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];

export default function ReservationsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await reservationService.getBookings();
        setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;
    return bookings.filter(b => b.status === activeTab);
  }, [bookings, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Checked In': return 'success';
      case 'Checked Out': return 'default';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (isLoading) return <LoadingState />;

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
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[14px] font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 outline-none ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-secondary hover:text-primary hover:border-theme'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            data={filteredBookings}
            keyExtractor={(b) => b.id}
            columns={[
              {
                header: 'Booking ID',
                cell: (b) => <span className="font-bold text-primary">{b.id}</span>
              },
              {
                header: 'Guest',
                cell: (b) => (
                  <div>
                    <p className="font-bold text-primary">{b.guest.fullName}</p>
                    <p className="text-[12px] text-secondary">{b.guest.phone}</p>
                  </div>
                )
              },
              {
                header: 'Dates',
                cell: (b) => (
                  <div className="text-[13px] text-secondary">
                    <p className="font-medium text-primary">
                      {format(parseISO(b.stay.checkIn), 'dd MMM')} - {format(parseISO(b.stay.checkOut), 'dd MMM')}
                    </p>
                    <p className="text-[12px]">({b.stay.nights} nights)</p>
                  </div>
                )
              },
              {
                header: 'Room',
                cell: (b) => <span className="text-[14px] font-medium">{b.stay.roomId}</span>
              },
              {
                header: 'Amount',
                cell: (b) => <span className="font-bold">₹{b.totalAmount.toLocaleString('en-IN')}</span>
              },
              {
                header: 'Status',
                cell: (b) => <Badge variant={getStatusColor(b.status) as any}>{b.status}</Badge>
              },
              {
                header: '',
                cell: (b) => (
                  <Button variant="outline" size="sm" onClick={() => navigate(`/reservations/${b.id}`)}>
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
          {filteredBookings.length === 0 ? (
            <div className="text-center text-secondary py-8 flex flex-col items-center">
              <p className="font-medium">No reservations found.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => navigate(`/reservations/${booking.id}`)}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-brand-500">{booking.id}</span>
                      <h3 className="font-bold text-primary text-[15px] mt-0.5">{booking.guest.fullName}</h3>
                    </div>
                    <Badge variant={getStatusColor(booking.status) as any}>{booking.status}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-end text-[13px] mt-2">
                    <div className="text-secondary font-medium">
                      <p>{format(parseISO(booking.stay.checkIn), 'dd MMM')} - {format(parseISO(booking.stay.checkOut), 'dd MMM')}</p>
                      <p>Room: {booking.stay.roomId}</p>
                    </div>
                    <div className="font-bold text-[15px] text-primary">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}
