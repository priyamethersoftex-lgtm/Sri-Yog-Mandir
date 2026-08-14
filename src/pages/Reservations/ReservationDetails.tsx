import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Booking, Room } from '../../types';
import { reservationService } from '../../services/reservationService';
import { roomService } from '../../services/roomService';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/data/LoadingState';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { ArrowLeft, User, Calendar, Bed, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'confirm' | 'checkIn' | 'checkOut';
  }>({ isOpen: false, type: 'confirm' });
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const b = await reservationService.getBooking(id);
      setBooking(b);
      const r = await roomService.getRoom(b.stay.roomId);
      setRoom(r);
    } catch (error) {
      toast.error('Failed to load booking');
      navigate('/reservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleAction = async () => {
    if (!booking) return;
    setIsProcessing(true);
    try {
      let newStatus: any = booking.status;
      if (actionModal.type === 'cancel') newStatus = 'Cancelled';
      if (actionModal.type === 'confirm') newStatus = 'Confirmed';
      if (actionModal.type === 'checkIn') newStatus = 'Checked In';
      if (actionModal.type === 'checkOut') newStatus = 'Checked Out';

      await reservationService.transitionStatus(booking.id, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
      setActionModal({ ...actionModal, isOpen: false });
    }
  };

  if (isLoading || !booking || !room) return <LoadingState />;

  const modalConfig = {
    cancel: { title: 'Cancel Reservation', message: 'Are you sure you want to cancel this reservation? This cannot be undone.', confirmText: 'Yes, Cancel', isDestructive: true },
    confirm: { title: 'Confirm Reservation', message: 'Are you sure you want to confirm this pending reservation?', confirmText: 'Confirm', isDestructive: false },
    checkIn: { title: 'Check In Guest', message: `Proceed with check-in for ${booking.guest.fullName}? Room ${room.name} will be marked as Occupied.`, confirmText: 'Check In', isDestructive: false },
    checkOut: { title: 'Check Out Guest', message: `Proceed with check-out for ${booking.guest.fullName}? Room ${room.name} will be marked as Available.`, confirmText: 'Check Out', isDestructive: false },
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
            <h1 className="text-3xl font-heading font-semibold text-text flex items-center gap-3">
              Booking {booking.id}
              <StatusBadge status={booking.status} className="text-sm px-3 py-1" />
            </h1>
          </div>
        </div>
        
        <div className="flex gap-2">
          {booking.status === 'Pending' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'confirm' })}>Confirm</Button>
            </>
          )}
          {booking.status === 'Confirmed' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'checkIn' })}>Check In</Button>
            </>
          )}
          {booking.status === 'Checked In' && (
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
              <p className="font-medium text-text">{booking.guest.fullName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Phone</p>
                <p className="font-medium text-text">{booking.guest.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="font-medium text-text">{booking.guest.email || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Adults</p>
                <p className="font-medium text-text">{booking.guest.adults}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Children</p>
                <p className="font-medium text-text">{booking.guest.children}</p>
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
                <p className="font-medium text-text">{format(parseISO(booking.stay.checkIn), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Check-out</p>
                <p className="font-medium text-text">{format(parseISO(booking.stay.checkOut), 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Duration</p>
              <p className="font-medium text-text">{booking.stay.nights} Nights</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed size={18} className="text-primary" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary">Room Name</p>
              <p className="font-medium text-text">{room.name} ({room.nameHi})</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Category</p>
              <p className="font-medium text-text">{room.category}</p>
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
              <p className="text-sm text-text-secondary">Rate (Snapshot)</p>
              <p className="font-medium text-text">₹{booking.roomPriceAtBooking.toLocaleString('en-IN')} / night</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium text-text">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Booking Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Created At</p>
              <p className="font-medium text-text">{format(parseISO(booking.createdAt), 'dd MMM yyyy, HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Source</p>
              <p className="font-medium text-text">{booking.source}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-text-secondary">Notes</p>
              <p className="font-medium text-text">{booking.notes || 'None'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
