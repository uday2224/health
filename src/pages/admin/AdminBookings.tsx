import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockBookings } from '@/lib/mock-data';
import { Search, Eye, RefreshCw, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export default function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.nurseName && booking.nurseName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || booking.status === (selectedStatus as any);

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleInitiateRefund = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setRefundAmount(booking.amount.toString());
    setShowRefundModal(true);
  };

  const handleConfirmRefund = () => {
    if (selectedBooking) {
      console.log(`Refund booking ${selectedBooking.id}:`, {
        amount: refundAmount,
        reason: refundReason,
      });
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      in_progress: 'default',
      completed: 'outline',
      cancelled: 'destructive',
    };
    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return <Badge variant={variants[status] || 'outline'}>{labels[status]}</Badge>;
  };

  const getPaymentStatus = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div>
      <AppHeader title="Booking Management" showMenu />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Filters */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, patient, or nurse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as BookingStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                className="bg-card rounded-card shadow-card p-4 border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{booking.id}</p>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ₹{booking.amount}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="text-muted-foreground">{booking.patientName}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{booking.nurseName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatus(booking.paymentStatus)}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  {booking.paymentStatus === 'Paid' && booking.status !== 'CANCELLED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInitiateRefund(booking)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-semibold">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">{selectedBooking.date} at {selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold">₹{selectedBooking.amount}</p>
                </div>
              </div>

              {/* Patient & Nurse */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Patient</p>
                  <p className="font-semibold text-sm">{selectedBooking.patientName}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Nurse</p>
                  <p className="font-semibold text-sm">{selectedBooking.nurseName}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Timeline</p>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Booked:</span>
                    <span>{selectedBooking.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Confirmed:</span>
                    <span>{selectedBooking.date}</span>
                  </div>
                </div>
              </div>

              {/* Close */}
              <Button onClick={() => setShowDetailsModal(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Refund</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Booking Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-semibold">{selectedBooking.id}</p>
              </div>

              {/* Refund Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Refund Amount (₹)</label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="0"
                />
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Why is this refund being issued?"
                  className="w-full p-2 border border-border rounded-lg text-sm"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRefundModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmRefund}>
                  Process Refund
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
