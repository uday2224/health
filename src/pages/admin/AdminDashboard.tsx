import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Stethoscope, AlertCircle, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { mockBookings, mockNurses } from '@/lib/mock-data';

const revenueData = [
  { date: 'Mar 1', revenue: 12000 },
  { date: 'Mar 5', revenue: 15000 },
  { date: 'Mar 10', revenue: 18000 },
  { date: 'Mar 15', revenue: 16000 },
  { date: 'Mar 20', revenue: 22000 },
  { date: 'Mar 24', revenue: 25000 },
];

const bookingStatusData = [
  { name: 'Completed', value: 245, color: '#10B981' },
  { name: 'Pending', value: 32, color: '#F59E0B' },
  { name: 'Cancelled', value: 18, color: '#EF4444' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalPatients: 850,
    totalNurses: 320,
    activeNurses: 245,
    pendingVerification: 12,
    totalRevenue: 125000,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 5),
        activeNurses: prev.activeNurses + Math.floor(Math.random() * 3) - 1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'border-l-primary',
      trend: '+12%',
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'border-l-secondary',
      trend: '+8%',
    },
    {
      label: 'Total Nurses',
      value: stats.totalNurses,
      icon: Stethoscope,
      color: 'border-l-accent',
      trend: '+5%',
    },
    {
      label: 'Active Nurses',
      value: stats.activeNurses,
      icon: Zap,
      color: 'border-l-success',
      trend: '+3%',
    },
    {
      label: 'Pending Verification',
      value: stats.pendingVerification,
      icon: AlertCircle,
      color: 'border-l-warning',
      trend: '-2%',
    },
    {
      label: 'Platform Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'border-l-info',
      trend: '+18%',
    },
  ];

  return (
    <div>
      <AppHeader title="Admin Dashboard" showMenu />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 border-l-4 ${kpi.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                  </div>
                  <div className="text-right">
                    <kpi.icon className="w-5 h-5 text-muted-foreground mb-1" />
                    <p className="text-xs font-medium text-success">{kpi.trend}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Revenue Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Booking Status */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Booking Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {bookingStatusData.map((item) => (
                <div key={item.name} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-sm font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Verification Queue */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending Nurse Verification</h3>
            <Button size="sm" variant="outline" className="rounded-lg">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {mockNurses
              .filter((n) => n.verificationStatus === 'PENDING_VERIFICATION')
              .slice(0, 5)
              .map((nurse) => (
                <div
                  key={nurse.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center font-semibold text-warning text-sm">
                      {nurse.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{nurse.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {nurse.specializations.join(', ')}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="rounded-lg">
                    Verify Now
                  </Button>
                </div>
              ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { event: 'New booking created', time: '2 minutes ago', icon: '📅' },
              { event: 'Payment received', time: '5 minutes ago', icon: '💳' },
              { event: 'Nurse verified', time: '12 minutes ago', icon: '✅' },
              { event: 'New user registered', time: '18 minutes ago', icon: '👤' },
              { event: 'Booking completed', time: '25 minutes ago', icon: '🏁' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{activity.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
