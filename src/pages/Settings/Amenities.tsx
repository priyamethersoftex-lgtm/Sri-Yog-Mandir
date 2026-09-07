import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { FormField } from '../../components/forms/FormField';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { amenityService, Amenity } from '../../services/amenityService';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Amenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    sort_order: 1,
    is_active: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const data = await amenityService.getAmenities();
      setAmenities(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', icon: '', sort_order: 1, is_active: 1 });
    setSelectedAmenity(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await amenityService.createAmenity({
        name: formData.name,
        icon: formData.icon,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active
      });
      toast.success('Amenity created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchAmenities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create amenity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmenity) return;
    setIsSubmitting(true);
    try {
      await amenityService.updateAmenity({
        id: selectedAmenity.id,
        name: formData.name,
        icon: formData.icon,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active
      });
      toast.success('Amenity updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchAmenities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update amenity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAmenity) return;
    setIsSubmitting(true);
    try {
      await amenityService.deleteAmenity(selectedAmenity.id);
      toast.success('Amenity deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchAmenities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete amenity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (amenity: Amenity) => {
    try {
      const newStatus = amenity.is_active === 1 ? 0 : 1;
      await amenityService.updateAmenity({
        id: amenity.id,
        name: amenity.name,
        icon: amenity.icon,
        sort_order: amenity.sort_order,
        is_active: newStatus
      });
      toast.success('Status updated');
      fetchAmenities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Name',
      cell: (item: Amenity) => (
        <div className="font-bold text-sm">{item.name}</div>
      )
    },
    { header: 'Icon', accessorKey: 'icon' as keyof Amenity },
    { header: 'Sort Order', accessorKey: 'sort_order' as keyof Amenity },
    { 
      header: 'Status', 
      cell: (item: Amenity) => (
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
      cell: (item: Amenity) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedAmenity(item);
              setFormData({ 
                name: item.name, 
                icon: item.icon, 
                sort_order: item.sort_order, 
                is_active: item.is_active 
              });
              setIsEditModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit amenity"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedAmenity(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete amenity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Amenities Management"
      description="Manage amenities to display across the property."
      action={
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Amenity
        </Button>
      }
    >
      <DataTable
        data={amenities}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        page={1}
        pageSize={Math.max(amenities.length, 10)}
        totalRecords={amenities.length}
        onPageChange={() => {}}
      />

      {/* Create Drawer */}
      <Drawer isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); resetForm(); }} title="Add New Amenity">
        <form onSubmit={handleCreateSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter amenity name" required />
          <FormField label="Icon" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="Enter icon name (e.g. wifi)" required />
          <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} required />
          <FormField label="Status" as="select" value={formData.is_active} onChange={e => setFormData({...formData, is_active: Number(e.target.value)})} required>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </FormField>
          
          <div className="pt-5 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create Amenity</Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Amenity">
        <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter amenity name" required />
          <FormField label="Icon" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="Enter icon name" required />
          <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} required />
          <FormField label="Status" as="select" value={formData.is_active} onChange={e => setFormData({...formData, is_active: Number(e.target.value)})} required>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </FormField>
          
          <div className="pt-5 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save Changes</Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${selectedAmenity?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        isDestructive
      />
    </PageContainer>
  );
}
