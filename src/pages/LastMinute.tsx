import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import MatchCard, { Match } from '@/components/MatchCard/MatchCard';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import FootballLoader from '@/components/ui/FootballLoader';
import { formatInTimeZone } from 'date-fns-tz';


const TIMEZONE = 'America/Lima';


const LastMinute = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLastMinuteMatches = async () => {
      try {
        // Get current date and time in Peru timezone
        const now = new Date();
        const currentDate = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");
        const currentTime = formatInTimeZone(now, TIMEZONE, "HH:mm");
    
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .eq('status', 'active')
          .eq('is_last_minute', true)
          .gt('available_spots', 0)
          .or(
            `and(date.gt.${currentDate}),` + // Future dates
            `and(date.eq.${currentDate},time.gte.${currentTime})` // Today's matches that haven't started
          )
          .order('date', { ascending: true })
          .order('time', { ascending: true });
    
        if (error) throw error;
    
        setMatches(data || []);
      } catch (error: any) {
        toast.error('Error al cargar los partidos', { duration: 2000 });
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastMinuteMatches();
  }, []);

  if (loading) {
    return <FootballLoader />;
  }

  return (
    <AnimatedRoute>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-fuchiball-black">Partidos de Último Minuto</h1>
            <p className="text-gray-500">Aprovecha los descuentos especiales</p>
          </div>
          
          {/* Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-fuchiball-gold to-fuchiball-lightGold rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start">
              <div className="bg-white rounded-full p-3 mr-4">
                <Clock className="text-fuchiball-gold w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">¡Únete a la pichanga de última hora!</h3>
                <p className="text-white/80 text-sm">
                  Cupos liberados con descuentos especiales. ¡Date prisa, se acaban rápido!
                </p>
              </div>
            </div>
          </motion.div>
          
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
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <MatchCard match={match} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No hay pichangas de último minuto</h3>
                  <p className="text-gray-500">Intenta más tarde, los cupos se liberan constantemente</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
        <BottomNav />
      </div>
    </AnimatedRoute>
  );
};

export default LastMinute;