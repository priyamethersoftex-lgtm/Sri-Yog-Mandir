import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface Banner {
  id: number;
  uuid: string;
  title: string;
  subtitle: string;
  description?: string;
  image_url: string;
  button_text?: string;
  button_url?: string;
  sort_order: number;
  start_date: string;
  end_date: string;
  is_active: number;
}

export interface BannerPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface GetBannersResponse {
  list: Banner[];
  pagination: BannerPagination;
}

export const bannerService = {
  async getBanners(
    page: number = 1,
    limit: number = 20,
    is_active: number | null = null
  ): Promise<GetBannersResponse> {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.BANNER.GET, {
        id: null,
        page,
        limit,
        is_active,
      });

      if (response.Success) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to fetch banners');
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while fetching banners';
      throw new Error(errorMessage);
    }
  },

  async createBanner(payload: Omit<Banner, 'id' | 'uuid'>): Promise<void> {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.BANNER.CREATE, payload);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to create banner');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while creating banner';
      throw new Error(errorMessage);
    }
  },

  async updateBanner(payload: Partial<Omit<Banner, 'uuid'>> & { id: number }): Promise<void> {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.BANNER.UPDATE, payload);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to update banner');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while updating banner';
      throw new Error(errorMessage);
    }
  },

  async updateBannerStatus(id: number, is_active: number): Promise<void> {
    try {
      const response: any = await axiosInstance.patch(ENDPOINTS.BANNER.UPDATE_STATUS, {
        id,
        is_active
      });
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to update banner status');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while updating banner status';
      throw new Error(errorMessage);
    }
  },

  async deleteBanner(id: number): Promise<void> {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.BANNER.DELETE, {
        data: { id }
      });
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to delete banner');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while deleting banner';
      throw new Error(errorMessage);
    }
  }
};
