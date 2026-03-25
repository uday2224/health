import { motion } from 'framer-motion';
import React from 'react';

/**
 * 3D Card with hover tilt effect
 */
export function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateXVal = ((y - rect.height / 2) / rect.height) * 10;
    const rotateYVal = ((x - rect.width / 2) / rect.width) * -10;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 60 }}
      className={`rounded-card shadow-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glassmorphism Card
 */
export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`rounded-card backdrop-blur-md bg-white/10 border border-white/20 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Floating Action Button
 */
export function FloatingActionButton({
  icon: Icon,
  onClick,
  label = '',
  color = 'bg-primary',
}: {
  icon: React.ComponentType<{ className: string }>;
  onClick: () => void;
  label?: string;
  color?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div className="fixed bottom-6 right-6 z-40">
      {/* Secondary actions */}
      {isOpen && (
        <motion.div
          className="absolute bottom-20 right-0 space-y-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {[
            { icon: '📅', label: 'Book' },
            { icon: '💊', label: 'Prescription' },
            { icon: '⭐', label: 'Reviews' },
          ].map((action, i) => (
            <motion.button
              key={i}
              className="w-12 h-12 rounded-full bg-secondary shadow-lg flex items-center justify-center text-lg hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {action.icon}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full ${color} text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-6 h-6" />
      </motion.button>

      {/* Tooltip */}
      {label && (
        <motion.div
          className="absolute bottom-16 right-0 bg-foreground text-background px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Animated Counter
 */
export function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * Animated Progress Bar
 */
export function AnimatedProgressBar({ value, max = 100, color = 'bg-primary' }: { value: number; max?: number; color?: string }) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * Pulsing Badge
 */
export function PulsingBadge({ children, color = 'bg-success' }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.div
      className={`${color} text-white px-3 py-1 rounded-full text-xs font-medium`}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Tab Indicator
 */
export function AnimatedTabIndicator({ activeIndex, tabCount }: { activeIndex: number; tabCount: number }) {
  const width = 100 / tabCount;
  const left = activeIndex * width;

  return (
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-primary"
      initial={{ left: `${left}%`, width: `${width}%` }}
      animate={{ left: `${left}%`, width: `${width}%` }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  );
}

/**
 * Gradient Animated Background
 */
export function GradientBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ backgroundSize: '200% 200%' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Floating Notification
 */
export function FloatingNotification({
  message,
  icon = '🔔',
  onClose,
}: {
  message: string;
  icon?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed top-6 right-6 bg-card rounded-card shadow-lg p-4 flex items-center gap-3 max-w-sm z-50"
      initial={{ opacity: 0, y: -20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <motion.button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ✕
      </motion.button>
    </motion.div>
  );
}

/**
 * Skeleton Loader with Shimmer
 */
export function SkeletonLoader({ width = 'w-full', height = 'h-4', className = '' }: { width?: string; height?: string; className?: string }) {
  return (
    <motion.div
      className={`${width} ${height} bg-muted rounded-lg overflow-hidden ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}

/**
 * Confetti Burst Animation
 */
export function ConfettiBurst() {
  const confetti = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.2,
    duration: 2 + Math.random() * 1,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-2 bg-primary rounded-full"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: item.x,
            y: item.y,
            opacity: 0,
            scale: 0,
            rotate: item.rotate,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeOut',
          }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
}

/**
 * Parallax Scroll Container
 */
export function ParallaxContainer({
  children,
  offset = 50,
}: {
  children: React.ReactNode;
  offset?: number;
}) {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{ y: scrollY * (offset / 100) }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Ripple Button Effect
 */
export function RippleButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples([...ripples, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    onClick?.();
  };

  return (
    <button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
}
