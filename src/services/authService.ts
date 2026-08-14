export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // DEMO CREDENTIALS
    if (email === 'admin@banarasyogmandir.com' && password === 'admin123') {
      const user = { id: '1', name: 'Admin User', email };
      localStorage.setItem('bym_admin_user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid email or password');
  },
  
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('bym_admin_user');
  },
  
  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem('bym_admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
