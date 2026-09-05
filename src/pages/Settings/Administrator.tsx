import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { FormField } from '../../components/forms/FormField';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { userService, User } from '../../services/userService';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Administrator() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SUPER_ADMIN'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, pageSize);
      setUsers(response.list);
      setTotalRecords(response.pagination.total);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', role: 'SUPER_ADMIN' });
    setSelectedUser(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userService.createUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await userService.updateUser(selectedUser.id, {
        name: formData.name,
        phone: Number(formData.phone), // The API in the example used a number
        role: formData.role
      });
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (user: User) => {
    try {
      const newStatus = user.is_active === 1 ? 0 : 1;
      await userService.updateUserStatus(user.id, newStatus);
      toast.success('Status updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Name',
      cell: (item: User) => (
        <div>
          <div className="font-bold text-sm">{item.name}</div>
          <div className="text-xs text-text-muted mt-0.5">{item.email}</div>
        </div>
      )
    },
    { header: 'Phone', accessorKey: 'phone' as keyof User },
    { 
      header: 'Role', 
      cell: (item: User) => (
        <span className="px-2.5 py-1 bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20 rounded-lg text-xs font-bold">
          {item.role.replace(/_/g, ' ')}
        </span>
      ) 
    },
    { 
      header: 'Status', 
      cell: (item: User) => (
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
      cell: (item: User) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedUser(item);
              setFormData({ ...formData, name: item.name, phone: String(item.phone), role: item.role });
              setIsEditModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-lg transition-all"
            title="Edit user"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedUser(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-text-muted hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-all"
            title="Delete user"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Administrator Management"
      description="Manage administrative accounts, roles, and access."
      action={
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add User
        </Button>
      }
    >
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(item) => item.id}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
      />

      {/* Create Drawer */}
      <Drawer isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); resetForm(); }} title="Add New Administrator">
        <form onSubmit={handleCreateSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter full name" required />
          <FormField label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Enter email address" required />
          <FormField label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Enter phone number" required />
          <FormField label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter a secure password" required />
          <FormField label="Role" as="select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="USER">User</option>
          </FormField>
          
          <div className="pt-5 flex gap-3 mt-8">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create User</Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Administrator">
        <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4 pb-6">
          <FormField label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter full name" required />
          <FormField label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Enter phone number" required />
          <FormField label="Role" as="select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="USER">User</option>
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
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        isDestructive
      />
    </PageContainer>
  );
}
