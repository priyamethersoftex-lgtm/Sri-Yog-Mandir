import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { FormField } from '../../components/forms/FormField';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { bedTypeService, BedType } from '../../services/bedTypeService';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function BedTypes() {
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [selectedBedType, setSelectedBedType] = useState<BedType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBedTypes();
  }, []);

  const fetchBedTypes = async () => {
    setLoading(true);
    try {
      const data = await bedTypeService.getBedTypes();
      setBedTypes(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bed types');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', sort_order: 1 });
    setSelectedBedType(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await bedTypeService.createBedType({
        name: formData.name,
        description: formData.description,
        sort_order: Number(formData.sort_order)
      });
      toast.success('Bed type created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchBedTypes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create bed type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedType) return;
    setIsSubmitting(true);
    try {
      await bedTypeService.updateBedType({
        id: selectedBedType.id,
        name: formData.name,
        description: formData.description,
        sort_order: Number(formData.sort_order)
      });
      toast.success('Bed type updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchBedTypes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update bed type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBedType) return;
    setIsSubmitting(true);
    try {
      await bedTypeService.deleteBedType(selectedBedType.id);
      toast.success('Bed type deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchBedTypes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete bed type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      cell: (item: BedType) => (
        <div className="font-bold text-sm">{item.name}</div>
      )
    },
    { 
      header: 'Description', 
      cell: (item: BedType) => (
        <div className="text-sm text-text-muted line-clamp-1 max-w-[300px]" title={item.description}>
          {item.description}
        </div>
      ) 
    },
    { header: 'Sort Order', accessorKey: 'sort_order' as keyof BedType },
    { 
      header: 'Status', 
      cell: (item: BedType) => (
        <StatusBadge status={item.is_active === 1 ? 'active' : 'inactive'} />
      ) 
    },
    {
      header: 'Actions',
      cell: (item: BedType) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedBedType(item);
              setFormData({ 
                name: item.name, 
                description: item.description, 
                sort_order: item.sort_order 
              });
              setIsEditModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit bed type"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedBedType(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete bed type"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Bed Types"
      description="Manage the types of beds available in the rooms."
      action={
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Bed Type
        </Button>
      }
    >
      <DataTable
        data={bedTypes}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        page={1}
        pageSize={Math.max(bedTypes.length, 10)}
        totalRecords={bedTypes.length}
        onPageChange={() => {}}
      />

      {/* Create Drawer */}
      <Drawer isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); resetForm(); }} title="Add New Bed Type">
        <form onSubmit={handleCreateSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter bed type name" required />
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-text-muted">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y min-h-[100px]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Enter description"
              required
            />
          </div>
          <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} required />
          
          <div className="pt-5 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create Bed Type</Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Bed Type">
        <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter bed type name" required />
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-text-muted">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y min-h-[100px]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Enter description"
              required
            />
          </div>
          <FormField label="Sort Order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} required />
          
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
        title="Delete Bed Type"
        message={`Are you sure you want to delete "${selectedBedType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        isDestructive
      />
    </PageContainer>
  );
}
