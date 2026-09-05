import React, { useEffect, useState } from 'react';
import { GalleryItem } from '../../services/galleryService';
import { galleryService } from '../../services/galleryService';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { FormField } from '../../components/forms/FormField';
import { ImageUploader } from '../../components/forms/ImageUploader';
import { PageContainer } from '../../components/ui/PageContainer';
import { ImagePreviewModal } from '../../components/ui/ImagePreviewModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { toast } from 'sonner';
import { ImagePlus, Trash2, Edit2 } from 'lucide-react';
import { imageOriginal, imageThumb } from '../../utils/ImgUrl';
import { uploadService } from '../../services/uploadService';

const CATEGORIES = ['All', 'Ganges View', 'Yoga & Meditation', 'Rooms & Suites', 'Dining & Sattvic', 'Spiritual Tours', 'Temple Tour', 'Aarti & Events'];

export default function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals / Drawers
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Form State
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    alt_text: '',
    category: 'Ganges View',
    sort_order: 1,
    is_active: 1
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, [page]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getGalleryItems(page, pageSize, null, null);
      setItems(data.list);
      setTotalRecords(data.pagination.total);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      alt_text: '',
      category: 'Ganges View',
      sort_order: 1,
      is_active: 1
    });
    setSelectedItem(null);
    setPreviewImage('');
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: response.id }));
      if (response.variants && response.variants.length > 0) {
        setPreviewImage(response.variants[0]); 
      } else {
        setPreviewImage(imageOriginal(response.id));
      }
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await galleryService.createGalleryItem(formData);
      toast.success('Gallery item created successfully');
      setIsCreateDrawerOpen(false);
      resetForm();
      loadItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!formData.image_url) {
      toast.error('Image is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await galleryService.updateGalleryItem({
        id: selectedItem.id,
        ...formData
      });
      toast.success('Gallery item updated successfully');
      setIsEditDrawerOpen(false);
      resetForm();
      loadItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      await galleryService.deleteGalleryItem(itemToDelete);
      toast.success('Gallery item deleted successfully');
      setItemToDelete(null);
      loadItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (item: GalleryItem) => {
    try {
      const newStatus = item.is_active === 1 ? 0 : 1;
      await galleryService.updateGalleryItemStatus(item.id, newStatus);
      toast.success('Status updated');
      loadItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const openEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      alt_text: item.alt_text,
      category: item.category,
      sort_order: item.sort_order,
      is_active: item.is_active
    });
    setPreviewImage(imageOriginal(item.image_url));
    setIsEditDrawerOpen(true);
  };

  const columns = [
    {
      header: 'Image',
      cell: (item: GalleryItem) => (
        <div 
          className="w-20 h-12 rounded overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setPreviewImageUrl(imageOriginal(item.image_url))}
        >
          <img 
            src={imageThumb(item.image_url)} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )
    },
    {
      header: 'Title',
      cell: (item: GalleryItem) => (
        <div className="max-w-xs">
          <div className="font-bold text-sm leading-tight" title={item.title}>{item.title}</div>
          <div className="text-xs text-text-muted mt-1 leading-tight">{item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : ''}</div>
        </div>
      )
    },
    { 
      header: 'Category', 
      cell: (item: GalleryItem) => (
        <span className="px-2.5 py-1 bg-surface-muted text-text-secondary border border-border rounded-lg text-xs font-bold whitespace-nowrap">
          {item.category}
        </span>
      )
    },
    { 
      header: 'Order', 
      accessorKey: 'sort_order' as keyof GalleryItem,
      className: 'text-center w-16'
    },
    { 
      header: 'Status', 
      cell: (item: GalleryItem) => (
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
      cell: (item: GalleryItem) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEdit(item)}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit asset"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setItemToDelete(item.id)}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete asset"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-[13px] font-bold text-text mb-2">Gallery Image</label>
        <ImageUploader 
          value={previewImage} 
          onChange={(base64) => setPreviewImage(base64)} 
          onUpload={handleImageUpload}
          isUploading={isUploading}
          onRemove={() => { setPreviewImage(''); setFormData({ ...formData, image_url: '' }); }}
        />
      </div>
      
      <FormField label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter asset title" required />
      
      <FormField label="Description" as="textarea" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter description" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category" as="select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
          {CATEGORIES.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FormField>
        <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 1})} placeholder="1" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Alt Text" value={formData.alt_text} onChange={e => setFormData({...formData, alt_text: e.target.value})} placeholder="SEO friendly text" />
        <FormField label="Status" as="select" value={formData.is_active} onChange={e => setFormData({...formData, is_active: parseInt(e.target.value)})} required>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </FormField>
      </div>
    </div>
  );

  return (
    <PageContainer
      title="Gallery"
      description="Manage visual assets for the Banaras Yog Mandir website."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Gallery' }
      ]}
      action={
        <Button onClick={() => setIsCreateDrawerOpen(true)} className="gap-2">
          <ImagePlus size={18} /> Add Media
        </Button>
      }
    >
      <div className="space-y-6">
        <DataTable
          data={items}
          columns={columns}
          keyExtractor={(item) => item.id.toString()}
          loading={isLoading}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />

        {/* Create Drawer */}
        <Drawer isOpen={isCreateDrawerOpen} onClose={() => { setIsCreateDrawerOpen(false); resetForm(); }} title="Add New Media">
          <form onSubmit={handleCreateSubmit} className="flex flex-col pb-6">
            {renderFormFields()}
            <div className="pt-6 flex gap-3 mt-8">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreateDrawerOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting || isUploading}>Add Media</Button>
            </div>
          </form>
        </Drawer>

        {/* Edit Drawer */}
        <Drawer isOpen={isEditDrawerOpen} onClose={() => { setIsEditDrawerOpen(false); resetForm(); }} title="Edit Media Details">
          <form onSubmit={handleEditSubmit} className="flex flex-col pb-6">
            {renderFormFields()}
            <div className="pt-6 flex gap-3 mt-8">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditDrawerOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting || isUploading}>Save Changes</Button>
            </div>
          </form>
        </Drawer>

        {/* Delete Confirmation */}
        <Modal 
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          title="Delete Media Asset"
          description="Are you sure you want to delete this image? It will be removed from the gallery and the public website."
        >
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setItemToDelete(null)}>Cancel</Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>

        {/* Image Preview Modal */}
        <ImagePreviewModal 
          selectedImg={previewImageUrl} 
          onClose={() => setPreviewImageUrl(null)} 
        />
      </div>
    </PageContainer>
  );
}
