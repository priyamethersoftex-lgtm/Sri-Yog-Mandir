export const dashboardData = {
  revenue: {
    total: 42850,
    completedBookings: 18,
    currency: '₹'
  },
  occupancy: {
    rate: 68,
    occupiedRooms: 9,
    totalRooms: 13
  },
  todaysBookings: {
    total: 5,
    confirmed: 3,
    pending: 2
  },
  availableRooms: {
    count: 4,
    statusText: 'Ready for check-in'
  },
  roomStatus: {
    available: 4,
    occupied: 9,
    maintenance: 0,
    total: 13
  },
  movements: {
    arrivals: 3,
    departures: 2
  },
  reservationOverview: {
    pending: 2,
    confirmed: 5,
    checkedIn: 4,
    checkedOut: 3,
    cancelled: 1
  },
  roomTypeOccupancy: [
    { type: 'Deluxe Room', occupied: 4, total: 5 },
    { type: 'Standard Room', occupied: 3, total: 4 },
    { type: 'Premium Room', occupied: 2, total: 3 },
    { type: 'Suite', occupied: 0, total: 1 }
  ],
  bookingTrend: [
    { label: 'Mon', revenue: 4500, bookings: 2 },
    { label: 'Tue', revenue: 7800, bookings: 4 },
    { label: 'Wed', revenue: 6200, bookings: 3 },
    { label: 'Thu', revenue: 8400, bookings: 5 },
    { label: 'Fri', revenue: 12500, bookings: 7 },
    { label: 'Sat', revenue: 15800, bookings: 8 },
    { label: 'Sun', revenue: 14200, bookings: 7 }
  ],
  recentReservations: [
    { id: 'BVM26081701', guest: 'Rahul Sharma', room: 'Deluxe 101', checkIn: '17 Aug', checkOut: '19 Aug', guests: '2 Guests', amount: 6500, status: 'Confirmed' },
    { id: 'BVM26081702', guest: 'Amit Verma', room: 'Standard 203', checkIn: '17 Aug', checkOut: '18 Aug', guests: '1 Guest', amount: 2800, status: 'Checked In' },
    { id: 'BVM26081703', guest: 'Neha Singh', room: 'Suite 301', checkIn: '18 Aug', checkOut: '20 Aug', guests: '2 Guests', amount: 8400, status: 'Pending' },
    { id: 'BVM26081704', guest: 'Priya Patel', room: 'Premium 201', checkIn: '16 Aug', checkOut: '17 Aug', guests: '2 Guests', amount: 4200, status: 'Checked Out' },
    { id: 'BVM26081705', guest: 'Vikram Mehta', room: 'Standard 105', checkIn: '18 Aug', checkOut: '19 Aug', guests: '1 Guest', amount: 2800, status: 'Confirmed' }
  ]
};
