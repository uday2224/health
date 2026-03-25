import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { mockBookings, mockPrescriptions, currentUser } from "@/lib/mock-data";
import {
  Stethoscope, FileText, Calendar, Package, MapPin, ArrowRight, Clock, Plus, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const activeBooking = mockBookings.find((b) => b.patientId === currentUser.id && b.status === "IN_PROGRESS");

const stats = [
  { label: "Active", value: mockBookings.filter((b) => b.patientId === currentUser.id && ["IN_PROGRESS", "CONFIRMED"].includes(b.status)).length, icon: Calendar, color: "border-l-primary" },
  { label: "Upcoming", value: mockBookings.filter((b) => b.patientId === currentUser.id && b.status === "CONFIRMED").length, icon: Clock, color: "border-l-secondary" },
  { label: "Prescriptions", value: mockPrescriptions.filter((p) => p.patientId === currentUser.id).length, icon: FileText, color: "border-l-warning" },
  { label: "Plan", value: "Monthly", icon: Package, color: "border-l-accent" },
];

const quickActions = [
  { label: "Book Nurse", icon: Stethoscope, to: "/patient/book-nurse", color: "bg-primary/10 text-primary" },
  { label: "Upload Rx", icon: FileText, to: "/patient/prescriptions", color: "bg-secondary/10 text-secondary" },
  { label: "My Bookings", icon: Calendar, to: "/patient/my-bookings", color: "bg-warning/10 text-warning" },
  { label: "My Plan", icon: Package, to: "/patient/subscriptions", color: "bg-info/10 text-info" },
];

export default function PatientDashboard() {
  const [fabOpen, setFabOpen] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <AppHeader title="Dashboard" showMenu />
      <div className="p-4 md:p-6 space-y-6 max-w-4xl pb-24">
        {/* Greeting */}
        <motion.div
          className="gradient-hero rounded-card p-6 text-primary-foreground relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute w-40 h-40 bg-white rounded-full blur-3xl"
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ top: "-20px", right: "-20px" }}
            />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm opacity-80">{new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>
            <h2 className="text-2xl font-bold mt-1">{greeting}, {currentUser.name.split(" ")[0]}!</h2>
            <div className="flex gap-3 mt-4">
              <Link to="/patient/book-nurse">
                <Button size="sm" variant="secondary" className="rounded-lg gap-1.5">
                  <Stethoscope className="w-4 h-4" /> Book a Nurse
                </Button>
              </Link>
              <Link to="/patient/prescriptions">
                <Button size="sm" variant="outline" className="rounded-lg gap-1.5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <FileText className="w-4 h-4" /> Upload Rx
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Active Booking Banner */}
        {activeBooking && (
          <motion.div
            className="bg-gradient-to-r from-success/10 to-success/5 rounded-card shadow-card p-4 border border-success/30 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-semibold text-sm border border-secondary/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeBooking.nurseName?.charAt(0)}
                </motion.div>
                <div>
                  <p className="font-semibold text-sm">{activeBooking.nurseName}</p>
                  <StatusBadge status={activeBooking.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />~12 min away</span>
                <Link to="/patient/my-bookings">
                  <Button size="sm" variant="outline" className="mt-1 rounded-lg text-xs gap-1">
                    Track Live <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`bg-card rounded-card shadow-card p-4 border-l-4 ${s.color} hover:shadow-lg transition-all cursor-pointer group`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <s.icon className="w-5 h-5 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((a, idx) => (
              <Link key={a.label} to={a.to}>
                <motion.div
                  className="bg-card rounded-card shadow-card p-4 hover:shadow-lg transition-all text-center group cursor-pointer"
                  whileHover={{ y: -6, scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${a.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium">{a.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Prescriptions</h3>
            <Link to="/patient/prescriptions" className="text-sm text-primary font-medium hover:underline">View All →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockPrescriptions.filter((p) => p.patientId === currentUser.id).map((rx, idx) => (
              <motion.div
                key={rx.id}
                className="flex-shrink-0 w-48 bg-card rounded-card shadow-card p-3 hover:shadow-lg transition-all group cursor-pointer"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-full h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-2 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                  <FileText className="w-6 h-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs text-muted-foreground">{rx.date}</p>
                <p className="text-sm font-medium">{rx.medicineCount} medicines</p>
                <StatusBadge status={rx.status} className="mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          animate={{ rotate: fabOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => setFabOpen(!fabOpen)}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* FAB Menu Items */}
        {fabOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/patient/book-nurse">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 justify-end"
              >
                <span className="bg-card rounded-lg px-3 py-1 text-sm font-medium shadow-md whitespace-nowrap">Book Nurse</span>
                <Button size="icon" className="rounded-full w-12 h-12 shadow-lg" variant="secondary">
                  <Stethoscope className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/patient/prescriptions">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 justify-end"
              >
                <span className="bg-card rounded-lg px-3 py-1 text-sm font-medium shadow-md whitespace-nowrap">Upload Rx</span>
                <Button size="icon" className="rounded-full w-12 h-12 shadow-lg" variant="secondary">
                  <FileText className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/patient/my-bookings">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 justify-end"
              >
                <span className="bg-card rounded-lg px-3 py-1 text-sm font-medium shadow-md whitespace-nowrap">My Bookings</span>
                <Button size="icon" className="rounded-full w-12 h-12 shadow-lg" variant="secondary">
                  <Calendar className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Notification Badge */}
      <motion.div
        className="fixed top-20 right-6 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="bg-card rounded-full p-3 shadow-lg border border-primary/20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bell className="w-5 h-5 text-primary" />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-white text-xs font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            2
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
