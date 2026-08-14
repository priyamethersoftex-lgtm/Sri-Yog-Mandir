import { Room, Booking, GalleryItem, AppSettings } from '../types';
import { initialRooms, initialBookings, initialSettings } from './seedData';

interface DbState {
  rooms: Room[];
  bookings: Booking[];
  gallery: GalleryItem[];
  settings: AppSettings;
}

class MockDb {
  private state: DbState = {
    rooms: [],
    bookings: [],
    gallery: [],
    settings: { hotelName: '', contactEmail: '', contactPhone: '' }
  };

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    const data = localStorage.getItem('bym_admin_data');
    if (data) {
      this.state = JSON.parse(data);
    } else {
      this.state = {
        rooms: [...initialRooms],
        bookings: [...initialBookings],
        gallery: [],
        settings: { ...initialSettings }
      };
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('bym_admin_data', JSON.stringify(this.state));
  }

  // --- Rooms ---
  getRooms(): Room[] {
    return [...this.state.rooms];
  }

  getRoom(id: string): Room | undefined {
    return this.state.rooms.find(r => r.id === id);
  }

  updateRoom(room: Room): void {
    const index = this.state.rooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      // Enforce locked fields
      const existing = this.state.rooms[index];
      const updated = { ...room, id: existing.id, name: existing.name };
      this.state.rooms[index] = updated;
      this.persist();
    }
  }

  // --- Bookings ---
  getBookings(): Booking[] {
    return [...this.state.bookings];
  }

  getBooking(id: string): Booking | undefined {
    return this.state.bookings.find(b => b.id === id);
  }

  addBooking(booking: Booking): void {
    this.state.bookings.push(booking);
    this.persist();
  }

  updateBooking(booking: Booking): void {
    const index = this.state.bookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      this.state.bookings[index] = booking;
      this.persist();
    }
  }

  // --- Gallery ---
  getGallery(): GalleryItem[] {
    return [...this.state.gallery];
  }

  addGalleryItem(item: GalleryItem): void {
    this.state.gallery.push(item);
    this.persist();
  }

  updateGalleryItem(item: GalleryItem): void {
    const index = this.state.gallery.findIndex(g => g.id === item.id);
    if (index !== -1) {
      this.state.gallery[index] = item;
      this.persist();
    }
  }

  deleteGalleryItem(id: string): void {
    this.state.gallery = this.state.gallery.filter(g => g.id !== id);
    this.persist();
  }

  // --- Settings ---
  getSettings(): AppSettings {
    return { ...this.state.settings };
  }

  updateSettings(settings: AppSettings): void {
    this.state.settings = settings;
    this.persist();
  }
}

export const mockDb = new MockDb();
