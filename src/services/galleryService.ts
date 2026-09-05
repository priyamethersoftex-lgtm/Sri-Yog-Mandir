import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface GalleryItem {
  id: number;
  uuid: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
  category: string;
  sort_order: number;
  is_active: number;
}

export interface GalleryResponse {
  list: GalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const galleryService = {
  async getGalleryItems(page: number = 1, limit: number = 50, category: string | null = null, is_active: number | null = null): Promise<GalleryResponse> {
    const response: any = await axiosInstance.post(ENDPOINTS.GALLERY.GET, {
      id: null,
      page,
      limit,
      category,
      is_active
    });
    
    if (response.Success) {
      return response.Data[0];
    }
    throw new Error(response.Message || 'Failed to fetch gallery items');
  },

  async createGalleryItem(itemData: Omit<GalleryItem, 'id' | 'uuid'>): Promise<void> {
    const response: any = await axiosInstance.post(ENDPOINTS.GALLERY.CREATE, itemData);
    if (!response.Success) {
      throw new Error(response.Message || 'Failed to create gallery item');
    }
  },

  async updateGalleryItem(itemData: Omit<GalleryItem, 'uuid'>): Promise<void> {
    const response: any = await axiosInstance.put(ENDPOINTS.GALLERY.UPDATE, itemData);
    if (!response.Success) {
      throw new Error(response.Message || 'Failed to update gallery item');
    }
  },

  async updateGalleryItemStatus(id: number, is_active: number): Promise<void> {
    const response: any = await axiosInstance.patch(ENDPOINTS.GALLERY.UPDATE_STATUS, {
      id,
      is_active
    });
    if (!response.Success) {
      throw new Error(response.Message || 'Failed to update status');
    }
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const response: any = await axiosInstance.delete(ENDPOINTS.GALLERY.DELETE, {
      data: { id }
    });
    if (!response.Success) {
      throw new Error(response.Message || 'Failed to delete gallery item');
    }
  }
};
