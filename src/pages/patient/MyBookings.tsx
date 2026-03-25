import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { MapPin, Star, MessageCircle, Loader2, X, Navigation, Map, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { mockBookings, currentUser } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  patientId: string;
  nurseName: string;
  date: string;
  time: string;
  address: string;
  status: string;
  amount: number;
  rating?: number;
}

export default function MyBookings() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [nurseLocation, setNurseLocation] = useState({ lat: 12.9716, lng: 77.5946, eta: 12, distance: 2.5 });

  useEffect(() => {
    const filtered = mockBookings.filter((b) => {
      if (b.patientId !== currentUser.id) return false;
      if (filter === 'all') return true;
      if (filter === 'active') return ['IN_PROGRESS', 'CONFIRMED'].includes(b.status);
      if (filter === 'upcoming') return b.status === 'CONFIRMED';
      if (filter === 'completed') return b.status === 'COMPLETED';
      if (filter === 'cancelled') return b.status === 'CANCELLED';
      return true;
    });
    setBookings(filtered);
  }, [filter]);

  // Simulate live location updates
  useEffect(() => {
    if (!showTrackingModal) return;
    const interval = setInterval(() => {
      setNurseLocation((prev) => ({
        ...prev,
        eta: Math.max(0, prev.eta - 1),
        distance: Math.max(0, prev.distance - 0.1),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [showTrackingModal]);

  const handleRateBooking = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Thank you for your rating!');
      setShowRatingModal(false);
      setRating(0);
      setReview('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Booking cancelled successfully');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning/10 text-warning';
      case 'CONFIRMED':
        return 'bg-primary/10 text-primary';
      case 'IN_PROGRESS':
        return 'bg-success/10 text-success';
      case 'COMPLETED':
        return 'bg-muted text-muted-foreground';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div>
      <AppHeader title="My Bookings" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 pb-8">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === tab.value
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              {tab.value === 'all' && bookings.length > 0 && (
                <span className="ml-2 text-xs">({bookings.length})</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Bookings list */}
        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No bookings found</p>
            <Button className="rounded-lg">Book a Nurse</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 hover:shadow-lg transition-all border-l-4 border-l-primary group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center font-semibold text-secondary border border-secondary/20"
                        whileHover={{ scale: 1.1 }}
                      >
                        {booking.nurseName.charAt(0)}
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-semibold group-hover:text-primary transition-colors">{booking.nurseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} at {booking.time}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {booking.address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{booking.amount}</p>
                      <StatusBadge status={booking.status} className="mt-1" />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {booking.status === 'IN_PROGRESS' && (
                      <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowTrackingModal(true);
                            }}
                            size="sm"
                            className="rounded-lg gap-1"
                          >
                            <Navigation className="w-4 h-4" />
                            Track Nurse
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => toast.info('Calling nurse...')}
                            size="sm"
                            variant="outline"
                            className="rounded-lg gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </Button>
                        </motion.div>
                      </>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRatingModal(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="rounded-lg gap-1"
                        >
                          <Star className="w-4 h-4" />
                          Rate & Review
                        </Button>
                      </motion.div>
                    )}
                    {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleCancelBooking(booking.id)}
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-destructive"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Live Tracking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Map placeholder with animation */}
            <motion.div
              className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <Map className="w-16 h-16 text-muted-foreground/30" />
            </motion.div>

            {/* Live tracking info */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="bg-primary/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-muted-foreground mb-1">ETA</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.max(0, nurseLocation.eta)} min
                </p>
              </motion.div>
              <motion.div
                className="bg-secondary/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-muted-foreground mb-1">Distance</p>
                <p className="text-2xl font-bold text-secondary">
                  {nurseLocation.distance.toFixed(1)} km
                </p>
              </motion.div>
              <motion.div
                className="bg-success/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-lg font-bold text-success">On Way</p>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 rounded-lg gap-2">
                <Navigation className="w-4 h-4" />
                Open in Maps
              </Button>
              <Button variant="outline" className="flex-1 rounded-lg gap-2">
                <Phone className="w-4 h-4" />
                Call Nurse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Review (Optional)</label>
              <textarea
                placeholder="Share your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRateBooking}
                disabled={loading || rating === 0}
                className="flex-1 rounded-lg gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Rating'
                )}
              </Button>
              <Button
                onClick={() => setShowRatingModal(false)}
                variant="outline"
                className="rounded-lg"
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
