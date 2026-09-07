import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ReservationGuest } from '../../types';
import { guestService } from '../../services/guestService';
import { toast } from 'sonner';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  guest: ReservationGuest | null; // If null, create mode. If present, edit mode.
  onSuccess: () => void;
}

export function GuestFormModal({ isOpen, onClose, reservationId, guest, onSuccess }: GuestFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    document_type: 'Aadhaar',
    document_number: '',
    is_primary_guest: false
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        first_name: guest.first_name || '',
        last_name: guest.last_name || '',
        email: guest.email || '',
        phone: guest.phone || '',
        date_of_birth: guest.date_of_birth ? guest.date_of_birth.split('T')[0] : '',
        gender: guest.gender || 'Male',
        document_type: guest.document_type || 'Aadhaar',
        document_number: guest.document_number || '',
        is_primary_guest: !!guest.is_primary_guest
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'Male',
        document_type: 'Aadhaar',
        document_number: '',
        is_primary_guest: false
      });
    }
  }, [guest, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (guest) {
        await guestService.updateGuest({
          id: guest.id,
          ...formData,
          is_primary_guest: formData.is_primary_guest ? 1 : 0
        });
        toast.success('Guest updated successfully');
      } else {
        await guestService.createGuest({
          reservation_id: reservationId,
          ...formData,
          is_primary_guest: formData.is_primary_guest ? 1 : 0
        });
        toast.success('Guest added successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save guest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={guest ? "Edit Guest" : "Add New Guest"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">First Name</label>
            <Input name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Last Name</label>
            <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Email</label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Date of Birth</label>
            <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Document Type</label>
            <select 
              name="document_type" 
              value={formData.document_type} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Document Number</label>
            <Input name="document_number" value={formData.document_number} onChange={handleChange} required />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            id="is_primary_guest" 
            name="is_primary_guest"
            checked={formData.is_primary_guest} 
            onChange={handleChange} 
            className="w-5 h-5 accent-primary" 
          />
          <label htmlFor="is_primary_guest" className="text-sm font-medium text-text">This is the Primary Guest</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Guest</Button>
        </div>
      </form>
    </Modal>
  );
}
