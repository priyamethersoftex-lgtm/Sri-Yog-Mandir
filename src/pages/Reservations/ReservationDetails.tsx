import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reservation } from '../../types';
import { reservationService } from '../../services/reservationService';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/data/LoadingState';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { ArrowLeft, User, Calendar, CreditCard, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'confirm' | 'checkIn' | 'checkOut';
  }>({ isOpen: false, type: 'confirm' });
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const res = await reservationService.getReservationById(Number(id));
      setReservation(res);
    } catch (error) {
      toast.error('Failed to load reservation');
      navigate('/reservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleAction = async () => {
    if (!reservation) return;
    setIsProcessing(true);
    try {
      // NOTE: Status update API is not yet available as per current endpoint list.
      // We will simulate success or show an error for now.
      toast.info('Update status API is not yet integrated. Action simulated.');
      setActionModal({ ...actionModal, isOpen: false });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !reservation) return <LoadingState />;

  const nights = differenceInDays(parseISO(reservation.check_out), parseISO(reservation.check_in));

  const modalConfig = {
    cancel: { title: 'Cancel Reservation', message: 'Are you sure you want to cancel this reservation? This cannot be undone.', confirmText: 'Yes, Cancel', isDestructive: true },
    confirm: { title: 'Confirm Reservation', message: 'Are you sure you want to confirm this pending reservation?', confirmText: 'Confirm', isDestructive: false },
    checkIn: { title: 'Check In Guest', message: `Proceed with check-in for ${reservation.customer_name}?`, confirmText: 'Check In', isDestructive: false },
    checkOut: { title: 'Check Out Guest', message: `Proceed with check-out for ${reservation.customer_name}?`, confirmText: 'Check Out', isDestructive: false },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/reservations')}
            className="p-2 hover:bg-surface rounded-full transition-colors text-text-secondary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight leading-tight text-text flex items-center gap-3">
              {reservation.reservation_number}
              <StatusBadge status={reservation.reservation_status} className="text-sm px-3 py-1" />
            </h1>
          </div>
        </div>
        
        <div className="flex gap-2">
          {reservation.reservation_status === 'PENDING' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'confirm' })}>Confirm</Button>
            </>
          )}
          {reservation.reservation_status === 'CONFIRMED' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'checkIn' })}>Check In</Button>
            </>
          )}
          {reservation.reservation_status === 'CHECKED_IN' && (
            <Button onClick={() => setActionModal({ isOpen: true, type: 'checkOut' })}>Check Out</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              Guest Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary">Full Name</p>
              <p className="font-medium text-text">{reservation.customer_name}</p>
            </div>
            {/* Extended fields if available from API */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">UUID</p>
                <p className="font-medium text-text text-[12px] truncate" title={reservation.uuid}>{reservation.uuid.split('-')[0]}...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Stay Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Check-in</p>
                <p className="font-medium text-text">{format(parseISO(reservation.check_in), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Check-out</p>
                <p className="font-medium text-text">{format(parseISO(reservation.check_out), 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Duration</p>
              <p className="font-medium text-text">{nights > 0 ? `${nights} Nights` : 'Same Day'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <p className="text-sm text-text-secondary">Payment Status</p>
              <p className="font-medium text-text">
                <StatusBadge status={reservation.payment_status} />
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium text-text">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹{reservation.total_amount.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Booking Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Created At</p>
                <p className="font-medium text-text">{format(parseISO(reservation.created_at.replace(' ', 'T')), 'dd MMM yyyy, HH:mm')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleAction}
        title={modalConfig[actionModal.type].title}
        message={modalConfig[actionModal.type].message}
        confirmText={modalConfig[actionModal.type].confirmText}
        isDestructive={modalConfig[actionModal.type].isDestructive}
        isLoading={isProcessing}
      />
    </div>
  );
}
