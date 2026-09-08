import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Reservation } from '../../types';
import { reservationService } from '../../services/reservationService';
import { toast } from 'sonner';

interface StatusReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onSuccess: () => void;
}

export function StatusReservationModal({ isOpen, onClose, reservation, onSuccess }: StatusReservationModalProps) {
  const [status, setStatus] = useState('PENDING');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reservation) {
      setStatus(reservation.reservation_status);
      const pStatus = reservation.payment_status 
        ? reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1).toLowerCase()
        : 'Unpaid';
      setPaymentStatus(pStatus);
    }
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;
    setIsLoading(true);
    try {
      if (status !== reservation.reservation_status) {
        await reservationService.updateReservationStatus(reservation.id, status);
      }
      if (paymentStatus !== reservation.payment_status) {
        await reservationService.updatePaymentStatus(reservation.id, paymentStatus);
      }
      toast.success('Reservation updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'COMPLETED'];

  if (!reservation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status: ${reservation.reservation_number}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide">
            Reservation Status
          </label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-text-secondary mb-1 uppercase tracking-wide mt-4">
            Payment Status
          </label>
          <select 
            value={paymentStatus} 
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Refund">Refund</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Status</Button>
        </div>
      </form>
    </Modal>
  );
}
