import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPayments } from '@/lib/mock-data';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, DollarSign, TrendingUp, Calendar } from 'lucide-react';

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState('30');

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || payment.status === (selectedStatus as any);

    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalRevenue = mockPayments.reduce((sum, p) => p.status === 'paid' ? sum + p.amount : sum, 0);
  const thisMonth = mockPayments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  // Chart data
  const dailyRevenue = [
    { date: 'Mon', revenue: 12000, bookings: 8 },
    { date: 'Tue', revenue: 15000, bookings: 10 },
    { date: 'Wed', revenue: 18000, bookings: 12 },
    { date: 'Thu', revenue: 14000, bookings: 9 },
    { date: 'Fri', revenue: 22000, bookings: 15 },
    { date: 'Sat', revenue: 25000, bookings: 17 },
    { date: 'Sun', revenue: 20000, bookings: 14 },
  ];

  const revenueBreakdown = [
    { name: 'Bookings', value: 65, color: '#0EA5E9' },
    { name: 'Subscriptions', value: 25, color: '#10B981' },
    { name: 'Consultations', value: 10, color: '#F59E0B' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div>
      <AppHeader title="Payments & Revenue" showMenu />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-card shadow-card p-4 border-l-4 border-l-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/20" />
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-card shadow-card p-4 border-l-4 border-l-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">₹{thisMonth.toLocaleString()}</p>
              </div>
              <Calendar className="w-8 h-8 text-secondary/20" />
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-card shadow-card p-4 border-l-4 border-l-warning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">₹{pendingAmount.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning/20" />
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-card shadow-card p-4 border-l-4 border-l-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold mt-1">{mockPayments.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-4">
            <h3 className="font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-xs">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as PaymentStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Transaction ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{payment.id}</td>
                      <td className="px-4 py-3">{payment.description}</td>
                      <td className="px-4 py-3 text-right font-semibold">₹{payment.amount}</td>
                      <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.date}</td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
