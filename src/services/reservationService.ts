import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';
import { Reservation } from '../types';

export const reservationService = {
  getReservations: async (params: { page?: number, limit?: number, search?: string | null, reservation_status?: string | null } = {}): Promise<{ list: Reservation[], pagination: any }> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.RESERVATION.GET, {
        id: null,
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search || null,
        reservation_status: params.reservation_status || null,
      });

      if (response.Success && response.Data && response.Data[0]) {
        return {
          list: response.Data[0].list || [],
          pagination: response.Data[0].pagination
        };
      }
      throw new Error(response.Message || 'Failed to fetch reservations');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  getReservationById: async (id: number): Promise<Reservation> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.RESERVATION.GET, {
        id: id,
        page: 1,
        limit: 1,
        search: null,
        reservation_status: null
      });

      if (response.Success && response.Data) {
        const data = response.Data;
        
        // Handle pagination structure
        if (Array.isArray(data) && data[0] && data[0].list && Array.isArray(data[0].list)) {
          if (data[0].list.length > 0) return data[0].list[0];
        }
        
        // Handle direct array of objects
        if (Array.isArray(data) && data.length > 0 && !data[0].list) {
          return data[0]; 
        }

        // Handle single object
        if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
          if (data.id) return data;
        }
      }
      
      throw new Error('Reservation not found');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error(error.message || 'Network error');
    }
  },

  createReservation: async (payload: {
    p_inquiry_id: number | null;
    room_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    check_in: string;
    check_out: string;
    number_of_adults: number;
    number_of_children: number;
    number_of_rooms: number;
    special_request: string;
  }): Promise<Reservation> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.RESERVATION.CREATE, payload);
      if (response.Success) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to create reservation');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
