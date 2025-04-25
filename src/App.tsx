
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NotFound from "./pages/NotFound";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import LastMinute from "./pages/LastMinute";
import MatchDetail from "./pages/MatchDetail";
import Confirmation from "./pages/Confirmation";
import MyMatches from "./pages/MyMatches";
import Profile from "./pages/Profile";
import AuthCallback from '@/pages/AuthCallback';
import CreateMatch from '@/pages/CreateMatch';
import AdminDashboard from '@/pages/AdminDashboard'; 
import EditMatch from '@/pages/EditMatch'; // Ajusta si está en otra carpeta
import OAuthCallback from '@/components/Auth/OAuthCallback';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import PaymentVerification from "./pages/PaymentVerification";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/last-minute" element={<LastMinute />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/my-matches" element={<MyMatches />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/crear-partido" element={<CreateMatch />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/editar-partido/:id" element={<EditMatch />} />
              <Route path="/admin/payment-verification" element={<PaymentVerification />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
