import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ImageUploader } from '../../components/forms/ImageUploader';
import { Drawer } from '../../components/ui/Drawer';
import { ImagePreviewModal } from '../../components/ui/ImagePreviewModal';
import { bannerService, Banner } from '../../services/bannerService';
import { uploadService } from '../../services/uploadService';
import { imageThumb, imageOriginal } from '../../utils/ImgUrl';
import { formatDate } from '../../utils/dateformatUtils';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // UI state
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  
  // Form state
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  
  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_url: '',
    sort_order: 1,
    start_date: '',
    end_date: '',
    is_active: 1
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchBanners();
  }, [page]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await bannerService.getBanners(page, pageSize);
      setBanners(response.list);
      setTotalRecords(response.pagination.total);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPreviewImage('');
    setSelectedBanner(null);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      // The API returns an id which we save in the image_url field
      setFormData(prev => ({ ...prev, image_url: response.id }));
      // Set the preview to the full variant returned from the API
      if (response.variants && response.variants.length > 0) {
        setPreviewImage(response.variants[0]); // full variant
      } else {
        setPreviewImage(imageOriginal(response.id));
      }
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed');
      throw error; // Rethrow to let ImageUploader handle the error state
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Please upload a banner image');
      return;
    }

    setIsSubmitting(true);
    try {
      await bannerService.createBanner(formData);
      toast.success('Banner created successfully');
      setIsCreateDrawerOpen(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;
    if (!formData.image_url) {
      toast.error('Please upload a banner image');
      return;
    }

    setIsSubmitting(true);
    try {
      await bannerService.updateBanner({
        id: selectedBanner.id,
        ...formData
      });
      toast.success('Banner updated successfully');
      setIsEditDrawerOpen(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;
    setIsSubmitting(true);
    try {
      await bannerService.deleteBanner(selectedBanner.id);
      toast.success('Banner deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      const newStatus = banner.is_active === 1 ? 0 : 1;
      await bannerService.updateBannerStatus(banner.id, newStatus);
      toast.success('Status updated');
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const openEditDrawer = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description || '',
      image_url: banner.image_url,
      button_text: banner.button_text || '',
      button_url: banner.button_url || '',
      sort_order: banner.sort_order,
      start_date: banner.start_date ? banner.start_date.split(' ')[0] : '', // Format YYYY-MM-DD
      end_date: banner.end_date ? banner.end_date.split(' ')[0] : '',
      is_active: banner.is_active
    });
    setPreviewImage(imageOriginal(banner.image_url));
    setIsEditDrawerOpen(true);
  };

  const columns = [
    {
      header: 'Image',
      cell: (item: Banner) => (
        <div 
          className="w-20 h-12 rounded overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setPreviewImageUrl(imageOriginal(item.image_url))}
        >
          <img 
            src={imageOriginal(item.image_url)} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )
    },
    {
      header: 'Title',
      cell: (item: Banner) => (
        <div className="max-w-xs">
          <div className="font-bold text-sm leading-tight" title={item.title}>{item.title}</div>
          <div className="text-xs text-text-muted mt-1 leading-tight" title={item.subtitle}>{item.subtitle}</div>
        </div>
      )
    },
    { 
      header: 'Order', 
      accessorKey: 'sort_order' as keyof Banner,
      className: 'text-center w-16'
    },
    { 
      header: 'Date Range', 
      cell: (item: Banner) => {
        return (
          <div className="text-xs text-text-secondary">
            <div>{formatDate(item.start_date)}</div>
            <div>{formatDate(item.end_date)}</div>
          </div>
        );
      }
    },
    { 
      header: 'Status', 
      cell: (item: Banner) => (
        <button 
          onClick={() => toggleStatus(item)}
          className="outline-none hover:opacity-80 transition-opacity"
          title="Toggle status"
        >
          <StatusBadge status={item.is_active === 1 ? 'active' : 'inactive'} />
        </button>
      ) 
    },
    {
      header: 'Actions',
      cell: (item: Banner) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditDrawer(item)}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit banner"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedBanner(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete banner"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const renderFormFields = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[13px] font-bold text-text mb-2">Banner Image</label>
        <ImageUploader 
          value={previewImage} 
          onChange={(base64) => setPreviewImage(base64)} 
          onUpload={handleImageUpload}
          isUploading={isUploading}
          onRemove={() => { setPreviewImage(''); setFormData({ ...formData, image_url: '' }); }}
        />
      </div>
      
      <FormField label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter banner title" required />
      <FormField label="Subtitle" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="Enter a short subtitle" required />
      
      <FormField label="Description" as="textarea" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter banner description" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Button Text" value={formData.button_text} onChange={e => setFormData({...formData, button_text: e.target.value})} placeholder="e.g. Learn More" />
        <FormField label="Button URL" value={formData.button_url} onChange={e => setFormData({...formData, button_url: e.target.value})} placeholder="e.g. /about" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
        <FormField label="End Date" type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 1})} placeholder="1" required />
        <FormField label="Status" as="select" value={formData.is_active} onChange={e => setFormData({...formData, is_active: parseInt(e.target.value)})} required>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </FormField>
      </div>
    </div>
  );

  return (
    <PageContainer
      title="Banners"
      description="Manage the main hero banners displayed on the frontend."
      action={
        <Button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Banner
        </Button>
      }
    >
      <DataTable
        data={banners}
        columns={columns}
        keyExtractor={(item) => item.id}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
      />

      {/* Create Drawer */}
      <Drawer isOpen={isCreateDrawerOpen} onClose={() => { setIsCreateDrawerOpen(false); resetForm(); }} title="Add New Banner">
        <form onSubmit={handleCreateSubmit} className="flex flex-col pb-6">
          {renderFormFields()}
          <div className="pt-6 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreateDrawerOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting || isUploading}>Create Banner</Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer isOpen={isEditDrawerOpen} onClose={() => { setIsEditDrawerOpen(false); resetForm(); }} title="Edit Banner">
        <form onSubmit={handleEditSubmit} className="flex flex-col pb-6">
          {renderFormFields()}
          <div className="pt-6 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditDrawerOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting || isUploading}>Save Changes</Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Banner"
        message={`Are you sure you want to delete "${selectedBanner?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        isDestructive
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal 
        selectedImg={previewImageUrl} 
        onClose={() => setPreviewImageUrl(null)} 
      />
    </PageContainer>
  );
}
