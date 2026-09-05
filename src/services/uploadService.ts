import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface UploadImageResponse {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadImageResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // axiosInstance intercepts and adds the Authorization header
      const response: any = await axiosInstance.post(ENDPOINTS.UPLOAD.IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.Success && response.Data && response.Data.length > 0) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to upload image');
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred during upload';
      throw new Error(errorMessage);
    }
  },
};
