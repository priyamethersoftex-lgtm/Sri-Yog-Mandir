import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { roomService } from '../../services/roomService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/data/LoadingState';
import { PageContainer } from '../../components/ui/PageContainer';
import { imageOriginal } from '../../utils/ImgUrl';
import { Edit, Users, BedDouble, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await roomService.getRooms({ limit: 100 });
        setRooms(data.list);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load rooms');
        console.error('Failed to load rooms:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'OCCUPIED': return 'primary';
      case 'RESERVED': return 'warning';
      case 'MAINTENANCE': return 'danger';
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
      action={
        <Button onClick={() => navigate('/rooms/new')} className="flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Room
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden flex flex-col group hover:border-primary hover:shadow-xl transition-all duration-300">
            {/* Image Header Area */}
            <div className="relative h-48 w-full bg-surface-muted overflow-hidden shrink-0">
              {room.primary_image ? (
                <img 
                  src={imageOriginal(room.primary_image)} 
                  alt={room.name_en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary/30">
                  <BedDouble size={48} />
                </div>
              )}
              
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <Badge variant={getStatusColor(room.status) as any} className="shadow-lg backdrop-blur-sm bg-surface/90">
                  {room.status}
                </Badge>
                {room.is_active === 0 && (
                  <Badge variant="danger" className="shadow-lg backdrop-blur-sm bg-surface/90">
                    INACTIVE
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                  Room {room.room_number}
                </Badge>
              </div>
            </div>

            {/* Content Area */}
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-text leading-tight">{room.name_en}</h3>
                  <p className="text-[13px] text-text-secondary font-medium mt-1">{room.room_type || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{room.currency} {room.base_price?.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-text-secondary uppercase tracking-wider">Per Night</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mt-auto mb-4">
                <div>
                  <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Capacity</p>
                  <p className="text-[13px] font-medium text-text flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    {room.capacity_adults} Adults, {room.capacity_children} Child
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Floor</p>
                  <p className="text-[13px] font-medium text-text truncate">
                    {room.floor || <span className="text-text-secondary/50">Not specified</span>}
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full gap-2 border-border hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                onClick={() => navigate(`/rooms/${room.id}/edit`)}
              >
                <Edit size={16} /> Edit Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {rooms.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border mt-4">
          <BedDouble className="mx-auto text-text-muted mb-3" size={48} />
          <h3 className="text-lg font-bold text-text">No Rooms Found</h3>
          <p className="text-text-secondary">Get started by adding a new room to your property.</p>
          <Button onClick={() => navigate('/rooms/new')} className="mt-4 gap-2">
            <Plus size={16} /> Add First Room
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
