import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';
import { ReservationGuest } from '../types';

export const guestService = {
  getGuestsByReservationId: async (reservationId: number): Promise<ReservationGuest[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.GUEST.GET, {
        id: null,
        reservation_id: reservationId
      });

      if (response.Success && response.Data) {
        const data = response.Data;
        if (Array.isArray(data) && data[0] && data[0].list && Array.isArray(data[0].list)) {
          return data[0].list;
        }
      }
      return [];
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  createGuest: async (payload: Omit<ReservationGuest, 'id' | 'uuid'>) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.GUEST.CREATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to create guest');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateGuest: async (payload: Omit<ReservationGuest, 'uuid' | 'reservation_id'>) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.GUEST.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update guest');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteGuest: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.GUEST.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete guest');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
