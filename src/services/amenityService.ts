import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface Amenity {
  id: number;
  uuid: string;
  name: string;
  icon: string;
  is_active: number;
  sort_order: number;
}

export const amenityService = {
  getAmenities: async (is_active: boolean | null = null): Promise<Amenity[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.AMENITY.GET, {
        is_active,
      });

      if (response.Success) {
        return response.Data || [];
      }
      throw new Error(response.Message || 'Failed to fetch amenities');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  createAmenity: async (payload: { name: string; icon: string; sort_order: number; is_active: number }) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.AMENITY.CREATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to create amenity');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateAmenity: async (payload: { id: number; name: string; icon: string; sort_order: number; is_active: number }) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.AMENITY.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update amenity');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteAmenity: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.AMENITY.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete amenity');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
