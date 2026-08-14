import React, { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '../../services/dashboardService';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';
import { Room, Booking } from '../../types';
import { LoadingState } from '../../components/data/LoadingState';
import { Calendar as CalendarIcon, CheckCircle, Clock, Users, ArrowDownToLine, ArrowUpFromLine, Calendar, BedDouble, Wrench, Activity } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, roomsData, bookingsData] = await Promise.all([
          dashboardService.getStats(),
          roomService.getRooms(),
          reservationService.getBookings()
        ]);
        setStats(statsData);
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !stats) return <LoadingState />;

  const statCards = [
    { 
      title: 'AVAILABLE TODAY', 
      value: stats.availableToday, 
      subtext: 'Ready for check-in',
      dot: 'bg-emerald-500',
      icon: CheckCircle
    },
    { 
      title: 'OCCUPIED TODAY', 
      value: stats.occupiedToday, 
      subtext: 'Guests checked in',
      dot: 'bg-brand-500',
      icon: BedDouble
    },
    { 
      title: "TODAY'S ARRIVALS", 
      value: stats.arrivalsToday, 
      subtext: 'Expected today',
      dot: 'bg-blue-500',
      icon: ArrowDownToLine
    },
    { 
      title: "TODAY'S DEPARTURES", 
      value: stats.departuresToday, 
      subtext: 'Leaving today',
      dot: 'bg-orange-500',
      icon: ArrowUpFromLine
    },
  ];

  return (
    <div className="space-y-6 pb-10 animate-fade-in max-w-7xl mx-auto px-1 sm:px-2">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-card border border-border-default rounded-[14px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center">
            <Activity size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Daily Dashboard</h1>
            <p className="text-[13px] text-secondary font-medium">Real-time performance audit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-default hover:bg-muted rounded-lg text-sm font-semibold text-secondary transition-colors">
            <CalendarIcon size={16} />
            {format(new Date(), 'MM/dd/yyyy')}
          </button>
          <button className="bg-semantic-success hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
            SYNC DATA
          </button>
        </div>
      </div>

      {/* KPI Primary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-card border border-border-default rounded-[14px] p-5 relative overflow-hidden shadow-card group hover:border-brand-500/30 transition-colors">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">
                {stat.title}
              </p>
              <p className="text-[32px] font-extrabold text-primary leading-tight tracking-tight mb-3">
                {stat.value}
              </p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stat.dot}`}></span>
                <span className="text-[12px] font-semibold text-secondary">
                  {stat.subtext}
                </span>
              </div>
            </div>
            
            {/* Background Icon Watermark */}
            <div className="absolute right-0 bottom-0 p-4 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <stat.icon size={100} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Verification / Secondary Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        <div className="lg:col-span-2 bg-white border border-border-default rounded-[14px] p-6 shadow-card">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
               <Clock size={16} strokeWidth={2.5} />
             </div>
             <div>
               <h2 className="text-[15px] font-bold text-primary uppercase tracking-wide">Hourly Velocity</h2>
               <p className="text-[12px] text-secondary">Revenue & order trends throughout the day</p>
             </div>
           </div>
           
           <div className="h-64 flex items-center justify-center border-t border-dashed border-border-default/60">
             <p className="text-secondary/50 font-medium text-sm">Chart visualization area</p>
           </div>
        </div>

        <div className="bg-white border border-border-default rounded-[14px] p-6 shadow-card flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-primary uppercase tracking-wide">Today's Status</h2>
              <p className="text-[12px] text-secondary">Check-ins & Pending</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Checked In</p>
              <p className="text-2xl font-extrabold text-blue-700">{stats.checkedInGuests}</p>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Confirmed</p>
              <p className="text-2xl font-extrabold text-emerald-700">{stats.confirmedReservations}</p>
            </div>
          </div>
          
          <div className="mt-auto">
            <button className="w-full py-3 bg-muted hover:bg-border-default text-primary font-bold text-[13px] rounded-xl transition-colors">
              MANAGE RESERVATIONS
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
