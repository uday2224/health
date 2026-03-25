import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  visits: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 499,
    period: '/week',
    visits: 2,
    features: ['2 nurse visits', 'Priority booking', 'Cancel anytime'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 999,
    period: '/month',
    visits: 8,
    features: [
      '8 nurse visits',
      'Priority booking',
      'Free doctor consultation',
      'Cancel anytime',
    ],
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 2499,
    period: '/quarter',
    visits: 25,
    features: [
      '25 visits',
      'All monthly benefits',
      'Dedicated nurse assignment',
    ],
    badge: 'Best Value',
  },
];

export default function Subscriptions() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activePlan, setActivePlan] = useState<Plan | null>(plans[1]); // Monthly is active

  const handleSubscribe = async (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Subscribed to ${selectedPlan.name} plan!`);
      setActivePlan(selectedPlan);
      setShowConfirmDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Subscription cancelled');
      setActivePlan(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppHeader title="Subscriptions" showMenu />
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8 pb-8">
        {/* Active Subscription */}
        {activePlan && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 rounded-card p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Active Plan: {activePlan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{activePlan.price}{activePlan.period}
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </motion.div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Visits Used This Month</p>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '62.5%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">5 of 8 visits used</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Next Billing', value: 'Mar 31, 2026' },
                  { label: 'Remaining Visits', value: '3 visits' },
                  { label: 'Renewal Date', value: 'Mar 31, 2026' },
                  { label: 'Status', value: 'Active', color: 'text-success' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`font-semibold ${stat.color || ''}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCancelPlan}
                  disabled={loading}
                  variant="outline"
                  className="rounded-lg text-destructive"
                >
                  Cancel Plan
                </Button>
                <Button
                  onClick={() => toast.info('Pause feature coming soon')}
                  variant="outline"
                  className="rounded-lg"
                >
                  Pause Plan
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className={`relative p-6 flex flex-col h-full transition-all ${
                    plan.popular
                      ? 'ring-2 ring-primary shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Badge
                        className={`absolute -top-3 right-4 ${
                          plan.popular
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {plan.badge}
                      </Badge>
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.visits} visits per month
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                      >
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={activePlan?.id === plan.id}
                      variant={plan.popular ? 'default' : 'outline'}
                      className="w-full rounded-lg"
                    >
                      {activePlan?.id === plan.id ? 'Current Plan' : 'Subscribe Now'}
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What happens to unused visits?',
                a: 'Unused visits expire at the end of each billing cycle and do not carry over.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime without any penalties. Your access continues until the end of the billing period.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <p className="font-medium mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Plan</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price</span>
                  <span className="font-medium">₹{selectedPlan.price}{selectedPlan.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Visits</span>
                  <span className="font-medium">{selectedPlan.visits} per month</span>
                </div>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-3 flex gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <p>Your subscription will renew automatically. You can cancel anytime.</p>
              </div>

              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={handleConfirmSubscription}
                    disabled={loading}
                    className="w-full rounded-lg gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </motion.div>
                <Button
                  onClick={() => setShowConfirmDialog(false)}
                  variant="outline"
                  className="rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
