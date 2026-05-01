import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";
import BookingDetail from "./pages/BookingDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderBookings from "./pages/provider/Bookings";
import ProviderAvailability from "./pages/provider/Availability";
import ProviderProfile from "./pages/provider/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminServices from "./pages/admin/Services";
import AdminCategories from "./pages/admin/Categories";
import AdminProviders from "./pages/admin/Providers";
import AdminCustomers from "./pages/admin/Customers";
import AdminBookings from "./pages/admin/Bookings";
import AdminReviews from "./pages/admin/Reviews";
import AdminSettings from "./pages/admin/Settings";
import CRMLogin from "./pages/crm/Login";
import CRMDashboard from "./pages/crm/Dashboard";
import Leads from "./pages/crm/Leads";
import Pipeline from "./pages/crm/Pipeline";
import FollowUps from "./pages/crm/FollowUps";
import Reports from "./pages/crm/Reports";
import CRMSettings from "./pages/crm/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/book/:id" element={<BookingForm />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider/bookings" element={<ProviderBookings />} />
          <Route path="/provider/availability" element={<ProviderAvailability />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/providers" element={<AdminProviders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="/crm/login" element={<CRMLogin />} />
          <Route path="/crm" element={<CRMDashboard />} />
          <Route path="/crm/leads" element={<Leads />} />
          <Route path="/crm/pipeline" element={<Pipeline />} />
          <Route path="/crm/followups" element={<FollowUps />} />
          <Route path="/crm/reports" element={<Reports />} />
          <Route path="/crm/settings" element={<CRMSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
