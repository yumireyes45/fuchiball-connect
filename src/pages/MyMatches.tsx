
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import { Calendar, Search } from 'lucide-react';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { cn } from '@/lib/utils';

interface MyMatch {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  confirmationCode?: string;
}

const mockMatches: MyMatch[] = [
  {
    id: '1',
    title: 'Pichanga en La Bombonera',
    location: 'La Molina, Lima',
    date: '15 de Julio',
    time: '7:00 PM',
    status: 'upcoming',
    confirmationCode: 'FBC-1234'
  },
  {
    id: '2',
    title: 'Partido Amistoso',
    location: 'Miraflores, Lima',
    date: '10 de Julio',
    time: '8:30 PM',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Fútbol 7 Intenso',
    location: 'San Borja, Lima',
    date: '5 de Julio',
    time: '6:00 PM',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Pichanga Cancelada',
    location: 'Surco, Lima',
    date: '1 de Julio',
    time: '9:00 PM',
    status: 'cancelled'
  }
];

const MyMatches = () => {
  const [matches, setMatches] = useState<MyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         match.location.toLowerCase().includes(searchValue.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return matchesSearch && match.status === 'upcoming';
    } else {
      return matchesSearch && (match.status === 'completed' || match.status === 'cancelled');
    }
  });

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
                  activeTab === 'upcoming'
                    ? 'bg-fuchiball-green text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('upcoming')}
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
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div 
                      className={cn(
                        "bg-white rounded-xl p-4 shadow-sm",
                        match.status === 'upcoming' ? 'border-l-4 border-fuchiball-green' :
                        match.status === 'completed' ? 'border-l-4 border-gray-300' :
                        'border-l-4 border-red-400'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{match.title}</h3>
                        <div 
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            match.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                            match.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          )}
                        >
                          {match.status === 'upcoming' ? 'Próximo' :
                           match.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        <div>{match.location}</div>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{match.date} • {match.time}</span>
                        </div>
                      </div>
                      
                      {match.status === 'upcoming' && match.confirmationCode && (
                        <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                          <span className="text-gray-500">Código: </span>
                          <span className="font-mono font-medium">{match.confirmationCode}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {activeTab === 'upcoming' ? 'No tienes partidos próximos' : 'No tienes partidos en el historial'}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'upcoming' ? 'Reserva tu primer partido' : 'Juega tu primer partido'}
                  </p>
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

export default MyMatches;
