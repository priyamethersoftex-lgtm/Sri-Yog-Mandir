import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface RoomType {
  id: number;
  uuid: string;
  name: string;
  description: string;
  is_active: number;
  sort_order: number;
}

export const roomTypeService = {
  getRoomTypes: async (is_active: boolean | null = null): Promise<RoomType[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_TYPE.GET, {
        is_active,
      });

      if (response.Success) {
        return response.Data || [];
      }
      throw new Error(response.Message || 'Failed to fetch room types');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  createRoomType: async (payload: { name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_TYPE.CREATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to create room type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateRoomType: async (payload: { id: number; name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.ROOM_TYPE.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update room type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteRoomType: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.ROOM_TYPE.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete room type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
