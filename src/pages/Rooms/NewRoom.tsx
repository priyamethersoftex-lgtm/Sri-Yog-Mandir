import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { roomTypeService, RoomType } from '../../services/roomTypeService';
import { bedTypeService, BedType } from '../../services/bedTypeService';
import { roomViewService, RoomView } from '../../services/roomViewService';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { PageContainer } from '../../components/ui/PageContainer';

export default function NewRoom() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Reference data
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [roomViews, setRoomViews] = useState<RoomView[]>([]);

  useEffect(() => {
    async function loadRefs() {
      try {
        const [rTypes, bTypes, rViews] = await Promise.all([
          roomTypeService.getRoomTypes(true),
          bedTypeService.getBedTypes(true),
          roomViewService.getRoomViews(true)
        ]);
        setRoomTypes(rTypes);
        setBedTypes(bTypes);
        setRoomViews(rViews);
      } catch (error) {
        toast.error('Failed to load reference data');
      }
    }
    loadRefs();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      const payload = {
        room_number: formData.get('room_number') as string,
        slug: formData.get('slug') as string,
        name_en: formData.get('name_en') as string,
        name_hi: formData.get('name_hi') as string,
        tagline: formData.get('tagline') as string,
        short_description: formData.get('short_description') as string,
        description: formData.get('description') as string,
        room_type_id: Number(formData.get('room_type_id')),
        capacity_adults: Number(formData.get('capacity_adults')),
        capacity_children: Number(formData.get('capacity_children')),
        base_price: Number(formData.get('base_price')),
        original_price: Number(formData.get('original_price')),
        currency: 'INR', // Defaulted or can be added to form
        size_sq_ft: Number(formData.get('size_sq_ft')),
        bed_type_id: Number(formData.get('bed_type_id')),
        view_id: Number(formData.get('view_id')),
        floor: formData.get('floor') as string,
        is_popular: formData.get('is_popular') === 'on' ? 1 : 0
      };

      const newRoom = await roomService.createRoom(payload);
      toast.success('Room created successfully');
      // Navigate to the edit page to allow uploading images
      navigate(`/rooms/${newRoom.id}/edit`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer
      title="Add New Room"
      description="Create a new physical room in your property."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Rooms', href: '/rooms' },
        { label: 'Add Room' }
      ]}
      action={
        <Button variant="outline" onClick={() => navigate('/rooms')} className="gap-2 border-border hover:bg-surface-muted">
          <ArrowLeft size={16} /> Back to Rooms
        </Button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-12">
        
        <Card>
          <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Room Number" name="room_number" placeholder="e.g. 101" required />
              <FormField label="Slug (URL friendly)" name="slug" placeholder="e.g. deluxe-room-101" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Name (English)" name="name_en" required />
              <FormField label="Name (Hindi)" name="name_hi" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormField 
                label="Room Type" 
                name="room_type_id" 
                as="select" 
                options={roomTypes.map(t => ({ label: t.name, value: t.id.toString() }))}
                required
              />
              <FormField 
                label="Bed Type" 
                name="bed_type_id" 
                as="select" 
                options={bedTypes.map(b => ({ label: b.name, value: b.id.toString() }))}
                required
              />
              <FormField 
                label="View" 
                name="view_id" 
                as="select" 
                options={roomViews.map(v => ({ label: v.name, value: v.id.toString() }))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
            <CardTitle>Pricing & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <FormField label="Base Price (₹)" name="base_price" type="number" required />
              <FormField label="Original Price (₹) - For Strikethrough" name="original_price" type="number" />
            </div>
            
            <div className="grid grid-cols-3 gap-5">
              <FormField label="Adults Capacity" name="capacity_adults" type="number" defaultValue={2} required />
              <FormField label="Children Capacity" name="capacity_children" type="number" defaultValue={0} required />
              <FormField label="Size (Sq Ft)" name="size_sq_ft" type="number" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField label="Floor" name="floor" placeholder="e.g. First Floor" />
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="is_popular" name="is_popular" className="w-5 h-5 accent-primary" />
                <label htmlFor="is_popular" className="text-sm font-medium text-text">Mark as Popular Room</label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
            <CardTitle>Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <FormField label="Tagline" name="tagline" placeholder="e.g. Divine Grace and Elegance" />
            <FormField label="Short Description (Listing preview)" name="short_description" as="textarea" />
            <FormField label="Full Description (Detail page)" name="description" as="textarea" className="min-h-[150px]" required />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={() => navigate('/rooms')}>Cancel</Button>
          <Button type="submit" isLoading={isSaving} className="gap-2">
            <Save size={16} /> Save Room
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
