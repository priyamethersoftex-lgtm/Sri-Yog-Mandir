import React, { useState } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FormField } from '../../components/forms/FormField';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    setIsUpdating(true);
    try {
      await authService.updatePassword(newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageContainer
      title="Profile"
      description="Manage your administrative account."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profile' }
      ]}
    >
      <div className="space-y-6 max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <FormField 
                label="Email (Read-only)" 
                type="email" 
                defaultValue={user?.email || ''} 
                disabled 
              />
              <FormField 
                label="Role (Read-only)" 
                defaultValue={user?.role ? user.role.replace(/_/g, ' ') : ''} 
                disabled 
              />
              <FormField 
                label="New Password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button type="submit" isLoading={isUpdating}>Update Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
