
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Inicio', path: '/home', icon: <Home className="w-5 h-5" /> },
    { name: 'Último Minuto', path: '/last-minute', icon: <Clock className="w-5 h-5" /> },
    { name: 'Mis Partidos', path: '/my-matches', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Perfil', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'navbar-blur py-2' : 'bg-transparent py-4'
    )}>
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
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-fuchiball-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-white">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center space-x-2 p-4 rounded-xl font-medium text-lg',
                  location.pathname === item.path 
                    ? 'bg-fuchiball-green/10 text-fuchiball-green' 
                    : 'text-fuchiball-black'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
