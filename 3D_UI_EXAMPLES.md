# 3D UI Components - Usage Examples

All components are in `src/components/ui/3d-components.tsx`

---

## 1. Card3D - 3D Tilt Hover Effect

**Use Case:** Nurse cards, booking cards, feature cards

```tsx
import { Card3D } from '@/components/ui/3d-components';

export function NurseCard() {
  return (
    <Card3D className="p-6 bg-card rounded-card">
      <div className="w-12 h-12 rounded-full bg-secondary/10 mb-4" />
      <h3 className="font-semibold">Deepa R.</h3>
      <p className="text-sm text-muted-foreground">Wound Care, IV Therapy</p>
      <p className="text-lg font-bold text-primary mt-2">⭐ 4.9</p>
    </Card3D>
  );
}
```

**Result:** Card tilts in 3D when you hover over it, creating depth effect

---

## 2. GlassCard - Glassmorphism Effect

**Use Case:** Modals, overlays, premium sections

```tsx
import { GlassCard } from '@/components/ui/3d-components';

export function PremiumFeature() {
  return (
    <GlassCard className="p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Premium Features</h2>
      <p className="text-white/80">Unlock advanced capabilities</p>
    </GlassCard>
  );
}
```

**Result:** Semi-transparent card with blur effect, modern glassmorphism look

---

## 3. FloatingActionButton - FAB with Sub-actions

**Use Case:** Quick actions on patient/nurse dashboards

```tsx
import { FloatingActionButton } from '@/components/ui/3d-components';
import { Plus } from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      {/* Page content */}
      
      <FloatingActionButton
        icon={Plus}
        onClick={() => console.log('Primary action')}
        label="Book Nurse"
        color="bg-primary"
      />
    </div>
  );
}
```

**Result:** 
- Floating button in bottom-right corner
- Click to expand 3 sub-actions
- Spring animation
- Tooltip on hover

---

## 4. AnimatedCounter - Number Animation

**Use Case:** KPI cards, stats display

```tsx
import { AnimatedCounter } from '@/components/ui/3d-components';

export function StatsCard() {
  return (
    <div className="bg-card p-4 rounded-card">
      <p className="text-muted-foreground">Total Bookings</p>
      <p className="text-3xl font-bold">
        <AnimatedCounter value={3456} />
      </p>
    </div>
  );
}
```

**Result:** Number animates from 0 to 3456 over 1 second

---

## 5. AnimatedProgressBar - Smooth Progress Fill

**Use Case:** Booking steps, prescription confidence, subscription usage

```tsx
import { AnimatedProgressBar } from '@/components/ui/3d-components';

export function BookingSteps() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Step 1: Location</p>
        <AnimatedProgressBar value={100} max={100} color="bg-primary" />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Step 2: Nurse Selection</p>
        <AnimatedProgressBar value={50} max={100} color="bg-secondary" />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Step 3: Payment</p>
        <AnimatedProgressBar value={0} max={100} color="bg-warning" />
      </div>
    </div>
  );
}
```

**Result:** Smooth animated progress bars with different colors

---

## 6. PulsingBadge - Pulsing Animation

**Use Case:** Status badges, new notifications, online indicators

```tsx
import { PulsingBadge } from '@/components/ui/3d-components';

export function BookingStatus() {
  return (
    <div className="space-y-2">
      <PulsingBadge color="bg-success">🟢 En Route</PulsingBadge>
      <PulsingBadge color="bg-warning">🟡 Pending</PulsingBadge>
      <PulsingBadge color="bg-danger">🔴 Urgent</PulsingBadge>
    </div>
  );
}
```

**Result:** Badges pulse in and out continuously

---

## 7. AnimatedTabIndicator - Smooth Tab Underline

**Use Case:** Tab navigation

```tsx
import { AnimatedTabIndicator } from '@/components/ui/3d-components';
import { useState } from 'react';

export function BookingTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['All', 'Active', 'Completed', 'Cancelled'];
  
  return (
    <div className="relative border-b border-border">
      <div className="flex gap-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`py-3 font-medium transition-colors ${
              activeTab === i ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <AnimatedTabIndicator activeIndex={activeTab} tabCount={tabs.length} />
    </div>
  );
}
```

**Result:** Smooth underline slides to active tab

---

## 8. GradientBackground - Animated Gradient

**Use Case:** Hero sections, premium sections, backgrounds

```tsx
import { GradientBackground } from '@/components/ui/3d-components';

export function HeroSection() {
  return (
    <GradientBackground className="py-20">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Hospital-quality care</h1>
        <p className="text-lg opacity-90">At your doorstep</p>
      </div>
    </GradientBackground>
  );
}
```

**Result:** Animated gradient background that shifts colors

---

## 9. FloatingNotification - Toast Notification

**Use Case:** Success messages, alerts, notifications

```tsx
import { FloatingNotification } from '@/components/ui/3d-components';
import { useState } from 'react';

export function NotificationExample() {
  const [show, setShow] = useState(true);
  
  return (
    <>
      {show && (
        <FloatingNotification
          message="Booking confirmed! Nurse arriving in 15 minutes"
          icon="✅"
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}
```

**Result:** Notification slides in from top-right, can be closed

---

## 10. SkeletonLoader - Shimmer Loading

**Use Case:** Loading states, skeleton screens

```tsx
import { SkeletonLoader } from '@/components/ui/3d-components';

export function NurseCardSkeleton() {
  return (
    <div className="p-4 bg-card rounded-card space-y-3">
      <SkeletonLoader width="w-12" height="h-12" className="rounded-full" />
      <SkeletonLoader width="w-full" height="h-4" />
      <SkeletonLoader width="w-3/4" height="h-4" />
      <SkeletonLoader width="w-1/2" height="h-6" />
    </div>
  );
}
```

**Result:** Pulsing skeleton that matches content layout

---

## 11. ConfettiBurst - Success Animation

**Use Case:** Payment success, booking confirmation

```tsx
import { ConfettiBurst } from '@/components/ui/3d-components';
import { useState } from 'react';

export function PaymentSuccess() {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handlePayment = async () => {
    // Process payment
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };
  
  return (
    <>
      {showConfetti && <ConfettiBurst />}
      
      <button onClick={handlePayment} className="btn btn-primary">
        Pay Now
      </button>
    </>
  );
}
```

**Result:** Confetti particles burst from center and fade out

---

## 12. ParallaxContainer - Parallax Scroll

**Use Case:** Hero sections, background effects

```tsx
import { ParallaxContainer } from '@/components/ui/3d-components';

export function HeroWithParallax() {
  return (
    <ParallaxContainer offset={50}>
      <div className="h-96 bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">TezHealth</h1>
      </div>
    </ParallaxContainer>
  );
}
```

**Result:** Background moves slower than foreground on scroll

---

## 13. RippleButton - Ripple Click Effect

**Use Case:** Primary buttons, CTAs

```tsx
import { RippleButton } from '@/components/ui/3d-components';

export function BookingButton() {
  return (
    <RippleButton
      onClick={() => console.log('Booking started')}
      className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
    >
      Book a Nurse
    </RippleButton>
  );
}
```

**Result:** Ripple effect spreads from click point

---

## 🎨 COMPLETE PAGE EXAMPLE

Here's how to combine multiple 3D components:

```tsx
import { 
  Card3D, 
  GlassCard, 
  FloatingActionButton,
  AnimatedCounter,
  PulsingBadge,
  ConfettiBurst
} from '@/components/ui/3d-components';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function PatientDashboard() {
  const [showConfetti, setShowConfetti] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Hero with Glass Card */}
      <GlassCard className="p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Good morning, Rajesh! 👋
        </h1>
        <p className="text-white/80">March 25, 2026</p>
      </GlassCard>

      {/* Active Booking with Pulsing Badge */}
      <Card3D className="p-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Deepa R.</p>
            <p className="text-sm text-muted-foreground">Wound Care</p>
          </div>
          <PulsingBadge color="bg-success">🟢 En Route</PulsingBadge>
        </div>
      </Card3D>

      {/* Stats with Animated Counters */}
      <div className="grid grid-cols-2 gap-4">
        <Card3D className="p-4 bg-card text-center">
          <p className="text-muted-foreground text-sm">Active Bookings</p>
          <p className="text-3xl font-bold mt-2">
            <AnimatedCounter value={2} />
          </p>
        </Card3D>
        
        <Card3D className="p-4 bg-card text-center">
          <p className="text-muted-foreground text-sm">Prescriptions</p>
          <p className="text-3xl font-bold mt-2">
            <AnimatedCounter value={5} />
          </p>
        </Card3D>
      </div>

      {/* Confetti on success */}
      {showConfetti && <ConfettiBurst />}
      
      <button
        onClick={() => setShowConfetti(true)}
        className="w-full py-3 bg-primary text-white rounded-lg font-medium"
      >
        Celebrate Success
      </button>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Plus}
        onClick={() => console.log('Book nurse')}
        label="Book Nurse"
      />
    </div>
  );
}
```

---

## 🎯 COMPONENT SELECTION GUIDE

| Component | Best For | Example |
|-----------|----------|---------|
| Card3D | Feature cards, nurse cards, booking cards | Hover effect for engagement |
| GlassCard | Modals, overlays, premium sections | Modern, premium feel |
| FloatingActionButton | Quick actions, primary CTA | Bottom-right corner |
| AnimatedCounter | Stats, KPIs, numbers | Dashboard cards |
| AnimatedProgressBar | Progress, steps, usage | Booking steps, subscription |
| PulsingBadge | Status, alerts, notifications | Online status, urgent alerts |
| AnimatedTabIndicator | Tab navigation | Booking filters, status tabs |
| GradientBackground | Hero sections, backgrounds | Landing page hero |
| FloatingNotification | Alerts, success messages | Toast notifications |
| SkeletonLoader | Loading states | First page load |
| ConfettiBurst | Success celebrations | Payment success, booking confirmed |
| ParallaxContainer | Scroll effects, depth | Hero sections |
| RippleButton | Primary buttons, CTAs | Book button, submit button |

---

## 💡 BEST PRACTICES

1. **Don't overuse 3D effects** — Use sparingly for key interactions
2. **Performance first** — Test on mobile devices
3. **Accessibility** — Ensure animations don't interfere with screen readers
4. **Consistency** — Use same animation timing across app
5. **Mobile-friendly** — Reduce animation complexity on mobile
6. **Fallbacks** — Provide non-animated alternatives
7. **Testing** — Test animations on various devices

---

## 🚀 QUICK INTEGRATION

To use 3D components in any page:

```tsx
// 1. Import
import { Card3D, FloatingActionButton } from '@/components/ui/3d-components';

// 2. Use in component
export function MyPage() {
  return (
    <>
      <Card3D className="p-6">
        <h1>My Content</h1>
      </Card3D>
      
      <FloatingActionButton icon={Plus} onClick={() => {}} />
    </>
  );
}
```

That's it! All animations are built-in.

---

**Ready to make your frontend look amazing? Start using these components!** ✨
