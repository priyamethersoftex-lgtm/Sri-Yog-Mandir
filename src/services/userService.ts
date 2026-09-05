import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface User {
  id: number;
  name: string;
  role: string;
  uuid: string;
  email: string;
  phone: string | number;
  is_active: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface GetUsersResponse {
  list: User[];
  pagination: UserPagination;
}

export const userService = {
  async getUsers(
    page: number = 1,
    limit: number = 20,
    search: string | null = null,
    is_active: number | null = null
  ): Promise<GetUsersResponse> {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.USER.GET, {
        id: null,
        page,
        limit,
        search,
        is_active,
      });

      if (response.Success) {
        return response.Data[0];
      }
      throw new Error(response.Message || 'Failed to fetch users');
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while fetching users';
      throw new Error(errorMessage);
    }
  },

  async createUser(payload: Omit<User, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'last_login_at' | 'is_active'> & { password?: string }): Promise<void> {
    try {
      const response: any = await axiosInstance.post(ENDPOINTS.USER.CREATE, payload);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to create user');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while creating user';
      throw new Error(errorMessage);
    }
  },

  async updateUser(id: number, payload: Partial<Omit<User, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'last_login_at' | 'email' | 'is_active'>>): Promise<void> {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.USER.UPDATE, {
        id,
        ...payload
      });
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to update user');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while updating user';
      throw new Error(errorMessage);
    }
  },

  async updateUserStatus(id: number, is_active: number): Promise<void> {
    try {
      const response: any = await axiosInstance.put(ENDPOINTS.USER.UPDATE_STATUS, {
        id,
        is_active
      });
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to update user status');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while updating user status';
      throw new Error(errorMessage);
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      const response: any = await axiosInstance.delete(ENDPOINTS.USER.DELETE, {
        data: { id }
      });
      
      if (!response.Success) {
        throw new Error(response.Message || 'Failed to delete user');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred while deleting user';
      throw new Error(errorMessage);
    }
  }
};
