import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import MatchCard, { Match } from '@/components/MatchCard/MatchCard';
import { Search, MapPin, Calendar, Star, Filter, Layers } from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import FootballLoader from '@/components/ui/FootballLoader';
import { formatInTimeZone } from 'date-fns-tz';


const TIMEZONE = 'America/Lima'; // Define the timezone for Peru

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {

    const fetchMatches = async () => {
      try {
        // Get current date and time in Peru timezone
        const now = new Date();
        const currentDate = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");
        const currentTime = formatInTimeZone(now, TIMEZONE, "HH:mm");
    
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .eq('status', 'active')
          .or(
            `and(date.gt.${currentDate}),` + // Future dates
            `and(date.eq.${currentDate},time.gte.${currentTime})` // Today's matches that haven't started
          )
          .order('date', { ascending: true })
          .order('time', { ascending: true });
    
        if (error) throw error;
    
        if (data) {
          setMatches(data);
        }
      } catch (error: any) {
        toast.error('Error al cargar los partidos', { duration: 2000 });
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <FootballLoader />;
  }

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: <Layers size={16} /> },
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
          {/*<Search className="absolute item-left left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />*/}
            <input
              type="text"
              className="premium-input py-4"
              placeholder="Buscar partido o ubicación..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            
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
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
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
