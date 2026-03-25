import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Eye, TrendingUp } from 'lucide-react';
import { mockBookings } from '@/lib/mock-data';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'refunded' | 'failed';
  type: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2026-03-20',
    description: 'Booking - Nurse Visit',
    amount: 1200,
    status: 'paid',
    type: 'booking',
  },
  {
    id: 'TXN002',
    date: '2026-03-18',
    description: 'Monthly Subscription',
    amount: 999,
    status: 'paid',
    type: 'subscription',
  },
  {
    id: 'TXN003',
    date: '2026-03-15',
    description: 'Booking - Nurse Visit',
    amount: 1200,
    status: 'paid',
    type: 'booking',
  },
  {
    id: 'TXN004',
    date: '2026-03-10',
    description: 'Booking - Cancelled',
    amount: 1200,
    status: 'refunded',
    type: 'booking',
  },
];

export default function PatientPayments() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'refunded':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const totalSpent = mockTransactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonth = mockTransactions
    .filter((t) => t.status === 'paid' && t.date.startsWith('2026-03'))
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: 'Total Spent', value: `₹${totalSpent}`, color: 'border-l-primary', icon: TrendingUp },
    { label: 'This Month', value: `₹${thisMonth}`, color: 'border-l-secondary' },
    { label: 'Active Plan', value: 'Monthly', color: 'border-l-accent' },
    { label: 'Last Payment', value: '₹999', color: 'border-l-success' },
  ];

  return (
    <div>
      <AppHeader title="Payments" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 pb-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`border-l-4 ${stat.color}`}
            >
              <Card className="p-4 h-full">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Transactions table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((txn, idx) => (
                    <motion.tr
                      key={txn.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    >
                      <td className="p-4">{txn.date}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">{txn.id}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium">₹{txn.amount}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(txn.status)}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="rounded-lg gap-1">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="rounded-lg gap-1">
                              <Download className="w-4 h-4" />
                              Receipt
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
