import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FormField } from '../../components/forms/FormField';
import { Button } from '../../components/ui/Button';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-text-primary">Profile</h1>
        <p className="text-text-secondary mt-1">Manage your administrative account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Name" defaultValue={user?.name} disabled />
          <FormField label="Email" type="email" defaultValue={user?.email} disabled />
          
          <div className="pt-4 border-t border-theme/50 flex justify-end">
            <Button disabled>Save Changes</Button>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            * Note: Profile updating is disabled in this demo environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
