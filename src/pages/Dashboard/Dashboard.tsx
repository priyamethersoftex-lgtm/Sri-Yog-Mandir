import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { PageContainer } from '../../components/ui/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IndianRupee, BedDouble, CalendarDays, Key, TrendingUp, Users, ArrowDownToLine, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { dashboardService, DashboardStats } from '../../services/dashboardService';
import { toast } from 'sonner';
import { LoadingState } from '../../components/data/LoadingState';

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

const TrendChart = ({ data }: any) => {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
            tickFormatter={(value) => `₹${value}`}
            width={60}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
            itemStyle={{ fontSize: '13px', fontWeight: 700 }}
            labelStyle={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '4px' }}
            formatter={(value: any, name: string) => [name === 'Revenue' ? `₹${value}` : value, name]}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            yAxisId="right" 
            dataKey="bookings" 
            name="Bookings" 
            barSize={12} 
            fill="#1e293b" 
            radius={[4, 4, 0, 0]}
          />
          <Area 
            yAxisId="left" 
            type="monotone" 
            dataKey="revenue" 
            name="Revenue" 
            stroke="#f97316" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fromDate, setFromDate] = React.useState<string>('');
  const [toDate, setToDate] = React.useState<string>('');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getStats(fromDate || null, toDate || null);
        setData(stats);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return <Badge variant="success" size="sm">{status}</Badge>;
      case 'CHECKED_IN': 
      case 'CHECKED IN': return <Badge variant="primary" size="sm">{status}</Badge>;
      case 'PENDING': return <Badge variant="warning" size="sm">{status}</Badge>;
      case 'CHECKED_OUT': 
      case 'CHECKED OUT': return <Badge variant="default" size="sm">{status}</Badge>;
      case 'CANCELLED': return <Badge variant="danger" size="sm">{status}</Badge>;
      default: return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  if (loading || !data) {
    return <LoadingState />;
  }

  const occupancyRate = data.rooms.total > 0 ? Math.round((data.rooms.occupied / data.rooms.total) * 100) : 0;
  
  const bookingTrend = data.trend.map(t => ({
    label: format(new Date(t.date), 'dd MMM'),
    revenue: t.revenue,
    bookings: t.bookings
  }));

  return (
    <PageContainer
      title="Daily Dashboard"
      description="Real-time operational overview of Sri Yoga Mandir"
      action={
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[12px] font-bold text-text-secondary focus:outline-none focus:border-primary"
            />
            <span className="text-text-muted text-[12px] font-medium">to</span>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[12px] font-bold text-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={() => { setFromDate(''); setToDate(''); }} className="text-[11px] h-8 text-semantic-danger font-bold uppercase">
              Clear
            </Button>
          )}
        </div>
      }
    >
      <div className="w-full text-text pb-10 space-y-4 sm:space-y-5">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard 
            title="Total Revenue" 
            value={`₹${data.revenue.total.toLocaleString('en-IN')}`} 
            subtext={`${data.revenue.completed_bookings} completed bookings`}
            icon={IndianRupee} colorClass="text-emerald-500" iconBgClass="bg-emerald-500"
          />
          <KPICard 
            title="Occupancy Rate" 
            value={`${occupancyRate}%`} 
            subtext={`${data.rooms.occupied} of ${data.rooms.total} rooms occupied`}
            icon={BedDouble} colorClass="text-primary" iconBgClass="bg-primary"
          />
          <KPICard 
            title="Today's Bookings" 
            value={data.today_bookings.total} 
            subtext={`${data.today_bookings.confirmed} confirmed • ${data.today_bookings.pending} pending`}
            icon={CalendarDays} colorClass="text-brand-dark" iconBgClass="bg-brand-dark"
          />
          <KPICard 
            title="Available Rooms" 
            value={data.rooms.available} 
            subtext={data.rooms.available > 0 ? 'Ready for check-in' : 'Fully booked'}
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
                   <p className="text-2xl font-black text-blue-600">{data.rooms.available}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Occupied</p>
                   <p className="text-2xl font-black text-primary">{data.rooms.occupied}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Maintenance</p>
                   <p className="text-2xl font-black text-semantic-danger">{data.rooms.maintenance}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">Total Rooms</p>
                   <p className="text-2xl font-black text-text">{data.rooms.total}</p>
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
                  <span className="text-[16px] font-black text-blue-600">{data.movements.arrivals}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-muted/30">
                <div>
                  <p className="text-[12px] font-bold text-text mb-0.5">Departures</p>
                  <p className="text-[11px] text-text-muted font-medium">Expected check-outs</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[16px] font-black text-primary">{data.movements.departures}</span>
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
                { label: 'Pending Approval', count: data.reservations.pending, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { label: 'Confirmed', count: data.reservations.confirmed, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { label: 'Checked In', count: data.reservations.checked_in, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: 'Checked Out', count: data.reservations.checked_out, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
                { label: 'Cancelled', count: data.reservations.cancelled, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
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
            {data.room_type_occupancy.map((room, i) => {
              const pct = room.total > 0 ? (room.occupied / room.total) * 100 : 0;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-text">{room.room_type}</span>
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
                {data.recent_reservations.map((res, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30 transition-colors group">
                    <td className="px-3 py-3.5 text-[11px] font-black text-text-muted uppercase tracking-wider">{res.booking_id}</td>
                    <td className="px-3 py-3.5 text-[12px] font-bold text-text">{res.guest}</td>
                    <td className="px-3 py-3.5 text-[12px] font-semibold text-text-secondary">{res.room}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.check_in}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.check_out}</td>
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-text-muted">{res.guests} Guests</td>
                    <td className="px-3 py-3.5">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="font-black text-[13px] text-text tabular-nums">₹{res.amount.toLocaleString('en-IN')}</span>
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
