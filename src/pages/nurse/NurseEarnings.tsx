import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const earningsData = [
  { day: 'Mon', gross: 1200, net: 1020 },
  { day: 'Tue', gross: 1500, net: 1275 },
  { day: 'Wed', gross: 1300, net: 1105 },
  { day: 'Thu', gross: 1800, net: 1530 },
  { day: 'Fri', gross: 1600, net: 1360 },
  { day: 'Sat', gross: 2000, net: 1700 },
  { day: 'Sun', gross: 1000, net: 850 },
];

const payouts = [
  {
    id: '1',
    week: 'Mar 17-23',
    jobs: 12,
    gross: 9400,
    cut: 1410,
    net: 7990,
    status: 'paid',
  },
  {
    id: '2',
    week: 'Mar 10-16',
    jobs: 10,
    gross: 8200,
    cut: 1230,
    net: 6970,
    status: 'paid',
  },
  {
    id: '3',
    week: 'Mar 3-9',
    jobs: 8,
    gross: 6500,
    cut: 975,
    net: 5525,
    status: 'pending',
  },
];

export default function NurseEarnings() {
  const [loading, setLoading] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '****1234',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
  });

  const thisWeekEarnings = earningsData.reduce((sum, d) => sum + d.net, 0);
  const lastWeekEarnings = 6970;
  const percentChange = ((thisWeekEarnings - lastWeekEarnings) / lastWeekEarnings * 100).toFixed(1);

  const handleRequestPayout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Payout request submitted! You will receive funds within 2-3 business days.');
      setShowPayoutDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request payout');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'processing':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isPayoutDay = new Date().getDay() === 5; // Friday

  return (
    <div>
      <AppHeader title="Earnings" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Current Week Card */}
        <Card className="p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Week</p>
              <p className="text-3xl font-bold">₹{thisWeekEarnings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Net earnings</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{percentChange}%</span>
              </div>
              <p className="text-xs text-muted-foreground">vs last week</p>
            </div>
          </div>
          <Button
            onClick={() => setShowPayoutDialog(true)}
            disabled={!isPayoutDay}
            className="w-full rounded-lg gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isPayoutDay ? 'Request Payout' : 'Payout Available Friday'}
          </Button>
        </Card>

        {/* Earnings Chart */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" />
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
                dataKey="gross"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorGross)"
                name="Gross"
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="var(--success)"
                fillOpacity={1}
                fill="url(#colorNet)"
                name="Net"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Payouts Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Payout History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium">Week</th>
                  <th className="text-left p-4 font-medium">Jobs</th>
                  <th className="text-left p-4 font-medium">Gross</th>
                  <th className="text-left p-4 font-medium">Cut (15%)</th>
                  <th className="text-left p-4 font-medium">Net</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{payout.week}</td>
                    <td className="p-4">{payout.jobs}</td>
                    <td className="p-4">₹{payout.gross.toLocaleString()}</td>
                    <td className="p-4">₹{payout.cut.toLocaleString()}</td>
                    <td className="p-4 font-bold">₹{payout.net.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Bank Details</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-medium">{bankDetails.accountNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IFSC Code</p>
              <p className="font-medium">{bankDetails.ifsc}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bank Name</p>
              <p className="font-medium">{bankDetails.bankName}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full rounded-lg">
            Edit Bank Details
          </Button>
        </Card>
      </div>

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Available Amount</span>
                <span className="font-bold">₹{thisWeekEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bank Account</span>
                <span className="font-medium">{bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Processing Time</span>
                <span className="font-medium">2-3 business days</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRequestPayout}
                disabled={loading}
                className="flex-1 rounded-lg gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    Request Payout
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowPayoutDialog(false)}
                variant="outline"
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
