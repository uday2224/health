import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookNurse from "./pages/patient/BookNurse";
import MyBookings from "./pages/patient/MyBookings";
import Prescriptions from "./pages/patient/Prescriptions";
import Subscriptions from "./pages/patient/Subscriptions";
import PatientPayments from "./pages/patient/PatientPayments";
import PatientProfile from "./pages/patient/PatientProfile";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import NurseJobs from "./pages/nurse/NurseJobs";
import NurseEarnings from "./pages/nurse/NurseEarnings";
import NurseProfile from "./pages/nurse/NurseProfile";
import NurseOnboarding from "./pages/nurse/NurseOnboarding";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNurses from "./pages/admin/AdminNurses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<DashboardLayout role="patient" />}>
              <Route path="/patient/dashboard" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
              <Route path="/patient/book-nurse" element={<ProtectedRoute requiredRole="patient"><BookNurse /></ProtectedRoute>} />
              <Route path="/patient/my-bookings" element={<ProtectedRoute requiredRole="patient"><MyBookings /></ProtectedRoute>} />
              <Route path="/patient/prescriptions" element={<ProtectedRoute requiredRole="patient"><Prescriptions /></ProtectedRoute>} />
              <Route path="/patient/subscriptions" element={<ProtectedRoute requiredRole="patient"><Subscriptions /></ProtectedRoute>} />
              <Route path="/patient/payments" element={<ProtectedRoute requiredRole="patient"><PatientPayments /></ProtectedRoute>} />
              <Route path="/patient/profile" element={<ProtectedRoute requiredRole="patient"><PatientProfile /></ProtectedRoute>} />
            </Route>

            <Route element={<DashboardLayout role="nurse" />}>
              <Route path="/nurse/onboarding" element={<ProtectedRoute requiredRole="nurse"><NurseOnboarding /></ProtectedRoute>} />
              <Route path="/nurse/dashboard" element={<ProtectedRoute requiredRole="nurse"><NurseDashboard /></ProtectedRoute>} />
              <Route path="/nurse/jobs" element={<ProtectedRoute requiredRole="nurse"><NurseJobs /></ProtectedRoute>} />
              <Route path="/nurse/earnings" element={<ProtectedRoute requiredRole="nurse"><NurseEarnings /></ProtectedRoute>} />
              <Route path="/nurse/profile" element={<ProtectedRoute requiredRole="nurse"><NurseProfile /></ProtectedRoute>} />
            </Route>

            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/nurses" element={<ProtectedRoute requiredRole="admin"><AdminNurses /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
