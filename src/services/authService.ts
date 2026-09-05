import { axiosInstance } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface AdminUser {
  id: number;
  role: string;
  uuid: string;
  email: string;
  token?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    try {
      // The interceptor will automatically return response.data
      const data: any = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
        Email: email,
        Password: password
      });

      if (data.Success && data.Data && data.Data.length > 0) {
        const { Token, UserData } = data.Data[0];
        const user: AdminUser = {
          ...UserData,
          token: Token
        };
        localStorage.setItem('bym_admin_user', JSON.stringify(user));
        return user;
      }

      throw new Error(data.Message || 'Login failed');
    } catch (error: any) {
      // Axios wraps the error in error.response.data
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred during login';
      throw new Error(errorMessage);
    }
  },
  
  async logout(): Promise<void> {
    localStorage.removeItem('bym_admin_user');
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const data: any = await axiosInstance.put(ENDPOINTS.AUTH.UPDATE_PASSWORD, {
        newPassword
      });

      if (!data.Success) {
        throw new Error(data.Message || 'Failed to update password');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.Message || error.message || 'An error occurred during password update';
      throw new Error(errorMessage);
    }
  },
  
  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem('bym_admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
