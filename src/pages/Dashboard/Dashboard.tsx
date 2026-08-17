import React from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IndianRupee, BedDouble, CalendarDays, Key, TrendingUp, Users, ArrowDownToLine, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { dashboardData } from './dashboardData';

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, iconBgClass }: any) => (
  <Card padding="none" className="relative p-5 transition-all duration-300 group overflow-hidden bg-surface border border-border shadow-sm rounded-2xl h-[120px]">
    <Icon size={110} strokeWidth={0.5} className={`absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 pointer-events-none ${colorClass}`} />
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-auto">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-80">
          {title}
        </p>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-2xl font-black text-text tracking-tighter leading-none">
            {value}
          </h3>
        </div>
        {subtext && (
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${iconBgClass}`} />
            <p className="text-[11px] text-text-muted font-bold tracking-tight opacity-80 leading-none">
              {subtext}
            </p>
          </div>
        )}
      </div>
    </div>
  </Card>
);

const SectionHead = ({ icon: Icon, accentClass, iconBgClass, title, sub }: any) => (
  <div className="flex items-center justify-between mb-4 sm:mb-5">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${iconBgClass} ${accentClass}`}>
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="text-[13px] font-extrabold text-text uppercase tracking-wide">{title}</h4>
        {sub && <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  </div>
);

// Custom SVG Chart component matching MCZEN's aesthetic
const TrendChart = ({ data }: any) => {
  const maxRev = Math.max(...data.map((d: any) => d.revenue), 1);
  const maxBookings = Math.max(...data.map((d: any) => d.bookings), 1);
  
  return (
    <div className="h-[300px] w-full flex flex-col relative mt-4">
      {/* Chart area */}
      <div className="flex-1 flex items-end justify-between relative pt-6 pb-2">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-px border-t border-dashed border-border" />
          ))}
        </div>
        
        {/* Bars and Area simulation */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <path 
            d={`M 0,100 ${data.map((d: any, i: number) => `L ${(i / (data.length - 1)) * 100},${100 - (d.revenue / maxRev) * 100}`).join(' ')} L 100,100 Z`}
            fill="url(#gradRev)" 
            vectorEffect="non-scaling-stroke"
            transform="scale(1, 0.9) translate(0, 10)"
          />
          <path 
            d={`M 0,100 ${data.map((d: any, i: number) => `L ${(i / (data.length - 1)) * 100},${100 - (d.revenue / maxRev) * 100}`).join(' ')}`}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            transform="scale(1, 0.9) translate(0, 10)"
          />
        </svg>

        {data.map((d: any, i: number) => {
          const barHeight = (d.bookings / maxBookings) * 80; // Scale bookings relative to chart height
          return (
            <div key={i} className="relative z-10 flex flex-col items-center justify-end w-full h-full group">
              <div 
                className="w-1.5 md:w-2 bg-brand-dark/90 rounded-t-sm"
                style={{ height: `${barHeight}%` }}
              />
            </div>
          )
        })}
      </div>
      
      {/* X Axis Labels */}
      <div className="flex justify-between items-center mt-2 px-2">
        {data.map((d: any, i: number) => (
          <span key={i} className="text-[10px] font-semibold text-text-muted">{d.label}</span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[11px] font-bold">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-text-secondary">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-dark" />
          <span className="text-text-secondary">Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { 
    revenue, occupancy, todaysBookings, availableRooms,
    roomStatus, movements, reservationOverview,
    roomTypeOccupancy, bookingTrend, recentReservations 
  } = dashboardData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <Badge variant="success" size="sm">{status}</Badge>;
      case 'Checked In': return <Badge variant="primary" size="sm">{status}</Badge>;
      case 'Pending': return <Badge variant="warning" size="sm">{status}</Badge>;
      case 'Checked Out': return <Badge variant="default" size="sm">{status}</Badge>;
      case 'Cancelled': return <Badge variant="danger" size="sm">{status}</Badge>;
      default: return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Daily Dashboard"
      description="Real-time operational overview of Sri Yoga Mandir"
      action={
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-[12px] font-bold text-text-secondary">
            <CalendarDays size={14} className="text-text-muted" />
            {format(new Date(), 'dd MMMM yyyy')}
          </div>
          <Button variant="primary" className="text-[11px] h-8 px-4 font-bold tracking-wider uppercase">SYNC PMS</Button>
        </div>
      }
    >
      <div className="w-full text-text pb-10 space-y-4 sm:space-y-5">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard 
            title="Total Revenue" 
            value={`${revenue.currency}${revenue.total.toLocaleString()}`} 
            subtext={`${revenue.completedBookings} completed bookings`}
            icon={IndianRupee} colorClass="text-emerald-500" iconBgClass="bg-emerald-500"
          />
          <KPICard 
            title="Occupancy Rate" 
            value={`${occupancy.rate}%`} 
            subtext={`${occupancy.occupiedRooms} of ${occupancy.totalRooms} rooms occupied`}
            icon={BedDouble} colorClass="text-primary" iconBgClass="bg-primary"
          />
          <KPICard 
            title="Today's Bookings" 
            value={todaysBookings.total} 
            subtext={`${todaysBookings.confirmed} confirmed • ${todaysBookings.pending} pending`}
            icon={CalendarDays} colorClass="text-brand-dark" iconBgClass="bg-brand-dark"
          />
          <KPICard 
            title="Available Rooms" 
            value={availableRooms.count} 
            subtext={availableRooms.statusText}
            icon={Key} colorClass="text-blue-500" iconBgClass="bg-blue-500"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-5">
          <div className="xl:col-span-3">
            <Card padding="none" className="p-4 sm:p-6 h-full rounded-2xl bg-surface border border-border shadow-sm">
              <SectionHead 
                icon={TrendingUp} accentClass="text-primary" iconBgClass="bg-primary/10"
                title="Booking & Revenue Trend" sub="Daily booking and revenue activity"
              />
              <TrendChart data={bookingTrend} />
            </Card>
          </div>
          <div className="xl:col-span-2">
            <Card padding="none" className="p-4 sm:p-6 h-full rounded-2xl bg-surface border border-border shadow-sm flex flex-col">
              <SectionHead 
                icon={BedDouble} accentClass="text-brand-dark" iconBgClass="bg-brand-dark/10"
                title="Room Status" sub="Current room availability"
              />
              <div className="grid grid-cols-2 gap-3 mt-2 flex-1">
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Available</p>
                   <p className="text-2xl font-black text-blue-600">{roomStatus.available}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Occupied</p>
                   <p className="text-2xl font-black text-primary">{roomStatus.occupied}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Maintenance</p>
                   <p className="text-2xl font-black text-semantic-danger">{roomStatus.maintenance}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Total Rooms</p>
                   <p className="text-2xl font-black text-text">{roomStatus.total}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <Card padding="none" className="p-4 sm:p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col">
            <SectionHead 
                icon={ArrowDownToLine} accentClass="text-blue-500" iconBgClass="bg-blue-500/10"
                title="Today's Movements" sub="Expected check-ins and check-outs"
            />
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-muted/30">
                <div>
                  <p className="text-[12px] font-bold text-text mb-0.5">Arrivals</p>
                  <p className="text-[11px] text-text-muted font-medium">Expected check-ins</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-[16px] font-black text-blue-600">{movements.arrivals}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-muted/30">
                <div>
                  <p className="text-[12px] font-bold text-text mb-0.5">Departures</p>
                  <p className="text-[11px] text-text-muted font-medium">Expected check-outs</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[16px] font-black text-primary">{movements.departures}</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card padding="none" className="p-4 sm:p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col">
            <SectionHead 
                icon={CalendarDays} accentClass="text-brand-dark" iconBgClass="bg-brand-dark/10"
                title="Reservation Overview" sub="Current reservation statuses"
            />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Pending Approval', count: reservationOverview.pending, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { label: 'Confirmed', count: reservationOverview.confirmed, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { label: 'Checked In', count: reservationOverview.checkedIn, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: 'Checked Out', count: reservationOverview.checkedOut, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
                { label: 'Cancelled', count: reservationOverview.cancelled, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
              ].map((item, i) => (
                <div key={i} className={`flex flex-col p-3 rounded-xl border ${item.border} ${item.bg}`}>
                  <p className="text-[11px] font-bold text-text-secondary truncate">{item.label}</p>
                  <p className={`text-[18px] font-black mt-1 ${item.color}`}>{item.count}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Room Type Occupancy */}
        <Card padding="none" className="p-4 sm:p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <SectionHead 
              icon={Users} accentClass="text-emerald-500" iconBgClass="bg-emerald-500/10"
              title="Room Type Occupancy" sub="Occupancy breakdown by category"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            {roomTypeOccupancy.map((room, i) => {
              const pct = room.total > 0 ? (room.occupied / room.total) * 100 : 0;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-text">{room.type}</span>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-text-secondary">{room.occupied} / {room.total}</span>
                      <span className="text-[10px] font-bold text-text-muted ml-2">{Math.round(pct)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Reservations Table */}
        <Card padding="none" className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col">
          <SectionHead 
            icon={Clock} accentClass="text-primary" iconBgClass="bg-primary/10" 
            title="Recent Reservations" sub="Latest reservation activity" 
          />
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="text-[10px] uppercase font-black tracking-widest text-text-muted border-b border-border">
                <tr>
                  <th className="px-3 py-3 w-28">Booking ID</th>
                  <th className="px-3 py-3">Guest</th>
                  <th className="px-3 py-3">Room</th>
                  <th className="px-3 py-3">Check-in</th>
                  <th className="px-3 py-3">Check-out</th>
                  <th className="px-3 py-3">Guests</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentReservations.map((res, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30 transition-colors group">
                    <td className="px-3 py-3.5 text-[11px] font-black text-text-muted uppercase tracking-wider">{res.id}</td>
                    <td className="px-3 py-3.5 text-[12px] font-bold text-text">{res.guest}</td>
                    <td className="px-3 py-3.5 text-[12px] font-semibold text-text-secondary">{res.room}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.checkIn}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.checkOut}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.guests}</td>
                    <td className="px-3 py-3.5">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="font-black text-[13px] text-text tabular-nums">₹{res.amount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </PageContainer>
  );
}
