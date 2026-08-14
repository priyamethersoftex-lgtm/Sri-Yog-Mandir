import { mockDb } from './mockDb';
import { roomService } from './roomService';
import { isBefore, isAfter, parseISO, startOfDay } from 'date-fns';

export interface DashboardStats {
  totalRooms: number; // Always 13
  availableToday: number;
  occupiedToday: number;
  maintenanceToday: number;
  arrivalsToday: number;
  departuresToday: number;
  pendingReservations: number;
  confirmedReservations: number;
  checkedInGuests: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rooms = mockDb.getRooms();
    const bookings = mockDb.getBookings();
    const today = startOfDay(new Date());

    let availableToday = 0;
    let occupiedToday = 0;
    let maintenanceToday = 0;

    // Calculate room statuses
    for (const room of rooms) {
      const status = await roomService.getRoomStatus(room.id, today);
      if (status === 'Available') availableToday++;
      if (status === 'Occupied') occupiedToday++;
      if (status === 'Maintenance') maintenanceToday++;
    }

    // Bookings metrics
    const arrivalsToday = bookings.filter(b => 
      (b.status === 'Confirmed' || b.status === 'Checked In') && 
      startOfDay(parseISO(b.stay.checkIn)).getTime() === today.getTime()
    ).length;

    const departuresToday = bookings.filter(b => 
      (b.status === 'Checked In' || b.status === 'Confirmed') && 
      startOfDay(parseISO(b.stay.checkOut)).getTime() === today.getTime()
    ).length;

    const pendingReservations = bookings.filter(b => b.status === 'Pending').length;
    const confirmedReservations = bookings.filter(b => b.status === 'Confirmed').length;
    
    // Checked in guests (total adults + children of all 'Checked In' bookings)
    const checkedInGuests = bookings
      .filter(b => b.status === 'Checked In')
      .reduce((sum, b) => sum + b.guest.adults + b.guest.children, 0);

    return {
      totalRooms: rooms.length, // Should be 13
      availableToday,
      occupiedToday,
      maintenanceToday,
      arrivalsToday,
      departuresToday,
      pendingReservations,
      confirmedReservations,
      checkedInGuests
    };
  }
};
