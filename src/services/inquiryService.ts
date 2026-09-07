import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface Inquiry {
  id: number;
  name: string;
  uuid: string;
  email: string;
  status: string;
  subject: string;
  created_at: string;
  assigned_to: string | null;
}

export interface InquiryResponse {
  list: Inquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const inquiryService = {
  getInquiries: async (page: number, limit: number, search?: string | null, status?: string | null, assigned_to?: string | null): Promise<InquiryResponse> => {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.INQUIRY.GET, {
        id: null,
        page,
        limit,
        search: search || null,
        status: status || null,
        assigned_to: assigned_to || null,
      });

      if (response.Success) {
        return {
          list: response.Data[0].list,
          pagination: response.Data[0].pagination,
        };
      }
      throw new Error(response.Message || 'Failed to fetch inquiries');
    } catch (error: any) {
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw error;
    }
  },
};
