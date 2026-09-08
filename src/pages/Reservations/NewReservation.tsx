import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  customer_name: z.string().min(2, 'Name is required'),
  customer_phone: z.string().min(10, 'Valid phone number required'),
  customer_email: z.string().email('Invalid email address'),
  number_of_adults: z.coerce.number().min(1, 'At least 1 adult required'),
  number_of_children: z.coerce.number().min(0),
  number_of_rooms: z.coerce.number().min(1, 'At least 1 room required'),
  check_in: z.string().min(1, 'Check-in date required'),
  check_out: z.string().min(1, 'Check-out date required'),
  room_id: z.coerce.number().min(1, 'Room selection required'),
  special_request: z.string().optional()
}).refine(data => {
  const inDate = new Date(data.check_in);
  const outDate = new Date(data.check_out);
  return outDate > inDate;
}, {
  message: "Check-out must be after check-in",
  path: ["check_out"]
});

type FormData = z.infer<typeof formSchema>;

export default function NewReservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<number | null>(null);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      check_in: format(new Date(), 'yyyy-MM-dd'),
      check_out: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      number_of_adults: 2,
      number_of_children: 0,
      number_of_rooms: 1,
      special_request: ''
    }
  });

  const checkIn = watch('check_in');
  const checkOut = watch('check_out');
  const selectedRoomId = watch('room_id');
  const numberOfRooms = watch('number_of_rooms') || 1;

  useEffect(() => {
    // If coming from Inquiry, prefill details
    if (location.state) {
      const { inquiry_id, name, email, phone } = location.state as any;
      if (inquiry_id) setInquiryId(inquiry_id);
      if (name) setValue('customer_name', name);
      if (email) setValue('customer_email', email);
      if (phone) setValue('customer_phone', phone);
    }
  }, [location.state, setValue]);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await roomService.getRooms({ limit: 100 });
        setRooms(data.list);
      } catch (err: any) {
        toast.error('Failed to load rooms');
      }
    }
    loadRooms();
  }, []);

  const nights = (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) 
    ? differenceInDays(new Date(checkOut), new Date(checkIn)) 
    : 0;

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const totalAmount = selectedRoom ? selectedRoom.base_price * nights * numberOfRooms : 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await reservationService.createReservation({
        p_inquiry_id: inquiryId,
        room_id: data.room_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        check_in: data.check_in,
        check_out: data.check_out,
        number_of_adults: data.number_of_adults,
        number_of_children: data.number_of_children,
        number_of_rooms: data.number_of_rooms,
        special_request: data.special_request || ''
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">
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
                <FormField label="Full Name" {...register('customer_name')} error={errors.customer_name?.message} placeholder="John Doe" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Phone" {...register('customer_phone')} error={errors.customer_phone?.message} placeholder="9876543210" />
                  <FormField label="Email" type="email" {...register('customer_email')} error={errors.customer_email?.message} placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField label="Adults" type="number" {...register('number_of_adults')} error={errors.number_of_adults?.message} />
                  <FormField label="Children" type="number" {...register('number_of_children')} error={errors.number_of_children?.message} />
                  <FormField label="No. of Rooms" type="number" {...register('number_of_rooms')} error={errors.number_of_rooms?.message} />
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
                  <FormField label="Check-in Date" type="date" {...register('check_in')} error={errors.check_in?.message} />
                  <FormField label="Check-out Date" type="date" {...register('check_out')} error={errors.check_out?.message} />
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
                  {rooms.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-text-secondary bg-surface-muted/50 rounded-xl animate-pulse">
                      Loading rooms...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rooms.map(room => {
                        const isSelected = selectedRoomId === room.id;
                        return (
                          <div
                            key={room.id}
                            onClick={() => setValue('room_id', room.id, { shouldValidate: true })}
                            className={cn(
                              "border rounded-xl p-4 transition-all duration-200 relative overflow-hidden cursor-pointer hover:border-primary",
                              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-surface"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-text">{room.name_en}</h4>
                                <p className="text-[12px] font-medium text-text-secondary">Room {room.room_number}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">₹{room.base_price}</p>
                                <p className="text-[10px] text-text-secondary">/ night</p>
                              </div>
                            </div>
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
                  {errors.room_id && <p className="text-[13px] text-semantic-danger font-medium">{errors.room_id.message}</p>}
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
                <FormField label="Special Requests / Notes" as="textarea" {...register('special_request')} placeholder="Enter any special requests..." />
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
                      <span className="text-text-secondary font-medium">Rooms</span>
                      <span className="font-bold text-text">{numberOfRooms} {numberOfRooms === 1 ? 'Room' : 'Rooms'}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary font-medium">Selected Type</span>
                      <span className="font-bold text-text">{selectedRoom?.name_en || 'Not selected'}</span>
                    </div>
                    {selectedRoom && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-text-secondary font-medium">Rate per night</span>
                        <span className="font-bold text-text">₹{selectedRoom.base_price.toLocaleString('en-IN')}</span>
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
                      disabled={!selectedRoomId || nights <= 0}
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
