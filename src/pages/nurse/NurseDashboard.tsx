import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Briefcase, TrendingUp, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const earningsData = [
  { day: 'Mon', amount: 450 },
  { day: 'Tue', amount: 600 },
  { day: 'Wed', amount: 500 },
  { day: 'Thu', amount: 750 },
  { day: 'Fri', amount: 650 },
  { day: 'Sat', amount: 800 },
  { day: 'Sun', amount: 400 },
];

export default function NurseDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [verificationStatus] = useState('ACTIVE');

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast.success(
      !isOnline
        ? 'You are now online. Jobs will appear shortly.'
        : 'You are now offline.'
    );
  };

  return (
    <div>
      <AppHeader title="Dashboard" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Availability Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Your Availability</h3>
              <p className="text-sm text-muted-foreground">
                {isOnline
                  ? 'You are online and receiving job requests'
                  : 'You are offline. Turn on to receive jobs'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${isOnline ? 'text-success' : 'text-muted-foreground'}`}>
                {isOnline ? '🟢 Online' : '⚫ Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={handleToggleOnline} />
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        {verificationStatus === 'PENDING_VERIFICATION' && (
          <div className="bg-warning/10 border border-warning/20 rounded-card p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Profile Under Review</p>
              <p className="text-xs text-muted-foreground">
                Our team is verifying your documents. This usually takes 24 hours.
              </p>
            </div>
          </div>
        )}

        {verificationStatus === 'ACTIVE' && (
          <div className="bg-success/10 border border-success/20 rounded-card p-4 flex items-center gap-3">
            <Badge className="bg-success text-success-foreground">✓ Verified</Badge>
            <p className="text-sm text-muted-foreground">Your profile is verified and active</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Jobs", value: 3, icon: Briefcase, color: 'border-l-primary' },
            { label: 'This Week ₹', value: '₹4,150', icon: TrendingUp, color: 'border-l-secondary' },
            { label: 'Rating', value: '4.8★', icon: Star, color: 'border-l-accent' },
            { label: 'Completed', value: 127, icon: Zap, color: 'border-l-success' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`p-4 border-l-4 ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Booking */}
        <Card className="p-6 border-l-4 border-l-success">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold mb-1">Active Booking</h3>
              <p className="text-sm text-muted-foreground">Patient: Rajesh K. • Bangalore</p>
            </div>
            <Badge className="bg-success text-success-foreground animate-pulse">
              In Progress
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ETA</span>
              <span className="font-medium">~8 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium">123 Main St, Bangalore</span>
            </div>
            <Link to="/nurse/active/1">
              <Button className="w-full rounded-lg gap-2 mt-4">
                <Zap className="w-4 h-4" />
                View Active Booking
              </Button>
            </Link>
          </div>
        </Card>

        {/* Job Alerts */}
        <Card className="p-6 bg-gradient-to-r from-accent/10 to-warning/10 border-accent/20">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent mb-2">3</p>
            <p className="font-medium mb-4">New jobs available</p>
            <Link to="/nurse/jobs">
              <Button className="rounded-lg gap-2">
                <Briefcase className="w-4 h-4" />
                View Jobs Board
              </Button>
            </Link>
          </div>
        </Card>

        {/* Earnings Chart */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Earnings This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
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
              <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
