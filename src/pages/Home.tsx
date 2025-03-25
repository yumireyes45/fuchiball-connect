
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import MatchCard, { Match } from '@/components/MatchCard/MatchCard';
import { Search, MapPin, Calendar, Star, Filter, Football } from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import AnimatedRoute from '@/components/ui/AnimatedRoute';

// Mock data for matches
const mockMatches: Match[] = [
  {
    id: '1',
    title: 'Pichanga en La Bombonera',
    location: 'La Molina, Lima',
    time: '7:00 PM',
    date: 'Hoy',
    availableSpots: 3,
    totalSpots: 10,
    price: 35,
    level: 'Intermedio'
  },
  {
    id: '2',
    title: 'Partido Amistoso',
    location: 'Miraflores, Lima',
    time: '8:30 PM',
    date: 'Hoy',
    availableSpots: 2,
    totalSpots: 12,
    price: 40,
    level: 'Avanzado'
  },
  {
    id: '3',
    title: 'Pichanga Familiar',
    location: 'San Borja, Lima',
    time: '6:00 PM',
    date: 'Mañana',
    availableSpots: 5,
    totalSpots: 14,
    price: 30,
    level: 'Básico'
  },
  {
    id: '4',
    title: 'Partido Rápido',
    location: 'Surco, Lima',
    time: '9:00 PM',
    date: 'Mañana',
    availableSpots: 1,
    totalSpots: 10,
    price: 45,
    level: 'Intermedio'
  }
];

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  }, []);

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: <Football size={16} /> },
    { id: 'location', label: 'Cercanos', icon: <MapPin size={16} /> },
    { id: 'today', label: 'Hoy', icon: <Calendar size={16} /> },
    { id: 'level', label: 'Mi nivel', icon: <Star size={16} /> },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  return (
    <AnimatedRoute>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-fuchiball-black">Partidos Disponibles</h1>
              <p className="text-gray-500">Encuentra tu próximo partido</p>
            </div>
            <CustomButton 
              variant="outline"
              size="sm"
              icon={<Filter size={16} />}
            >
              Filtros
            </CustomButton>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar partido o ubicación..."
              className="premium-input pl-12 py-4"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                className={`flex items-center space-x-1 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all ${
                  activeFilter === filter.id
                    ? 'bg-fuchiball-green text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
          
          {/* Match List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        <BottomNav />
      </div>
    </AnimatedRoute>
  );
};

export default Home;
