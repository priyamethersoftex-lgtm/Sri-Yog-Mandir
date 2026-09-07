import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reservation, ReservationGuest } from '../../types';
import { reservationService } from '../../services/reservationService';
import { guestService } from '../../services/guestService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/data/LoadingState';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ArrowLeft, CreditCard, Calendar, User, UserPlus, Info, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { GuestFormModal } from './GuestFormModal';

export default function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [guests, setGuests] = useState<ReservationGuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'confirm' | 'checkIn' | 'checkOut';
  }>({ isOpen: false, type: 'confirm' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Guest Modals
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<ReservationGuest | null>(null);
  const [deleteGuestId, setDeleteGuestId] = useState<number | null>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      const res = await reservationService.getReservationById(Number(id));
      setReservation(res);
      const guestsList = await guestService.getGuestsByReservationId(Number(id));
      setGuests(guestsList);
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
      let targetStatus = '';
      switch (actionModal.type) {
        case 'cancel': targetStatus = 'CANCELLED'; break;
        case 'confirm': targetStatus = 'CONFIRMED'; break;
        case 'checkIn': targetStatus = 'CHECKED_IN'; break;
        case 'checkOut': targetStatus = 'CHECKED_OUT'; break;
      }
      
      await reservationService.updateReservationStatus(reservation.id, targetStatus);
      toast.success(`Reservation status updated to ${targetStatus}`);
      setActionModal({ ...actionModal, isOpen: false });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGuest = async () => {
    if (!deleteGuestId) return;
    setIsProcessing(true);
    try {
      await guestService.deleteGuest(deleteGuestId);
      toast.success('Guest removed successfully');
      setDeleteGuestId(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove guest');
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
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-theme shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={() => navigate('/reservations')}
            className="p-2.5 bg-surface hover:bg-brand-50 hover:text-brand-600 rounded-full transition-colors text-text-secondary border border-theme shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-extrabold tracking-tight text-text">
                {reservation.reservation_number}
              </h1>
              <StatusBadge status={reservation.reservation_status} className="text-sm px-3 py-1 shadow-sm font-bold" />
            </div>
            <p className="text-[14px] text-text-muted mt-1 font-medium">Manage and review booking details</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          {reservation.reservation_status === 'PENDING' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel Booking</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'confirm' })}>Confirm Booking</Button>
            </>
          )}
          {reservation.reservation_status === 'CONFIRMED' && (
            <>
              <Button variant="danger" onClick={() => setActionModal({ isOpen: true, type: 'cancel' })}>Cancel Booking</Button>
              <Button onClick={() => setActionModal({ isOpen: true, type: 'checkIn' })}>Check In Guest</Button>
            </>
          )}
          {reservation.reservation_status === 'CHECKED_IN' && (
            <Button onClick={() => setActionModal({ isOpen: true, type: 'checkOut' })}>Check Out Guest</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5">
            <CardTitle className="flex items-center gap-2.5 text-[16px]">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <User size={18} />
              </div>
              Guest Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="bg-surface-muted/40 p-4 rounded-xl border border-border/50">
              <p className="text-[12px] uppercase tracking-wider font-bold text-text-secondary mb-1">Full Name</p>
              <p className="font-extrabold text-[16px] text-text">{reservation.customer_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Email Address</p>
                <p className="font-semibold text-text text-[14px] truncate" title={reservation.customer_email}>{reservation.customer_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Phone Number</p>
                <p className="font-semibold text-text text-[14px]">{reservation.customer_phone || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-semantic-info shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5">
            <CardTitle className="flex items-center gap-2.5 text-[16px]">
              <div className="p-1.5 bg-semantic-info/10 rounded-md text-semantic-info">
                <Calendar size={18} />
              </div>
              Stay Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-2 gap-4 bg-surface-muted/40 p-4 rounded-xl border border-border/50">
              <div>
                <p className="text-[12px] uppercase tracking-wider font-bold text-text-secondary mb-1">Check-in</p>
                <p className="font-extrabold text-text">{format(parseISO(reservation.check_in), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-wider font-bold text-text-secondary mb-1">Check-out</p>
                <p className="font-extrabold text-text">{format(parseISO(reservation.check_out), 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Duration</p>
                <p className="font-semibold text-text">{nights > 0 ? `${nights} Nights` : 'Same Day'}</p>
              </div>
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Total Guests</p>
                <p className="font-semibold text-text flex items-center gap-2">
                  {reservation.total_guests} 
                  <span className="text-[12px] text-text-muted font-medium bg-surface-muted px-2 py-0.5 rounded-full ml-1">
                    {reservation.number_of_adults} Adults, {reservation.number_of_children} Kids
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-brand-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5">
            <CardTitle className="flex items-center gap-2.5 text-[16px]">
              <div className="p-1.5 bg-brand-500/10 rounded-md text-brand-600">
                <Info size={18} />
              </div>
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="bg-surface-muted/40 p-4 rounded-xl border border-border/50 flex justify-between items-center">
              <div>
                <p className="text-[12px] uppercase tracking-wider font-bold text-text-secondary mb-1">Room Name</p>
                <p className="font-extrabold text-[16px] text-brand-600">{reservation.room_name || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] uppercase tracking-wider font-bold text-text-secondary mb-1">Rooms Booked</p>
                <p className="font-extrabold text-[16px] text-text">{reservation.number_of_rooms} Room(s)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Room Type</p>
                <p className="font-semibold text-text">{reservation.room_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[13px] text-text-secondary mb-1">View</p>
                <p className="font-semibold text-text">{reservation.room_view || 'N/A'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-[13px] text-text-secondary mb-1">Bed Type</p>
              <p className="font-semibold text-text">{reservation.bed_type || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-semantic-success shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5">
            <CardTitle className="flex items-center gap-2.5 text-[16px]">
              <div className="p-1.5 bg-semantic-success/10 rounded-md text-semantic-success">
                <CreditCard size={18} />
              </div>
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex justify-between items-center bg-surface-muted/40 p-4 rounded-xl border border-border/50">
              <p className="font-bold text-text">Total Amount</p>
              <p className="text-2xl font-black text-semantic-success">₹{reservation.total_amount.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-text-secondary">Room Price (per night)</p>
                <p className="font-semibold text-text">₹{reservation.room_price?.toLocaleString('en-IN') || 0}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-text-secondary">Subtotal</p>
                <p className="font-semibold text-text">₹{reservation.subtotal?.toLocaleString('en-IN') || 0}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-text-secondary">Discount</p>
                <p className="font-semibold text-semantic-danger">-₹{reservation.discount_amount?.toLocaleString('en-IN') || 0}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <p className="text-[14px] font-bold text-text">Payment Status</p>
                <p className="font-medium text-text">
                  <StatusBadge status={reservation.payment_status} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5">
            <CardTitle className="flex items-center gap-2.5 text-[16px]">
              <div className="p-1.5 bg-text-secondary/10 rounded-md text-text-secondary">
                <Info size={18} />
              </div>
              Additional Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <p className="text-[13px] text-text-secondary mb-1">Created At</p>
              <p className="font-semibold text-text text-[14px] flex items-center gap-2">
                <Clock size={14} className="text-text-muted" />
                {format(parseISO(reservation.created_at.replace(' ', 'T')), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
            {reservation.special_request && (
              <div className="pt-4 border-t border-border">
                <p className="text-[13px] font-bold text-text-secondary mb-2 uppercase tracking-wider">Special Request</p>
                <div className="bg-brand-50 text-brand-900 p-4 rounded-xl border border-brand-100 text-[14px] italic">
                  "{reservation.special_request}"
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Full Width Bottom: Guests */}
        <div className="md:col-span-2">
          <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-surface-muted/30 border-b border-border pb-4 pt-5 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-[16px]">
                <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-600">
                  <User size={18} />
                </div>
                Registered Guests
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border text-sm"
                onClick={() => { setSelectedGuest(null); setGuestModalOpen(true); }}
              >
                <UserPlus size={16} /> Add Guest
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {guests.length === 0 ? (
                <div className="text-center py-8 bg-surface-muted rounded-xl border border-dashed border-border/60">
                  <User className="mx-auto mb-3 text-text-muted" size={32} />
                  <p className="text-sm font-medium text-text-secondary">No guests registered for this reservation.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guests.map(guest => (
                    <div key={guest.id} className="relative p-4 rounded-xl border border-border/60 hover:border-primary/30 transition-colors bg-surface flex flex-col gap-3 group">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[15px]">
                            {guest.first_name.charAt(0)}{guest.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-text text-[15px]">{guest.first_name} {guest.last_name}</p>
                            <p className="text-[12px] text-text-secondary mt-0.5">{guest.phone || 'No Phone'}</p>
                          </div>
                        </div>
                        {guest.is_primary_guest === 1 && (
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-full border border-brand-200">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] bg-surface-muted/50 p-2.5 rounded-lg">
                        <div><span className="text-text-muted font-medium mr-1">DOB:</span> <span className="font-semibold">{guest.date_of_birth}</span></div>
                        <div><span className="text-text-muted font-medium mr-1">Gender:</span> <span className="font-semibold">{guest.gender}</span></div>
                        <div className="col-span-2"><span className="text-text-muted font-medium mr-1">Doc:</span> <span className="font-semibold">{guest.document_type} ({guest.document_number})</span></div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-surface p-1 rounded-lg border border-border shadow-sm">
                        <button 
                          onClick={() => { setSelectedGuest(guest); setGuestModalOpen(true); }}
                          className="p-1.5 text-text-secondary hover:text-brand-600 rounded transition-colors"
                          title="Edit Guest"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteGuestId(guest.id)}
                          className="p-1.5 text-text-secondary hover:text-semantic-danger rounded transition-colors"
                          title="Delete Guest"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <GuestFormModal
        isOpen={guestModalOpen}
        onClose={() => { setGuestModalOpen(false); setSelectedGuest(null); }}
        reservationId={reservation.id}
        guest={selectedGuest}
        onSuccess={loadData}
      />

      {/* Delete Guest Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteGuestId}
        onClose={() => setDeleteGuestId(null)}
        onConfirm={handleDeleteGuest}
        title="Remove Guest"
        message="Are you sure you want to remove this guest from the reservation? This action cannot be undone."
        confirmText="Remove"
        isDestructive
        isLoading={isProcessing}
      />

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
