import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { AppSettings } from '../../types';
import { settingsService } from '../../services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FormField } from '../../components/forms/FormField';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/data/LoadingState';
import { toast } from 'sonner';
import { useTheme } from '../../hooks/useTheme';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updated: AppSettings = {
        hotelName: formData.get('hotelName') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
      };
      await settingsService.updateSettings(updated);
      setSettings(updated);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) return <LoadingState />;

  return (
    <PageContainer
      title="Settings"
      description="Application preferences and configuration."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' }
      ]}
    >
      <div className="space-y-6 max-w-2xl mx-auto w-full">

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Hotel Name" name="hotelName" defaultValue={settings.hotelName} />
            <FormField label="Contact Email" name="contactEmail" type="email" defaultValue={settings.contactEmail} />
            <FormField label="Contact Phone" name="contactPhone" defaultValue={settings.contactPhone} />
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={isSaving}>Save Settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Theme Mode</p>
              <p className="text-sm text-text-secondary">Toggle between light and dark themes.</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </PageContainer>
  );
}
