
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import { Calendar, Search } from 'lucide-react';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { cn } from '@/lib/utils';
import FootballLoader from '@/components/ui/FootballLoader';
import { format, parseISO, isAfter } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';

interface MyMatch {
  id: string;
  match_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled' | 'finished';
  code: string;
  joined_at: string;
  matches: {
    title: string;
    location: string;
    date: string;
    time: string;
    level: string;
    price: number;
  };
}

const TIMEZONE = 'America/Lima';

const MyMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'confirmed' | 'completed'>('confirmed');
  const [searchValue, setSearchValue] = useState('');

  const fetchUserMatches = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error('No has iniciado sesión');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('match_participants')
        .select(`
          id,
          match_id,
          user_id,
          status,
          code,
          joined_at,
          cancelled_at,
          finished_at,
          matches!match_participants_match_id_fkey(
            title,
            location,
            date,
            time,
            level,
            price
          )
        `)
        .eq('user_id', session.user.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map((match: any) => ({
          ...match,
          matches: Array.isArray(match.matches) ? match.matches[0] : match.matches,
        }));

        // Update status for completed matches
        const updatedData = await Promise.all(
          formattedData.map(async (match) => {
            const wasUpdated = await updateMatchStatus(match);
            return wasUpdated ? { ...match, status: 'finished' } : match;
          })
        );

        setMatches(formattedData);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al cargar tus partidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMatches();
  }, [navigate]);


  // Add this function after the existing imports
const updateMatchStatus = async (match: MyMatch) => {
  const now = new Date();
  const matchDateTime = `${match.matches.date}T${match.matches.time}`;
  const currentTimePeru = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd'T'HH:mm");
  
  // If match is in the past and still confirmed, update to finished
  if (matchDateTime < currentTimePeru && match.status === 'confirmed') {
    const { error } = await supabase
      .from('match_participants')
      .update({ 
        status: 'finished',
        finished_at: new Date().toISOString()
      })
      .eq('id', match.id);

    if (error) {
      console.error('Error updating match status:', error);
    }
    return true;
  }
  return false;
};

  const handleCancelMatch = async (matchId: string) => {
    try {
      // Update participation status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error('No has iniciado sesión');
        return;
      }

      const { error: updateError } = await supabase
        .from('match_participants')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('match_id', matchId)
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      // Increment available spots in match
      const { error: spotError } = await supabase
        .rpc('increment_available_spots', { match_id: matchId });

      if (spotError) throw spotError;

      toast.success('Partido cancelado exitosamente');
      fetchUserMatches(); // Refresh list
    } catch (error) {
      toast.error('Error al cancelar el partido');
    }
  };


  // Update UI rendering
  const getStatusBadge = (match: MyMatch) => {
    const isUpcoming = isMatchUpcoming(match);
    
    if (match.status === 'cancelled') return {
      text: 'Cancelado',
      className: 'bg-red-100 text-red-800'
    };
    
    if (match.status === 'finished' || !isUpcoming) return {
      text: 'Finalizado',
      className: 'bg-gray-100 text-gray-800'
    };
    
    return {
      text: 'Próximo',
      className: 'bg-green-100 text-green-800'
    };
  };


  const isMatchUpcoming = (match: MyMatch) => {
    const now = new Date();
    const matchDateTime = `${match.matches.date}T${match.matches.time}`;
    
    // Format current time in Peru timezone
    const currentTimePeru = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd'T'HH:mm");
    
    // Compare timestamps
    return matchDateTime > currentTimePeru;
  };
  

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.matches.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      match.matches.location.toLowerCase().includes(searchValue.toLowerCase());

    const isUpcoming = isMatchUpcoming(match);
    
    if (activeTab === 'confirmed') {
      return matchesSearch && isUpcoming && match.status === 'confirmed';
    } else {
      return matchesSearch && (!isUpcoming || match.status === 'cancelled' || match.status === 'finished');
    }
  });

  const formatMatchDate = (date: string, time: string) => {
    return formatInTimeZone(
      `${date}T${time}`, 
      TIMEZONE,
      "d 'de' MMMM 'a las' h:mm a",
      { locale: es }
    );
  };

  if (loading) {
    return <FootballLoader />;
  }

  return (
    <AnimatedRoute>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-fuchiball-black">Mis Partidos</h1>
            <p className="text-gray-500">Historial de tus partidos registrados</p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-full p-1 shadow-sm mb-6">
            <div className="flex">
              <button
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'confirmed'
                    ? 'bg-fuchiball-green text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('confirmed')}
              >
                Próximos
              </button>
              <button
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'completed'
                    ? 'bg-fuchiball-green text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('completed')}
              >
                Historial
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar partido..."
              className="premium-input pl-12"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          {/* Match List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl h-28 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div 
                    className={cn(
                      "bg-white rounded-xl p-4 shadow-sm",
                      isMatchUpcoming(match) && match.status === 'confirmed'
                        ? 'border-l-4 border-fuchiball-green'
                        : match.status === 'cancelled'
                        ? 'border-l-4 border-red-400'
                        : match.status === 'finished'
                        ? 'border-l-4 border-gray-300'
                        : 'border-l-4 border-gray-300'
                        
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{match.matches.title}</h3>
                      <div 
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          isMatchUpcoming(match) && match.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : match.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : match.status === 'finished'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {isMatchUpcoming(match) && match.status === 'confirmed'
                        ? 'Próxima pichanga'
                        : match.status === 'cancelled'
                        ? 'Pichanga cancelada'
                        : match.status === 'finished'
                        ? 'Pichanga completada'
                        : 'Pichanga completada'}
                        </div>
                      </div>

                      
                    
                    <div className="text-sm text-gray-500 mb-3">
                      <div>{match.matches.location}</div>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {formatMatchDate(match.matches.date, match.matches.time)}
                        </span>
                      </div>
                    </div>
                    
                    {match.status === 'confirmed' && match.code && (
                      <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm mb-3">
                        <span className="text-gray-500">Código: </span>
                        <span className="font-mono font-medium">{match.code}</span>
                      </div>
                    )}

                    {/* Add the cancel button here */}
                    {isMatchUpcoming(match) && match.status === 'confirmed' && (
                      <div className='flex justify-center'>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de cancelar tu participación?')) {
                            handleCancelMatch(match.match_id);
                          }
                        }}
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Cancelar participación
                      </button>
                    </div>
                    )}

                  </div>
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

export default MyMatches;
