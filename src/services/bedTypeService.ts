import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface BedType {
  id: number;
  uuid: string;
  name: string;
  description: string;
  is_active: number;
  sort_order: number;
}

export const bedTypeService = {
  getBedTypes: async (is_active: boolean | null = null): Promise<BedType[]> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.BED_TYPE.GET, {
        is_active,
      });

      if (response.Success) {
        return response.Data || [];
      }
      throw new Error(response.Message || 'Failed to fetch bed types');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  createBedType: async (payload: { name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.BED_TYPE.CREATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to create bed type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  updateBedType: async (payload: { id: number; name: string; description: string; sort_order: number }) => {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.BED_TYPE.UPDATE, payload);
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to update bed type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },

  deleteBedType: async (id: number) => {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.BED_TYPE.DELETE, {
        data: { id }
      });
      if (response.Success) {
        return response;
      }
      throw new Error(response.Message || 'Failed to delete bed type');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  }
};
