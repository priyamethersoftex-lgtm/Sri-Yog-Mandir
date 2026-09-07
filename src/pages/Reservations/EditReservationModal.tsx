import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Reservation, Room } from '../../types';
import { reservationService } from '../../services/reservationService';
import { roomService } from '../../services/roomService';
import { toast } from 'sonner';

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onSuccess: () => void;
}

export function EditReservationModal({ isOpen, onClose, reservation, onSuccess }: EditReservationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [formData, setFormData] = useState({
    room_id: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in: '',
    check_out: '',
    number_of_adults: 1,
    number_of_children: 0,
    number_of_rooms: 1,
    special_request: ''
  });

  useEffect(() => {
    // Fetch rooms to populate the room selector
    const fetchRooms = async () => {
      try {
        const res = await roomService.getRooms({ limit: 100 });
        setRooms(res.list);
      } catch (error) {
        console.error("Failed to load rooms", error);
      }
    };
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (reservation) {
      setFormData({
        room_id: reservation.room_id || 0,
        customer_name: reservation.customer_name || '',
        customer_email: reservation.customer_email || '',
        customer_phone: reservation.customer_phone || '',
        check_in: reservation.check_in.split('T')[0] || '', // Format to YYYY-MM-DD if needed
        check_out: reservation.check_out.split('T')[0] || '',
        number_of_adults: reservation.number_of_adults || 1,
        number_of_children: reservation.number_of_children || 0,
        number_of_rooms: reservation.number_of_rooms || 1,
        special_request: reservation.special_request || ''
      });
    }
  }, [reservation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;
    setIsLoading(true);
    try {
      await reservationService.updateReservation({
        id: reservation.id,
        ...formData
      });
      toast.success('Reservation updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reservation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Reservation: ${reservation.reservation_number}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Customer Name</label>
            <Input 
              name="customer_name" 
              value={formData.customer_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Phone Number</label>
            <Input 
              name="customer_phone" 
              value={formData.customer_phone} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Email Address</label>
          <Input 
            name="customer_email" 
            type="email"
            value={formData.customer_email} 
            onChange={handleChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Check-in Date</label>
            <Input 
              name="check_in" 
              type="date"
              value={formData.check_in} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Check-out Date</label>
            <Input 
              name="check_out" 
              type="date"
              value={formData.check_out} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Room</label>
          <select 
            name="room_id"
            value={formData.room_id} 
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value={0} disabled>Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name_en} - ₹{room.base_price}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Rooms</label>
            <Input 
              name="number_of_rooms" 
              type="number"
              min={1}
              value={formData.number_of_rooms} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Adults</label>
            <Input 
              name="number_of_adults" 
              type="number"
              min={1}
              value={formData.number_of_adults} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">Children</label>
            <Input 
              name="number_of_children" 
              type="number"
              min={0}
              value={formData.number_of_children} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Special Request</label>
          <textarea 
            name="special_request"
            value={formData.special_request}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="Any special requests..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
