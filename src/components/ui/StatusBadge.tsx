import React from 'react';
import { Badge } from './Badge';

// Matches RoomStatus and BookingStatus from types
type StatusType = 
  | 'Available' | 'Reserved' | 'Occupied' | 'Maintenance'
  | 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' = 'default';

  switch (status) {
    case 'Available':
    case 'Confirmed':
      variant = 'success';
      break;
    case 'Occupied':
    case 'Checked In':
      variant = 'primary';
      break;
    case 'Pending':
    case 'Reserved':
    case 'Checked Out':
      variant = 'warning';
      break;
    case 'Maintenance':
    case 'Cancelled':
      variant = 'danger';
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
