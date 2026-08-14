import React from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FormField } from '../../components/forms/FormField';
import { Button } from '../../components/ui/Button';

export default function Profile() {
  const { user } = useAuth();

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
        <CardContent className="space-y-4">
          <FormField label="Name" defaultValue={user?.name} disabled />
          <FormField label="Email" type="email" defaultValue={user?.email} disabled />
          
          <div className="pt-4 border-t border-border flex justify-end">
            <Button disabled>Save Changes</Button>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            * Note: Profile updating is disabled in this demo environment.
          </p>
        </CardContent>
      </Card>
      </div>
    </PageContainer>
  );
}
