
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const BottomNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const publicNavItems = [
    { name: 'Inicio', path: '/home', icon: <Home className="w-5 h-5" /> },
    { name: 'Último', path: '/last-minute', icon: <Clock className="w-5 h-5" /> },
  ];

  const privateNavItems = [
    { name: 'Partidos', path: '/my-matches', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Perfil', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = [...publicNavItems, ...(isLoggedIn ? privateNavItems : [])];

  if (isLoading) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-border">
        <div className="flex justify-around items-center h-16">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-12 h-2 mt-1 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-border">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div 
                className={cn(
                  'flex flex-col items-center justify-center transition-all duration-200',
                  isActive ? 'text-fuchiball-green scale-110' : 'text-gray-500'
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
