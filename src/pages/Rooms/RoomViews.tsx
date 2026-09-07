import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { FormField } from '../../components/forms/FormField';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { roomViewService, RoomView } from '../../services/roomViewService';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RoomViews() {
  const [roomViews, setRoomViews] = useState<RoomView[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [selectedRoomView, setSelectedRoomView] = useState<RoomView | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoomViews();
  }, []);

  const fetchRoomViews = async () => {
    setLoading(true);
    try {
      const data = await roomViewService.getRoomViews();
      setRoomViews(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load room views');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', sort_order: 1 });
    setSelectedRoomView(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await roomViewService.createRoomView({
        name: formData.name,
        description: formData.description,
        sort_order: Number(formData.sort_order)
      });
      toast.success('Room view created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchRoomViews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room view');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomView) return;
    setIsSubmitting(true);
    try {
      await roomViewService.updateRoomView({
        id: selectedRoomView.id,
        name: formData.name,
        description: formData.description,
        sort_order: Number(formData.sort_order)
      });
      toast.success('Room view updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchRoomViews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update room view');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoomView) return;
    setIsSubmitting(true);
    try {
      await roomViewService.deleteRoomView(selectedRoomView.id);
      toast.success('Room view deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchRoomViews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room view');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      cell: (item: RoomView) => (
        <div className="font-bold text-sm">{item.name}</div>
      )
    },
    { 
      header: 'Description', 
      cell: (item: RoomView) => (
        <div className="text-sm text-text-muted line-clamp-1 max-w-[300px]" title={item.description}>
          {item.description}
        </div>
      ) 
    },
    { header: 'Sort Order', accessorKey: 'sort_order' as keyof RoomView },
    { 
      header: 'Status', 
      cell: (item: RoomView) => (
        <StatusBadge status={item.is_active === 1 ? 'active' : 'inactive'} />
      ) 
    },
    {
      header: 'Actions',
      cell: (item: RoomView) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedRoomView(item);
              setFormData({ 
                name: item.name, 
                description: item.description, 
                sort_order: item.sort_order 
              });
              setIsEditModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit room view"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedRoomView(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete room view"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Room Views"
      description="Manage the views available from the rooms."
      action={
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Room View
        </Button>
      }
    >
      <DataTable
        data={roomViews}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        page={1}
        pageSize={Math.max(roomViews.length, 10)}
        totalRecords={roomViews.length}
        onPageChange={() => {}}
      />

      {/* Create Drawer */}
      <Drawer isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); resetForm(); }} title="Add New Room View">
        <form onSubmit={handleCreateSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter room view name" required />
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
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create View</Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Room View">
        <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter room view name" required />
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
        title="Delete Room View"
        message={`Are you sure you want to delete "${selectedRoomView?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        isDestructive
      />
    </PageContainer>
  );
}
