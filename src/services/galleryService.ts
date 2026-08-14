import { GalleryItem } from '../types';
import { mockDb } from './mockDb';

export const galleryService = {
  async getGalleryItems(): Promise<GalleryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDb.getGallery();
  },

  async addGalleryItem(itemData: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem: GalleryItem = {
      ...itemData,
      id: `G-${Math.floor(1000 + Math.random() * 9000)}`
    };
    mockDb.addGalleryItem(newItem);
    return newItem;
  },

  async updateGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    await new Promise(resolve => setTimeout(resolve, 400));
    mockDb.updateGalleryItem(item);
    return item;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockDb.deleteGalleryItem(id);
  }
};
