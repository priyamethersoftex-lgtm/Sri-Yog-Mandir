import { Room, RoomStatus } from '../types';
import { mockDb } from './mockDb';
import { isBefore, isAfter, startOfDay, parseISO } from 'date-fns';

export const roomService = {
  async getRooms(): Promise<Room[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDb.getRooms();
  },

  async getRoom(id: string): Promise<Room> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const room = mockDb.getRoom(id);
    if (!room) throw new Error('Room not found');
    return room;
  },

  async updateRoom(room: Room): Promise<Room> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDb.updateRoom(room);
    return room;
  },

  async getRoomStatus(roomId: string, targetDate: Date = new Date()): Promise<RoomStatus> {
    const room = mockDb.getRoom(roomId);
    if (!room) return 'Available';

    if (room.isMaintenance) {
      return 'Maintenance';
    }

    const bookings = mockDb.getBookings().filter(b => b.stay.roomId === roomId);
    const target = startOfDay(targetDate);

    // Check if occupied today
    const occupiedBooking = bookings.find(b => 
      b.status === 'Checked In' && 
      !isBefore(target, startOfDay(parseISO(b.stay.checkIn))) &&
      isBefore(target, startOfDay(parseISO(b.stay.checkOut)))
    );
    if (occupiedBooking) return 'Occupied';

    // Check if reserved today
    const reservedBooking = bookings.find(b => 
      b.status === 'Confirmed' && 
      !isBefore(target, startOfDay(parseISO(b.stay.checkIn))) &&
      isBefore(target, startOfDay(parseISO(b.stay.checkOut)))
    );
    if (reservedBooking) return 'Reserved';

    return 'Available';
  }
};
