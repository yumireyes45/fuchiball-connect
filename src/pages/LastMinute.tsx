
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import MatchCard, { Match } from '@/components/MatchCard/MatchCard';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { Clock } from 'lucide-react';

// Mock data for last minute matches
const mockLastMinuteMatches: Match[] = [
  {
    id: '1lm',
    title: 'Partido Relámpago',
    location: 'Surquillo, Lima',
    time: '9:30 PM',
    date: 'Hoy',
    availableSpots: 2,
    totalSpots: 10,
    price: 40,
    level: 'Intermedio',
    isLastMinute: true,
    discountPercentage: 25
  },
  {
    id: '2lm',
    title: 'Pichanga Nocturna',
    location: 'San Isidro, Lima',
    time: '10:00 PM',
    date: 'Hoy',
    availableSpots: 3,
    totalSpots: 12,
    price: 50,
    level: 'Avanzado',
    isLastMinute: true,
    discountPercentage: 30
  },
  {
    id: '3lm',
    title: 'Fútbol Express',
    location: 'Jesús María, Lima',
    time: '8:30 PM',
    date: 'Hoy',
    availableSpots: 1,
    totalSpots: 8,
    price: 35,
    level: 'Básico',
    isLastMinute: true,
    discountPercentage: 20
  }
];

const LastMinute = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatches(mockLastMinuteMatches);
      setLoading(false);
    }, 1000);
  }, []);

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
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No hay partidos disponibles</h3>
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
