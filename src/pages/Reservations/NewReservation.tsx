import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Room } from '../../types';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';
import { FormField } from '../../components/forms/FormField';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { PageContainer } from '../../components/ui/PageContainer';
import { ArrowLeft, User, CalendarDays, BedDouble, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, format, differenceInDays } from 'date-fns';
import { cn } from '../../utils/cn';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Invalid email address'),
  adults: z.coerce.number().min(1, 'At least 1 adult required'),
  children: z.coerce.number().min(0),
  checkIn: z.string().min(1, 'Check-in date required'),
  checkOut: z.string().min(1, 'Check-out date required'),
  roomId: z.string().min(1, 'Room selection required'),
  source: z.enum(['Website', 'Admin', 'Walk-in']),
  notes: z.string().optional()
}).refine(data => {
  const inDate = new Date(data.checkIn);
  const outDate = new Date(data.checkOut);
  return outDate > inDate;
}, {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});

type FormData = z.infer<typeof formSchema>;

export default function NewReservation() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRoomIds, setAvailableRoomIds] = useState<Set<string>>(new Set());
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: format(new Date(), 'yyyy-MM-dd'),
      checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      adults: 2,
      children: 0,
      source: 'Admin',
      notes: ''
    }
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const selectedRoomId = watch('roomId');

  useEffect(() => {
    async function loadRooms() {
      const allRooms = await roomService.getRooms();
      setRooms(allRooms);
    }
    loadRooms();
  }, []);

  // Dynamic Availability Check
  useEffect(() => {
    async function checkAvailability() {
      if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
        setAvailableRoomIds(new Set());
        return;
      }

      setIsCheckingAvailability(true);
      try {
        const available = new Set<string>();
        for (const room of rooms) {
          if (room.isMaintenance) continue;
          
          const isAvail = await reservationService.checkAvailability(room.id, checkIn, checkOut);
          if (isAvail) available.add(room.id);
        }
        setAvailableRoomIds(available);
        
        // Auto-deselect room if it became unavailable
        if (selectedRoomId && !available.has(selectedRoomId)) {
          setValue('roomId', '');
          toast.warning('Selected room is not available for these dates.');
        }
      } finally {
        setIsCheckingAvailability(false);
      }
    }
    
    if (rooms.length > 0) {
      checkAvailability();
    }
  }, [checkIn, checkOut, rooms]);

  const nights = (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) 
    ? differenceInDays(new Date(checkOut), new Date(checkIn)) 
    : 0;

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await reservationService.createBooking({
        guest: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          adults: data.adults,
          children: data.children
        },
        stay: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          nights,
          roomId: data.roomId
        },
        status: 'Confirmed',
        source: data.source,
        notes: data.notes || ''
      });
      
      toast.success('Reservation created successfully');
      navigate('/reservations');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="New Booking"
      description="Create a new reservation manually."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Reservations', href: '/reservations' },
        { label: 'New' }
      ]}
      action={
        <Button variant="outline" onClick={() => navigate('/reservations')} className="gap-2">
          <ArrowLeft size={16} /> Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="py-5 px-6 border-b border-border bg-surface-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <FormField label="Full Name" {...register('fullName')} error={errors.fullName?.message} placeholder="John Doe" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Phone" {...register('phone')} error={errors.phone?.message} placeholder="+91 98765 43210" />
                  <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Adults" type="number" {...register('adults')} error={errors.adults?.message} />
                  <FormField label="Children" type="number" {...register('children')} error={errors.children?.message} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 px-6 border-b border-border bg-surface-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-primary" />
                  Stay Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Check-in Date" type="date" {...register('checkIn')} error={errors.checkIn?.message} />
                  <FormField label="Check-out Date" type="date" {...register('checkOut')} error={errors.checkOut?.message} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Booking Source" as="select" {...register('source')} error={errors.source?.message}>
                    <option value="Admin">Admin / Phone</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 px-6 border-b border-border bg-surface-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <BedDouble size={18} className="text-primary" />
                  Room Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {isCheckingAvailability ? (
                    <div className="h-40 flex items-center justify-center text-primary bg-surface-muted/50 rounded-xl animate-pulse">
                      Checking availability...
                    </div>
                  ) : rooms.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-text-secondary bg-surface-muted/50 rounded-xl">
                      No rooms loaded.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rooms.map(room => {
                        const isAvail = availableRoomIds.has(room.id);
                        const isSelected = selectedRoomId === room.id;
                        return (
                          <div
                            key={room.id}
                            onClick={() => isAvail && setValue('roomId', room.id, { shouldValidate: true })}
                            className={cn(
                              "border rounded-xl p-4 transition-all duration-200 relative overflow-hidden",
                              isAvail ? "cursor-pointer hover:border-primary" : "opacity-50 cursor-not-allowed bg-surface-muted grayscale",
                              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-surface"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-text">{room.name}</h4>
                                <p className="text-[12px] font-medium text-text-secondary">{room.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">₹{room.pricePerNight}</p>
                                <p className="text-[10px] text-text-secondary">/ night</p>
                              </div>
                            </div>
                            {!isAvail && (
                              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-surface px-3 py-1 rounded-full text-[11px] font-bold text-semantic-danger border border-semantic-danger/20">
                                  Unavailable
                                </span>
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute top-0 right-0 w-8 h-8 bg-primary text-white flex items-center justify-center rounded-bl-xl">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {errors.roomId && <p className="text-[13px] text-semantic-danger font-medium">{errors.roomId.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 px-6 border-b border-border bg-surface-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormField label="Special Requests / Notes" as="textarea" {...register('notes')} placeholder="Enter any special requests or internal notes..." />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-[100px]">
              <Card className="border-primary/30 shadow-xl shadow-primary/5 bg-gradient-to-b from-surface to-surface-muted/30">
                <CardHeader className="py-5 px-6 border-b border-border">
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary font-medium">Dates</span>
                      <span className="font-bold text-text">{nights > 0 ? `${nights} nights` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary font-medium">Room</span>
                      <span className="font-bold text-text">{selectedRoom?.name || 'Not selected'}</span>
                    </div>
                    {selectedRoom && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-text-secondary font-medium">Rate per night</span>
                        <span className="font-bold text-text">₹{selectedRoom.pricePerNight.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Total Amount</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[28px] font-bold tracking-tight text-primary">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full text-[15px]" 
                      isLoading={isSubmitting}
                      disabled={!selectedRoomId || nights <= 0 || isCheckingAvailability}
                    >
                      Confirm Booking
                    </Button>
                    <p className="text-center text-[11px] text-text-secondary mt-3">
                      Please verify guest details and dates before confirming.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
