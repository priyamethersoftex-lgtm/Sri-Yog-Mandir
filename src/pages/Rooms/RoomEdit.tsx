import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room, RoomImage } from '../../types';
import { roomService } from '../../services/roomService';
import { roomTypeService, RoomType } from '../../services/roomTypeService';
import { bedTypeService, BedType } from '../../services/bedTypeService';
import { roomViewService, RoomView } from '../../services/roomViewService';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { LoadingState } from '../../components/data/LoadingState';
import { toast } from 'sonner';
import { ArrowLeft, Save, AlertTriangle, Lock, ImageIcon, Star, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { PageContainer } from '../../components/ui/PageContainer';
import { Drawer } from '../../components/ui/Drawer';
import { ImageUploader } from '../../components/forms/ImageUploader';
import { uploadService } from '../../services/uploadService';
import { imageOriginal } from '../../utils/ImgUrl';

export default function RoomEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roomId = Number(id);

  const [room, setRoom] = useState<Room | null>(null);
  const [images, setImages] = useState<RoomImage[]>([]);
  
  // Reference data
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [roomViews, setRoomViews] = useState<RoomView[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Image Modal State
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(''); // Stores the ID
  const [previewImage, setPreviewImage] = useState(''); // Stores the full URL for preview
  const [newImageAlt, setNewImageAlt] = useState('');
  const [isNewImagePrimary, setIsNewImagePrimary] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!roomId) return;
      try {
        const [rData, imgs, rTypes, bTypes, rViews] = await Promise.all([
          roomService.getRoomById(roomId),
          roomService.getRoomImages(roomId).catch(() => []),
          roomTypeService.getRoomTypes(null),
          bedTypeService.getBedTypes(null),
          roomViewService.getRoomViews(null)
        ]);
        setRoom(rData);
        setImages(imgs);
        setRoomTypes(rTypes);
        setBedTypes(bTypes);
        setRoomViews(rViews);
      } catch (error) {
        toast.error('Failed to load room data');
        navigate('/rooms');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [roomId, navigate]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      const payload = {
        id: room.id,
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
        currency: room.currency || 'INR',
        size_sq_ft: Number(formData.get('size_sq_ft')),
        bed_type_id: Number(formData.get('bed_type_id')),
        view_id: Number(formData.get('view_id')),
        floor: formData.get('floor') as string,
        is_popular: formData.get('is_popular') === 'on' ? 1 : 0
      };

      await roomService.updateRoom(payload);
      const updated = await roomService.getRoomById(roomId);
      setRoom(updated);
      toast.success('Room updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update room');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsSaving(true);
    try {
      await roomService.addRoomImage({
        room_id: roomId,
        image_url: newImageUrl,
        alt_text: newImageAlt,
        is_primary: isNewImagePrimary,
        sort_order: images.length + 1
      });
      toast.success('Image added successfully');
      setNewImageUrl('');
      setPreviewImage('');
      setNewImageAlt('');
      setIsNewImagePrimary(false);
      setIsAddImageOpen(false);
      
      const newImages = await roomService.getRoomImages(roomId);
      setImages(newImages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      
      setNewImageUrl(response.id);
      
      if (response.variants && response.variants.length > 0) {
        setPreviewImage(response.variants[0]);
      } else {
        setPreviewImage(imageOriginal(response.id));
      }
      
      toast.success('Image uploaded to server successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await roomService.setPrimaryImage(roomId, imageId);
      toast.success('Primary image updated');
      const newImages = await roomService.getRoomImages(roomId);
      setImages(newImages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set primary image');
    }
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    setIsSaving(true);
    try {
      await roomService.deleteRoomImage(imageToDelete);
      toast.success('Image deleted successfully');
      setImageToDelete(null);
      const newImages = await roomService.getRoomImages(roomId);
      setImages(newImages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!room) return;
    setIsSaving(true);
    try {
      // API currently uses update endpoint, but let's assume status might be controlled differently or just mock it here if not available.
      // Wait, there is no explicit room status update API provided in the curl. 
      // I'll just show the dialog and show a toast for now to avoid breaking without the API.
      toast.info('Status update feature coming soon (API required)');
      setIsStatusDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !room) return <LoadingState />;

  return (
    <PageContainer
      title={`Edit Room: ${room.name_en}`}
      description="Update room details, pricing, and images."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Rooms', href: '/rooms' },
        { label: room.name_en }
      ]}
      action={
        <Button variant="outline" onClick={() => navigate('/rooms')} className="gap-2 border-border hover:bg-surface-muted">
          <ArrowLeft size={16} /> Back to Rooms
        </Button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6 pb-12">
            
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
                  <p className="text-[12px] text-text-secondary font-medium">UUID</p>
                  <p className="font-bold text-text text-[13px] truncate">{room.uuid}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-5 bg-surface-muted/50 border-b border-border">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Room Number" name="room_number" defaultValue={room.room_number} required />
                  <FormField label="Slug (URL friendly)" name="slug" defaultValue={room.slug} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Name (English)" name="name_en" defaultValue={room.name_en} required />
                  <FormField label="Name (Hindi)" name="name_hi" defaultValue={room.name_hi} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField 
                    label="Room Type" 
                    name="room_type_id" 
                    as="select" 
                    defaultValue={room.room_type_id}
                    options={roomTypes.map(t => ({ label: t.name, value: t.id.toString() }))}
                    required
                  />
                  <FormField 
                    label="Bed Type" 
                    name="bed_type_id" 
                    as="select" 
                    defaultValue={room.bed_type_id}
                    options={bedTypes.map(b => ({ label: b.name, value: b.id.toString() }))}
                    required
                  />
                  <FormField 
                    label="View" 
                    name="view_id" 
                    as="select" 
                    defaultValue={room.view_id}
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
                  <FormField label={`Base Price (${room.currency})`} name="base_price" type="number" defaultValue={room.base_price} required />
                  <FormField label={`Original Price (${room.currency})`} name="original_price" type="number" defaultValue={room.original_price} />
                </div>
                
                <div className="grid grid-cols-3 gap-5">
                  <FormField label="Adults Capacity" name="capacity_adults" type="number" defaultValue={room.capacity_adults} required />
                  <FormField label="Children Capacity" name="capacity_children" type="number" defaultValue={room.capacity_children} required />
                  <FormField label="Size (Sq Ft)" name="size_sq_ft" type="number" defaultValue={room.size_sq_ft} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <FormField label="Floor" name="floor" defaultValue={room.floor} placeholder="e.g. First Floor" />
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="is_popular" name="is_popular" defaultChecked={room.is_popular === 1} className="w-5 h-5 accent-primary" />
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
                <FormField label="Tagline" name="tagline" defaultValue={room.tagline} />
                <FormField label="Short Description" name="short_description" as="textarea" defaultValue={room.short_description} />
                <FormField label="Full Description" name="description" as="textarea" defaultValue={room.description} className="min-h-[150px]" required />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => navigate('/rooms')}>Cancel Changes</Button>
              <Button type="submit" isLoading={isSaving} className="gap-2">
                <Save size={16} /> Save Room Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Images & Status */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Images Section */}
          <Card>
            <CardHeader className="bg-surface-muted/50 border-b border-border py-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[15px]">
                <ImageIcon size={18} className="text-primary" />
                Room Images
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsAddImageOpen(true)} className="h-8 gap-1.5 border-border">
                <Plus size={14} /> Add Image
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {images.length === 0 ? (
                <div className="text-center py-8 text-text-secondary border border-dashed border-border rounded-lg bg-surface-muted">
                  <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">No images added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-surface-muted">
                      <img src={imageOriginal(img.image_url)} alt={img.alt_text} className="w-full h-full object-cover" />
                      
                      {img.is_primary === 1 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Star size={10} className="fill-white" /> Primary
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {img.is_primary !== 1 && (
                          <button 
                            onClick={() => handleSetPrimary(img.id)}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-primary text-white flex items-center justify-center transition-colors"
                            title="Set as Primary"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => setImageToDelete(img.id)}
                          className="w-8 h-8 rounded-full bg-white/20 hover:bg-semantic-danger text-white flex items-center justify-center transition-colors"
                          title="Delete Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operational Status Section */}
          <Card className={room.is_active === 0 ? "border-semantic-danger ring-1 ring-semantic-danger/30" : ""}>
            <CardHeader className="bg-surface-muted/50 border-b border-border py-4">
              <CardTitle className="flex items-center gap-2 text-[15px]">
                <AlertTriangle size={18} className={room.is_active === 0 ? "text-semantic-danger" : "text-primary"} />
                Operational Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${room.is_active === 0 ? 'bg-semantic-danger/10 text-semantic-danger' : 'bg-semantic-success/10 text-semantic-success'}`}>
                {room.is_active === 0 ? <AlertTriangle size={28} /> : <AlertTriangle size={28} className="opacity-0" />}
              </div>
              
              <div className="space-y-1 text-center">
                <h3 className="font-bold text-[17px] text-text">
                  {room.is_active === 0 ? "Inactive" : "Room is Active"}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {room.is_active === 0 
                    ? "This room is currently inactive." 
                    : "Room is active and visible."}
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  variant={room.is_active === 0 ? "outline" : "danger"} 
                  className="w-full font-bold"
                  onClick={() => setIsStatusDialogOpen(true)}
                >
                  {room.is_active === 0 ? "Mark as Active" : "Deactivate Room"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Image Drawer */}
      <Drawer isOpen={isAddImageOpen} onClose={() => { setIsAddImageOpen(false); setNewImageUrl(''); setPreviewImage(''); }} title="Add Room Image">
        <form onSubmit={handleAddImage} className="flex flex-col space-y-4 pb-6">
          <ImageUploader 
            value={previewImage} 
            onChange={(base64) => setPreviewImage(base64)} 
            onUpload={handleImageUpload}
            isUploading={isUploading}
            onRemove={() => { setPreviewImage(''); setNewImageUrl(''); }}
          />
          <FormField 
            label="Alt Text" 
            value={newImageAlt} 
            onChange={(e) => setNewImageAlt(e.target.value)} 
            placeholder="Room view..." 
            required 
          />
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="is_primary" 
              checked={isNewImagePrimary} 
              onChange={(e) => setIsNewImagePrimary(e.target.checked)} 
              className="w-5 h-5 accent-primary" 
            />
            <label htmlFor="is_primary" className="text-sm font-medium text-text">Set as Primary Image</label>
          </div>
          <div className="pt-5 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddImageOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSaving}>Add Image</Button>
          </div>
        </form>
      </Drawer>

      {/* Status Confirmation */}
      <ConfirmationDialog 
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={toggleStatus}
        title={room.is_active === 0 ? "Activate Room" : "Deactivate Room"}
        message={room.is_active === 0 
          ? `Are you sure you want to activate ${room.name_en}?` 
          : `Are you sure you want to deactivate ${room.name_en}?`}
        confirmText={room.is_active === 0 ? "Activate" : "Deactivate"}
        isDestructive={room.is_active !== 0}
        isLoading={isSaving}
      />

      {/* Delete Image Confirmation */}
      <ConfirmationDialog 
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isSaving}
      />
    </PageContainer>
  );
}
