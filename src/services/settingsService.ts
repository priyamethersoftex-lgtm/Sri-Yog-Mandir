import { AppSettings } from '../types';
import { mockDb } from './mockDb';

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDb.getSettings();
  },

  async updateSettings(settings: AppSettings): Promise<AppSettings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDb.updateSettings(settings);
    return settings;
  }
};
