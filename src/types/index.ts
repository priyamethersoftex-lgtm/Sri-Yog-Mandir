export type RoomCategory = 'Suit River View' | 'Ganga Deluxe River' | 'Deluxe Non-River View';
export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
export type BookingSource = 'Website' | 'Admin' | 'Walk-in';

export interface RoomCapacity {
  adults: number;
  children: number;
}

export interface Room {
  id: number;
  uuid: string;
  room_number: string;
  slug: string;
  name_en: string;
  name_hi: string;
  tagline: string;
  short_description: string;
  description: string;
  room_type_id: number;
  room_type?: string; // from API
  capacity_adults: number;
  capacity_children: number;
  base_price: number;
  original_price: number;
  currency: string;
  size_sq_ft: number;
  bed_type_id: number;
  view_id: number;
  floor: string;
  is_popular: number;
  is_active: number;
  status: string; // "AVAILABLE" etc
  primary_image?: string | null;
}

export interface RoomImage {
  id: number;
  uuid?: string;
  room_id: number;
  image_url: string;
  alt_text: string;
  is_primary: number | boolean;
  sort_order?: number;
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

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'REFUNDED';

export interface Reservation {
  id: number;
  uuid: string;
  reservation_number: string;
  customer_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  payment_status: PaymentStatus;
  reservation_status: ReservationStatus;
  created_at: string;
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
