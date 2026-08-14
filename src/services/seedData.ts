import { Room, Booking, GalleryItem, AppSettings } from '../types';

export const initialRooms: Room[] = [
  {
    id: 'shree',
    name: 'Shree',
    nameHi: 'श्री',
    category: 'Suit River View',
    pricePerNight: 3000,
    originalPrice: 4000,
    view: 'Ganga River View',
    floor: '2nd Floor',
    bedType: 'King Size',
    sizeSqFt: 350,
    capacity: { adults: 2, children: 1 },
    tagline: 'Experience luxury by the Ganges',
    shortDescription: 'Our premium suite offering panoramic views of the sacred river.',
    description: 'The Shree Suite is our most luxurious accommodation...',
    features: ['River View', 'Balcony', 'AC'],
    amenities: ['Free WiFi', 'TV', 'Tea Maker'],
    isPopular: true,
    mainImage: '/placeholder.jpg',
    galleryImages: [],
    isMaintenance: false,
  },
  { id: 'bhuvha', name: 'Bhuvha', nameHi: 'भुवः', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '1st Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'swaha', name: 'Swaha', nameHi: 'स्वाहा', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '1st Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'krishna', name: 'Krishna', nameHi: 'कृष्ण', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '1st Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'agni', name: 'Agni', nameHi: 'अग्नि', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '2nd Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'kamla', name: 'Kamla', nameHi: 'कमला', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '2nd Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'kaali', name: 'Kaali', nameHi: 'काली', category: 'Ganga Deluxe River', pricePerNight: 2000, originalPrice: 2500, view: 'Ganga River View', floor: '3rd Floor', bedType: 'Queen Size', sizeSqFt: 250, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'brahma', name: 'Brahma', nameHi: 'ब्रह्मा', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '1st Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'vishnu', name: 'Vishnu', nameHi: 'विष्णु', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '1st Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'radha', name: 'Radha', nameHi: 'राधा', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '2nd Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'durga', name: 'Durga', nameHi: 'दुर्गा', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '2nd Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'ganga', name: 'Ganga', nameHi: 'गंगा', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '3rd Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
  { id: 'jyoti', name: 'Jyoti', nameHi: 'ज्योति', category: 'Deluxe Non-River View', pricePerNight: 1500, originalPrice: 2000, view: 'City View', floor: '3rd Floor', bedType: 'Queen Size', sizeSqFt: 200, capacity: { adults: 2, children: 1 }, tagline: '', shortDescription: '', description: '', features: [], amenities: [], isPopular: false, mainImage: '/placeholder.jpg', galleryImages: [], isMaintenance: false },
];

export const initialBookings: Booking[] = [
  {
    id: 'B-1001',
    guest: { fullName: 'John Doe', phone: '+1234567890', email: 'john@example.com', adults: 2, children: 0 },
    stay: { checkIn: new Date().toISOString().split('T')[0], checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], nights: 2, roomId: 'shree' },
    roomPriceAtBooking: 3000,
    totalAmount: 6000,
    status: 'Checked In',
    source: 'Website',
    notes: 'Late arrival',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'B-1002',
    guest: { fullName: 'Jane Smith', phone: '+0987654321', email: 'jane@example.com', adults: 1, children: 0 },
    stay: { checkIn: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], checkOut: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0], nights: 3, roomId: 'bhuvha' },
    roomPriceAtBooking: 2000,
    totalAmount: 6000,
    status: 'Confirmed',
    source: 'Admin',
    notes: '',
    createdAt: new Date().toISOString()
  }
];

export const initialSettings: AppSettings = {
  hotelName: 'Banaras Yog Mandir',
  contactEmail: 'info@banarasyogmandir.com',
  contactPhone: '+91 1234567890'
};
