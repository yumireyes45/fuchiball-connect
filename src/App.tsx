
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NotFound from "./pages/NotFound";

// Import pages
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import LastMinute from "./pages/LastMinute";
import MatchDetail from "./pages/MatchDetail";
import Confirmation from "./pages/Confirmation";
import MyMatches from "./pages/MyMatches";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/last-minute" element={<LastMinute />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/my-matches" element={<MyMatches />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
