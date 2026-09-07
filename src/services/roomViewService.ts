import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface RoomView {
  id: number;
  uuid: string;
  name: string;
  description: string;
  is_active: number;
  sort_order: number;
}

export const roomViewService = {
  getRoomViews: async (is_active: boolean | null = null): Promise<RoomView[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_VIEW.GET, {
        is_active,
      });

      if (response.Success) {
        return response.Data || [];
      }
      throw new Error(response.Message || 'Failed to fetch room views');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  createRoomView: async (payload: { name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_VIEW.CREATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to create room view');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateRoomView: async (payload: { id: number; name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.ROOM_VIEW.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update room view');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteRoomView: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.ROOM_VIEW.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete room view');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
