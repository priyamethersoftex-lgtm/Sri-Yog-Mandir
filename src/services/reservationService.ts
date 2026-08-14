import { Booking, BookingStatus } from '../types';
import { mockDb } from './mockDb';
import { roomService } from './roomService';
import { isBefore, isAfter, parseISO, startOfDay } from 'date-fns';

export const reservationService = {
  async getBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDb.getBookings();
  },

  async getBooking(id: string): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const booking = mockDb.getBooking(id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  async checkAvailability(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Minimal delay for UX
    const room = mockDb.getRoom(roomId);
    if (!room || room.isMaintenance) return false;

    const newIn = startOfDay(parseISO(checkIn));
    const newOut = startOfDay(parseISO(checkOut));
    
    if (isBefore(newOut, newIn) || newIn.getTime() === newOut.getTime()) {
      return false; // Invalid dates
    }

    const bookings = mockDb.getBookings().filter(b => 
      b.stay.roomId === roomId &&
      (b.status === 'Confirmed' || b.status === 'Checked In' || b.status === 'Pending') &&
      b.id !== excludeBookingId
    );

    for (const b of bookings) {
      const existingIn = startOfDay(parseISO(b.stay.checkIn));
      const existingOut = startOfDay(parseISO(b.stay.checkOut));

      // Overlap formula: (existingCheckIn < newCheckOut) AND (existingCheckOut > newCheckIn)
      if (isBefore(existingIn, newOut) && isAfter(existingOut, newIn)) {
        return false;
      }
    }

    return true;
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'roomPriceAtBooking' | 'totalAmount' | 'createdAt'>): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const isAvailable = await this.checkAvailability(bookingData.stay.roomId, bookingData.stay.checkIn, bookingData.stay.checkOut);
    if (!isAvailable) {
      throw new Error('Room is no longer available for these dates.');
    }

    const room = mockDb.getRoom(bookingData.stay.roomId);
    if (!room) throw new Error('Room not found');

    const roomPriceAtBooking = room.pricePerNight;
    const totalAmount = roomPriceAtBooking * bookingData.stay.nights;

    const newBooking: Booking = {
      ...bookingData,
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      roomPriceAtBooking,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    mockDb.addBooking(newBooking);
    return newBooking;
  },

  async updateBooking(booking: Booking): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDb.updateBooking(booking);
    return booking;
  },

  async transitionStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = mockDb.getBooking(id);
    if (!booking) throw new Error('Booking not found');

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['Checked In', 'Cancelled'],
      'Checked In': ['Checked Out'],
      'Checked Out': [],
      'Cancelled': []
    };

    if (!validTransitions[booking.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${booking.status} to ${newStatus}`);
    }

    booking.status = newStatus;
    mockDb.updateBooking(booking);
    return booking;
  }
};
