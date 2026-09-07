import React from 'react';
import { Badge } from './Badge';

// Matches RoomStatus and BookingStatus from types
type StatusType = 
  | 'Available' | 'Reserved' | 'Occupied' | 'Maintenance'
  | 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled'
  | 'Active' | 'Inactive' | 'active' | 'inactive'
  | 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'; // New API Reservation statuses
  
// Optional: also include PaymentStatus if passed directly
export type ExtendedStatusType = StatusType | 'PARTIAL' | 'COMPLETED' | 'REFUNDED';

interface StatusBadgeProps {
  status: ExtendedStatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' = 'default';

  switch (status) {
    case 'Available':
    case 'Confirmed':
    case 'CONFIRMED':
    case 'Active':
    case 'active':
    case 'COMPLETED':
      variant = 'success';
      break;
    case 'Occupied':
    case 'Checked In':
    case 'CHECKED_IN':
      variant = 'primary';
      break;
    case 'Pending':
    case 'PENDING':
    case 'Reserved':
    case 'Checked Out':
    case 'CHECKED_OUT':
    case 'PARTIAL':
      variant = 'warning';
      break;
    case 'Maintenance':
    case 'Cancelled':
    case 'CANCELLED':
    case 'Inactive':
    case 'inactive':
    case 'REFUNDED':
      variant = 'danger';
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
