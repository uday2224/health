import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ChevronRight, Star, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { mockNurses, mockBookings } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';

type Step = 1 | 2 | 3 | 4;

interface BookingData {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'emergency';
  pincode: string;
  serviceType: 'scheduled' | 'acute';
  selectedNurse: typeof mockNurses[0] | null;
  address: string;
  notes: string;
}

export default function BookNurse() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingData>({
    date: '',
    timeSlot: 'morning',
    pincode: '',
    serviceType: 'scheduled',
    selectedNurse: null,
    address: '',
    notes: '',
  });

  const handleNext = () => {
    if (step === 1) {
      if (!booking.date || !booking.pincode) {
        toast.error('Please fill all fields');
        return;
      }
    }
    if (step === 2 && !booking.selectedNurse) {
      toast.error('Please select a nurse');
      return;
    }
    if (step === 3 && !booking.address) {
      toast.error('Please enter your address');
      return;
    }
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        date: booking.date,
        timeSlot: booking.timeSlot,
        serviceType: booking.serviceType,
        nurseId: booking.selectedNurse?.id,
        address: booking.address,
        notes: booking.notes,
        pincode: booking.pincode,
      };

      await apiClient.createBooking(bookingPayload);
      toast.success('Booking confirmed! Your nurse will arrive soon.');
      setStep(1);
      setBooking({
        date: '',
        timeSlot: 'morning',
        pincode: '',
        serviceType: 'scheduled',
        selectedNurse: null,
        address: '',
        notes: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppHeader title="Book a Nurse" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Search */}
          {step === 1 && (
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">When do you need care?</h2>
                <p className="text-muted-foreground">Select date and time</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Time of Day</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'morning', label: 'Morning', time: '6am - 12pm' },
                      { value: 'afternoon', label: 'Afternoon', time: '12pm - 6pm' },
                      { value: 'evening', label: 'Evening', time: '6pm - 10pm' },
                      { value: 'emergency', label: 'Emergency', time: 'Now' },
                    ].map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setBooking({ ...booking, timeSlot: slot.value as any })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          booking.timeSlot === slot.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-sm">{slot.label}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pincode</label>
                  <Input
                    placeholder="560001"
                    value={booking.pincode}
                    onChange={(e) => setBooking({ ...booking, pincode: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Service Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'acute', label: 'Acute' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setBooking({ ...booking, serviceType: type.value as any })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          booking.serviceType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-sm">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Select Nurse */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Choose Your Nurse</h2>
                <p className="text-muted-foreground">Select from available nurses</p>
              </div>

              <div className="grid gap-4">
                {mockNurses.map((nurse) => (
                  <Card
                    key={nurse.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      booking.selectedNurse?.id === nurse.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setBooking({ ...booking, selectedNurse: nurse })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center font-semibold text-secondary">
                          {nurse.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{nurse.name}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {nurse.specializations.slice(0, 2).map((spec) => (
                              <Badge key={spec} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              {nurse.rating} ({nurse.reviews} reviews)
                            </span>
                            <span>{nurse.experience} years exp</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{nurse.pricePerVisit}</p>
                        <p className="text-xs text-muted-foreground">per visit</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Booking Details */}
          {step === 3 && (
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
                <p className="text-muted-foreground">Confirm your information</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-medium">Nurse:</span> {booking.selectedNurse?.name}</p>
                <p className="text-sm"><span className="font-medium">Date:</span> {booking.date}</p>
                <p className="text-sm"><span className="font-medium">Time:</span> {booking.timeSlot}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Address</label>
                  <Input
                    placeholder="House no, Street, Landmark"
                    value={booking.address}
                    onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Special Notes (Optional)</label>
                  <Input
                    placeholder="Any special instructions for the nurse"
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>₹{booking.selectedNurse?.pricePerVisit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>₹29</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{Math.round((booking.selectedNurse?.pricePerVisit || 0 + 29) * 0.18)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{Math.round((booking.selectedNurse?.pricePerVisit || 0 + 29) * 1.18)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment</h2>
                <p className="text-muted-foreground">Complete your booking</p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">Your payment is encrypted and secure</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Card Number</label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Expiry</label>
                    <Input placeholder="MM/YY" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">CVC</label>
                    <Input placeholder="123" className="rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Order Summary</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span>₹{booking.selectedNurse?.pricePerVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fees & Tax</span>
                    <span>₹{Math.round((booking.selectedNurse?.pricePerVisit || 0 + 29) * 0.18 + 29)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{Math.round((booking.selectedNurse?.pricePerVisit || 0 + 29) * 1.18)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              onClick={() => setStep((step - 1) as Step)}
              variant="outline"
              className="rounded-lg"
            >
              Back
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="flex-1 rounded-lg gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitBooking}
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
                  Confirm Booking
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
