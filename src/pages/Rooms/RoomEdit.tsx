import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { roomService } from '../../services/roomService';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { LoadingState } from '../../components/data/LoadingState';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { PageContainer } from '../../components/ui/PageContainer';

export default function RoomEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await roomService.getRoom(id);
        setRoom(data);
      } catch (error) {
        toast.error('Failed to load room');
        navigate('/rooms');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      const updated: Room = {
        ...room,
        pricePerNight: Number(formData.get('pricePerNight')),
        originalPrice: Number(formData.get('originalPrice')),
        category: formData.get('category') as any,
        nameHi: formData.get('nameHi') as string,
        view: formData.get('view') as string,
        floor: formData.get('floor') as string,
        bedType: formData.get('bedType') as string,
        sizeSqFt: Number(formData.get('sizeSqFt')),
        capacity: {
          adults: Number(formData.get('adults')),
          children: Number(formData.get('children')),
        },
        tagline: formData.get('tagline') as string,
        shortDescription: formData.get('shortDescription') as string,
        description: formData.get('description') as string,
      };

      await roomService.updateRoom(updated);
      setRoom(updated);
      toast.success('Room updated successfully');
    } catch (error) {
      toast.error('Failed to update room');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMaintenance = async () => {
    if (!room) return;
    setIsSaving(true);
    try {
      const updated = { ...room, isMaintenance: !room.isMaintenance };
      await roomService.updateRoom(updated);
      setRoom(updated);
      toast.success(`Room marked as ${updated.isMaintenance ? 'Maintenance' : 'Available'}`);
      setIsMaintenanceDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !room) return <LoadingState />;

  return (
    <PageContainer
      title={`Edit Room: ${room.name}`}
      description="Update room pricing, capacity, and descriptions."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Rooms', href: '/rooms' },
        { label: room.name }
      ]}
      action={
        <Button variant="outline" onClick={() => navigate('/rooms')} className="gap-2 border-border hover:bg-surface-muted">
          <ArrowLeft size={16} /> Back to Rooms
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Locked Identity Section */}
            <Card className="border-l-4 border-l-primary bg-surface-muted/30">
              <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-[16px] text-primary flex items-center gap-2">
                  <Lock size={16} /> Room Identity (Locked)
                </CardTitle>
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider px-2 py-1 bg-surface rounded-full border border-border">Read-Only</span>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[12px] text-text-secondary font-medium">Room ID</p>
                  <p className="font-bold text-text text-[15px]">{room.id}</p>
                </div>
                <div>
                  <p className="text-[12px] text-text-secondary font-medium">Room Name</p>
                  <p className="font-bold text-text text-[15px]">{room.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Hindi Name" name="nameHi" defaultValue={room.nameHi} />
                  <FormField 
                    label="Category" 
                    name="category" 
                    as="select" 
                    defaultValue={room.category}
                    options={[
                      { label: 'Suit River View', value: 'Suit River View' },
                      { label: 'Ganga Deluxe River', value: 'Ganga Deluxe River' },
                      { label: 'Deluxe Non-River View', value: 'Deluxe Non-River View' },
                    ]}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <FormField label="Price per Night (₹)" name="pricePerNight" type="number" defaultValue={room.pricePerNight} />
                  <FormField label="Original Price (₹) - For Strikethrough" name="originalPrice" type="number" defaultValue={room.originalPrice} />
                </div>
                
                <div className="grid grid-cols-3 gap-5">
                  <FormField label="Adults" name="adults" type="number" defaultValue={room.capacity.adults} />
                  <FormField label="Children" name="children" type="number" defaultValue={room.capacity.children} />
                  <FormField label="Size (Sq Ft)" name="sizeSqFt" type="number" defaultValue={room.sizeSqFt} />
                </div>
                
                <div className="grid grid-cols-3 gap-5">
                  <FormField label="View" name="view" defaultValue={room.view} />
                  <FormField label="Floor" name="floor" defaultValue={room.floor} />
                  <FormField label="Bed Type" name="bedType" defaultValue={room.bedType} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
                <CardTitle>Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField label="Tagline" name="tagline" defaultValue={room.tagline} />
                <FormField label="Short Description (Listing preview)" name="shortDescription" as="textarea" defaultValue={room.shortDescription} />
                <FormField label="Full Description (Detail page)" name="description" as="textarea" defaultValue={room.description} className="min-h-[150px]" />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => navigate('/rooms')}>Discard Changes</Button>
              <Button type="submit" isLoading={isSaving}>Save Room Changes</Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className={room.isMaintenance ? "border-semantic-danger ring-1 ring-semantic-danger/30" : ""}>
            <CardHeader className="bg-surface-muted/50 border-b border-border py-4">
              <CardTitle className="flex items-center gap-2 text-[15px]">
                <AlertTriangle size={18} className={room.isMaintenance ? "text-semantic-danger" : "text-primary"} />
                Operational Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${room.isMaintenance ? 'bg-semantic-danger/10 text-semantic-danger' : 'bg-semantic-success/10 text-semantic-success'}`}>
                {room.isMaintenance ? <AlertTriangle size={28} /> : <AlertTriangle size={28} className="opacity-0" />}
              </div>
              
              <div className="space-y-1 text-center">
                <h3 className="font-bold text-[17px] text-text">
                  {room.isMaintenance ? "Under Maintenance" : "Room is Active"}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {room.isMaintenance 
                    ? "This room is blocked from accepting any new bookings." 
                    : "Room is open for reservations."}
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  variant={room.isMaintenance ? "outline" : "danger"} 
                  className="w-full font-bold"
                  onClick={() => setIsMaintenanceDialogOpen(true)}
                >
                  {room.isMaintenance ? "Mark as Available" : "Block for Maintenance"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmationDialog 
        isOpen={isMaintenanceDialogOpen}
        onClose={() => setIsMaintenanceDialogOpen(false)}
        onConfirm={toggleMaintenance}
        title={room.isMaintenance ? "Mark Room Available" : "Mark Room for Maintenance"}
        message={room.isMaintenance 
          ? `Are you sure you want to make ${room.name} available for bookings again?` 
          : `Are you sure you want to place ${room.name} under maintenance? This will block all future dates until reversed.`}
        confirmText={room.isMaintenance ? "Mark Available" : "Confirm Maintenance"}
        isDestructive={!room.isMaintenance}
        isLoading={isSaving}
      />
    </PageContainer>
  );
}
