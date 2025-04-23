
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const publicNavItems = [
    { name: 'Inicio', path: '/home', icon: <Home className="w-5 h-5" /> },
    { name: 'Último Minuto', path: '/last-minute', icon: <Clock className="w-5 h-5" /> },
  ];

  const privateNavItems = [
    { name: 'Mis Partidos', path: '/my-matches', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Perfil', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = [...publicNavItems, ...(isLoggedIn ? privateNavItems : [])];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4">

      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-2">
          <div className="bg-fuchiball-green rounded-lg p-1">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl text-fuchiball-black">Fuchiball</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              'flex items-center space-x-1 font-medium transition-all duration-200',
              location.pathname === item.path 
                ? 'text-fuchiball-green' 
                : 'text-fuchiball-black hover:text-fuchiball-green'
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        
        {!isLoggedIn && (
          <button
            type='button'
            onClick={() => navigate('/auth')}
            className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-5 focus:outline-none focus:ring-green-500 dark:focus:ring-green-800 shadow-lg shadow-green-800/40 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Iniciar sesión
          </button>
        )}
      </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-fuchiball-black focus:outline-none transition-all duration-200 hover:text-fuchiball-green"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="md:hidden fixed inset-0 z-40 pt-16 bg-white animate-fade-in"
        >
          {/* Close button at top right */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center space-x-2 p-4 rounded-xl font-medium text-lg transition-colors',
                  location.pathname === item.path 
                    ? 'bg-fuchiball-green/10 text-fuchiball-green' 
                    : 'text-fuchiball-black hover:bg-gray-50'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {!isLoggedIn && (
                    <button
                      type='button'
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/auth');
                      }}
                      className="flex items-center justify-center text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-5 focus:outline-none focus:ring-green-500 dark:focus:ring-green-800 shadow-lg shadow-green-800/40 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-5"
                    >
                      <User className="w-5 h-5 mr-2 " />
                      <span className='text-xl'>Iniciar sesión</span>
                    </button>
              )}
            
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
