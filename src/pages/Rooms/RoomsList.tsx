import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room, RoomStatus } from '../../types';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/data/LoadingState';
import { PageContainer } from '../../components/ui/PageContainer';
import { Edit, Users, BedDouble } from 'lucide-react';

interface RoomWithStatus extends Room {
  currentStatus: RoomStatus;
  guestName?: string;
}

export default function RoomsList() {
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await roomService.getRooms();
        const bookings = await reservationService.getBookings();
        
        const withStatus = await Promise.all(
          data.map(async (room) => {
            const status = await roomService.getRoomStatus(room.id);
            let guestName;
            
            if (status === 'Occupied' || status === 'Reserved') {
              const booking = bookings.find(b => 
                b.stay.roomId === room.id && 
                (b.status === 'Checked In' || b.status === 'Confirmed')
              );
              if (booking) guestName = booking.guest.fullName;
            }

            return {
              ...room,
              currentStatus: status,
              guestName
            };
          })
        );
        setRooms(withStatus);
      } catch (error) {
        console.error('Failed to load rooms:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'teal';
      case 'Occupied': return 'brand';
      case 'Reserved': return 'warning';
      case 'Maintenance': return 'coral';
      default: return 'default';
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageContainer
      title="Rooms"
      description={`Manage the ${rooms.length} fixed property rooms.`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Rooms' }
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden flex flex-col group hover:border-brand-500 hover:shadow-xl transition-all duration-300">
            {/* Image Header Area */}
            <div className="relative h-48 w-full bg-muted/50 overflow-hidden shrink-0">
              {room.mainImage ? (
                <img 
                  src={room.mainImage} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary/30">
                  <BedDouble size={48} />
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <Badge variant={getStatusColor(room.currentStatus) as any} className="shadow-lg backdrop-blur-sm bg-white/90">
                  {room.currentStatus}
                </Badge>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                  {room.id}
                </Badge>
              </div>
            </div>

            {/* Content Area */}
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary">{room.name}</h3>
                  <p className="text-[13px] text-secondary font-medium mt-1">{room.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-600">₹{room.pricePerNight.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-secondary uppercase tracking-wider">Per Night</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-theme/60 mt-auto mb-4">
                <div>
                  <p className="text-[11px] text-secondary uppercase tracking-wider mb-1">Capacity</p>
                  <p className="text-[13px] font-medium text-primary flex items-center gap-1.5">
                    <Users size={14} className="text-brand-500" />
                    {room.capacity.adults} Adults, {room.capacity.children} Child
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-secondary uppercase tracking-wider mb-1">Current Guest</p>
                  <p className="text-[13px] font-medium text-primary truncate">
                    {room.guestName ? room.guestName : <span className="text-secondary/50">None</span>}
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full gap-2 border-theme hover:bg-brand-50 hover:text-brand-600 hover:border-brand-500 transition-colors"
                onClick={() => navigate(`/rooms/${room.id}/edit`)}
              >
                <Edit size={16} /> Edit Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
