import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TezLogo } from "@/components/TezLogo";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, Brain, MapPin, CreditCard,
  ChevronRight, Star, ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stats = [
  { label: "Verified Nurses", value: "500+" },
  { label: "Bookings", value: "10,000+" },
  { label: "Rating", value: "4.8★" },
];

const steps = [
  { num: 1, title: "Upload Prescription", desc: "Snap a photo of your prescription and our AI extracts the details." },
  { num: 2, title: "Choose Your Nurse", desc: "Browse verified nurses by specialization, rating, and availability." },
  { num: 3, title: "Nurse Arrives", desc: "Track your nurse in real-time as they arrive at your doorstep." },
];

const features = [
  { icon: ShieldCheck, title: "Verified Nurses", desc: "Every nurse is license-verified and background checked.", color: "text-primary" },
  { icon: Brain, title: "AI Prescriptions", desc: "Upload prescriptions and let AI extract medicine details instantly.", color: "text-secondary" },
  { icon: MapPin, title: "Live Tracking", desc: "Track your nurse in real-time with GPS-powered live maps.", color: "text-warning" },
  { icon: CreditCard, title: "Secure Payments", desc: "Pay securely via Stripe with instant receipts and refund support.", color: "text-success" },
];

const plans = [
  { name: "Weekly", price: "₹499", period: "/week", features: ["2 nurse visits", "Priority booking", "Cancel anytime"], popular: false },
  { name: "Monthly", price: "₹999", period: "/month", features: ["8 nurse visits", "Priority booking", "Free doctor consultation", "Cancel anytime"], popular: true, save: "Save 20%" },
  { name: "Quarterly", price: "₹2,499", period: "/quarter", features: ["25 visits", "All monthly benefits", "Dedicated nurse assignment"], popular: false, badge: "Best Value" },
];

const testimonials = [
  { name: "Ananya R.", rating: 5, quote: "TezHealth made it so easy to get post-surgery care at home. The nurse was incredibly professional." },
  { name: "Mohan K.", rating: 5, quote: "My mother needed daily IV therapy. TezHealth's nurses were punctual and caring every single day." },
  { name: "Sneha P.", rating: 4, quote: "The AI prescription feature is amazing! It saved me so much time explaining medicines to the nurse." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <TezLogo />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#why-tez" className="hover:text-foreground transition-colors">Why TezHealth</a>
            <a href="#plans" className="hover:text-foreground transition-colors">Plans</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.07]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Hospital-quality care,{" "}
              <span className="text-primary">at your doorstep</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Book verified home nurses in under 2 minutes. Professional healthcare delivered with trust and care.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link to="/patient/book-nurse">
                <Button size="lg" className="gap-2 px-8 rounded-lg shadow-card">
                  Book a Nurse <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="gap-2 px-8 rounded-lg">
                  I'm a Nurse <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats ticker */}
            <motion.div
              className="mt-12 flex items-center justify-center gap-6 md:gap-10 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">How It Works</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-lg mx-auto">Book a verified home nurse in 3 simple steps</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center p-6 rounded-card bg-background shadow-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TezHealth */}
      <section id="why-tez" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">Why TezHealth?</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3">Trusted by thousands of families across Karnataka</motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-card bg-card shadow-card hover:shadow-card-hover transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <f.icon className={`w-8 h-8 ${f.color} mb-4`} />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">Subscription Plans</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3">Choose a plan that fits your care needs</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative p-6 rounded-card bg-background shadow-card ${plan.popular ? "ring-2 ring-primary" : ""}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-pill">
                    Most Popular
                  </span>
                )}
                {plan.badge && (
                  <span className="absolute -top-3 right-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-pill">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                {plan.save && <span className="text-xs font-medium text-secondary mt-1 inline-block">{plan.save}</span>}
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[10px]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                  {plan.popular ? "Subscribe Now" : "Subscribe"}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-14">What Patients Say</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-80 p-6 rounded-card bg-card shadow-card snap-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic mb-4">"{t.quote}"</p>
                <p className="text-sm font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <TezLogo />
              <p className="text-sm text-muted-foreground mt-3">Hospital care, home delivered.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Available in</h4>
              <div className="flex flex-wrap gap-2">
                {["Shimoga", "Bangalore", "Mysore"].map((c) => (
                  <span key={c} className="px-3 py-1 text-xs font-medium bg-muted rounded-pill">{c}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © 2026 TezHealth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
