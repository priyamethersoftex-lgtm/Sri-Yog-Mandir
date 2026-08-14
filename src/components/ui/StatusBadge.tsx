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
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'brand' | 'teal' | 'plum' | 'coral' = 'default';

  switch (status) {
    case 'Available':
    case 'Confirmed':
      variant = 'teal';
      break;
    case 'Occupied':
    case 'Checked In':
      variant = 'brand';
      break;
    case 'Pending':
    case 'Reserved':
    case 'Checked Out':
      variant = 'warning';
      break;
    case 'Maintenance':
    case 'Cancelled':
      variant = 'coral';
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
