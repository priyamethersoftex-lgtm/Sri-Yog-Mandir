export type RoomCategory = 'Suit River View' | 'Ganga Deluxe River' | 'Deluxe Non-River View';
export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
export type BookingSource = 'Website' | 'Admin' | 'Walk-in';

export interface RoomCapacity {
  adults: number;
  children: number;
}

export interface Room {
  id: string; // locked
  name: string; // locked
  nameHi: string;
  category: RoomCategory;
  pricePerNight: number;
  originalPrice: number;
  view: string;
  floor: string;
  bedType: string;
  sizeSqFt: number;
  capacity: RoomCapacity;
  tagline: string;
  shortDescription: string;
  description: string;
  features: string[];
  amenities: string[];
  isPopular: boolean;
  mainImage: string;
  galleryImages: string[];
  isMaintenance: boolean; // Controls highest priority maintenance status
}

export interface Guest {
  fullName: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
}

export interface Stay {
  checkIn: string; // ISO date string (YYYY-MM-DD)
  checkOut: string; // ISO date string (YYYY-MM-DD)
  nights: number;
  roomId: string;
}

export interface Booking {
  id: string;
  guest: Guest;
  stay: Stay;
  roomPriceAtBooking: number; // Snapshot of the price
  totalAmount: number;
  status: BookingStatus;
  source: BookingSource;
  notes: string;
  createdAt: string; // ISO datetime
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  caption: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface AppSettings {
  hotelName: string;
  contactEmail: string;
  contactPhone: string;
}
