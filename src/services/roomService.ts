import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';
import { Room, RoomImage } from '../types';

export const roomService = {
  // ROOM CRUD
  getRooms: async (params: { page?: number, limit?: number, room_type_id?: number | null, status?: string | null, is_active?: number | null } = {}): Promise<{ list: Room[], pagination: any }> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM.GET, {
        id: null,
        page: params.page || 1,
        limit: params.limit || 100, // Large default limit for "All Rooms" view
        room_type_id: params.room_type_id || null,
        status: params.status || null,
        is_active: params.is_active !== undefined ? params.is_active : null,
      });

      if (response.Success && response.Data && response.Data[0]) {
        return {
          list: response.Data[0].list || [],
          pagination: response.Data[0].pagination
        };
      }
      throw new Error(response.Message || 'Failed to fetch rooms');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  getRoomById: async (id: number): Promise<Room> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM.GET, {
        id: id,
        page: 1,
        limit: 1,
      });

      if (response.Success && response.Data) {
        const data = response.Data;
        
        // 1. Check if it's an array with a nested list: [{ list: [...] }]
        if (Array.isArray(data) && data[0] && data[0].list && Array.isArray(data[0].list)) {
          if (data[0].list.length > 0) return data[0].list[0];
        }
        
        // 2. Check if it's just an array of rooms: [{ id: 1, ... }]
        if (Array.isArray(data) && data.length > 0) {
          if (!data[0].list) return data[0]; // First element is the room
        }

        // 3. Check if it's a single room object: { id: 1, ... }
        if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
          if (data.id) return data;
        }
      }
      
      throw new Error('Room not found in database response');
    } catch (error: any) {
      console.error('getRoomById error:', error);
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error(error.message || 'Network error');
    }
  },

  createRoom: async (payload: Partial<Room>) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM.CREATE, payload);
      if (response.Success) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to create room');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateRoom: async (payload: Partial<Room>) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.ROOM.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update room');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  // ROOM IMAGE CRUD
  getRoomImages: async (roomId: number): Promise<RoomImage[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_IMAGE.GET, {
        room_id: roomId
      });
      if (response.Success) {
        return response.Data || [];
      }
      throw new Error(response.Message || 'Failed to fetch room images');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  addRoomImage: async (payload: { room_id: number, image_url: string, alt_text: string, is_primary: boolean, sort_order: number }) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM_IMAGE.ADD, payload);
      if (response.Success) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to add room image');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateRoomImage: async (payload: { id: number, image_url: string, alt_text: string, sort_order: number }) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.ROOM_IMAGE.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update room image');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  setPrimaryImage: async (roomId: number, imageId: number) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.ROOM_IMAGE.SET_PRIMARY, {
        room_id: roomId,
        image_id: imageId
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to set primary image');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteRoomImage: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.ROOM_IMAGE.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete room image');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  assignAmenity: async (roomId: number, amenityId: number) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.ROOM.AMENITY_ASSIGN, {
        room_id: roomId,
        amenity_id: amenityId
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to assign amenity');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  removeAmenity: async (roomId: number, amenityId: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.ROOM.AMENITY_REMOVE, {
        data: { room_id: roomId, amenity_id: amenityId }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to remove amenity');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
