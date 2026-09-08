import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface DashboardStats {
  rooms: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
  };
  trend: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  revenue: {
    total: number;
    completed_bookings: number;
  };
  inquiries: {
    total: number;
    closed: number;
    pending: number;
  };
  movements: {
    arrivals: number;
    departures: number;
  };
  reservations: {
    total: number;
    pending: number;
    cancelled: number;
    confirmed: number;
    checked_in: number;
    checked_out: number;
  };
  today_bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  recent_reservations: Array<{
    room: string;
    guest: string;
    amount: number;
    guests: number;
    status: string;
    check_in: string;
    check_out: string;
    booking_id: string;
  }>;
  room_type_occupancy: Array<{
    total: number;
    occupied: number;
    room_type: string;
  }>;
}

export const dashboardService = {
  getStats: async (from_date: string | null = null, to_date: string | null = null): Promise<DashboardStats> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.DASHBOARD.GET_STATS, {
        from_date,
        to_date,
      });

      if (response.Success && response.Data && response.Data.length > 0) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to fetch dashboard stats');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },
};
