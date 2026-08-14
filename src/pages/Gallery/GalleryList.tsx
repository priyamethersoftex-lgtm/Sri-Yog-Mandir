import React, { useEffect, useState, useMemo } from 'react';
import { GalleryItem } from '../../types';
import { galleryService } from '../../services/galleryService';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/data/LoadingState';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/forms/FormField';
import { ImageUploader } from '../../components/forms/ImageUploader';
import { PageContainer } from '../../components/ui/PageContainer';
import { toast } from 'sonner';
import { ImagePlus, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORIES = ['All', 'Yoga & Meditation', 'Rooms & Suites', 'Dining & Sattvic', 'Spiritual Tours', 'Temple Tour', 'Aarti & Events'];

export default function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<Partial<GalleryItem>>({
    category: 'Rooms & Suites',
    isPublished: true,
  });

  const loadItems = async () => {
    try {
      const data = await galleryService.getGalleryItems();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter(i => i.category === activeTab);
  }, [items, activeTab]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await galleryService.deleteGalleryItem(itemToDelete);
      toast.success('Image deleted');
      await loadItems();
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.url) {
      toast.error('Please select an image');
      return;
    }
    
    try {
      await galleryService.addGalleryItem(uploadData as any);
      toast.success('Image added successfully');
      setIsUploadModalOpen(false);
      setUploadData({ category: 'Rooms & Suites', isPublished: true });
      await loadItems();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageContainer
      title="Gallery"
      description="Manage visual assets for the Banaras Yog Mandir website and PMS."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Gallery' }
      ]}
      action={
        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
          <ImagePlus size={18} /> Upload Media
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-5 py-2 text-[13px] font-semibold rounded-button transition-all duration-200 whitespace-nowrap",
                activeTab === cat 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-surface text-text-secondary hover:text-text hover:bg-surface-muted border border-border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-surface border border-border border-dashed rounded-2xl text-text-secondary/60">
            <ImagePlus size={48} className="mb-4 opacity-30" />
            <p className="text-[15px] font-medium">No media found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden group hover:border-primary hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square bg-surface-muted/50 overflow-hidden">
                  {item.url ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary/40">No Image</div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <button 
                      onClick={() => setItemToDelete(item.id)}
                      className="absolute top-3 right-3 p-2 bg-semantic-danger/90 hover:bg-semantic-danger text-white rounded-lg backdrop-blur-sm transition-colors shadow-sm"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h3 className="font-bold text-white text-[14px] truncate leading-tight">{item.title}</h3>
                    <p className="text-[11px] text-white/70 truncate mt-0.5 font-medium">{item.category}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-text">Upload Media</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="p-4 bg-surface-muted/30 border border-border border-dashed rounded-xl">
              <ImageUploader 
                value={uploadData.url} 
                onChange={(url) => setUploadData({ ...uploadData, url })}
                onRemove={() => setUploadData({ ...uploadData, url: undefined })}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <FormField 
                label="Asset Title" 
                value={uploadData.title || ''} 
                onChange={e => setUploadData({ ...uploadData, title: e.target.value })} 
                required 
                placeholder="e.g. Ganga View Suite Balcony"
              />
              <FormField 
                label="Category" 
                as="select"
                value={uploadData.category}
                onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
                options={CATEGORIES.filter(c => c !== 'All').map(c => ({ label: c, value: c }))}
              />
              <FormField 
                label="Optional Caption" 
                value={uploadData.caption || ''} 
                onChange={e => setUploadData({ ...uploadData, caption: e.target.value })} 
                placeholder="Short description for SEO or alt text"
              />
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
              <Button type="submit">Upload Asset</Button>
            </div>
            </form>
          </div>
        </Modal>

        <ConfirmationDialog 
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Media Asset"
          message="Are you sure you want to delete this image? It will be removed from the gallery and the public website."
          isDestructive
          confirmText="Yes, delete asset"
        />
      </div>
    </PageContainer>
  );
}
