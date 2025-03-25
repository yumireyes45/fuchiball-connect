
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Star, 
  ArrowLeft,
  ChevronDown,
  CircleDollarSign,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomButton from '@/components/ui/custom-button';
import { toast } from 'sonner';
import { Match } from '@/components/MatchCard/MatchCard';
import AnimatedRoute from '@/components/ui/AnimatedRoute';

// Mock match data
const mockMatchDetails: Record<string, Match> = {
  '1': {
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
  '2': {
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
  // Add more match details as needed
};

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'card' | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    // Simulate API call to get match details
    setTimeout(() => {
      if (id && mockMatchDetails[id]) {
        setMatch(mockMatchDetails[id]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleJoin = () => {
    setShowPaymentOptions(true);
  };

  const handlePay = () => {
    if (!paymentMethod) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }

    // Simulate payment processing
    toast.loading('Procesando pago...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pago completado con éxito');
      navigate('/confirmation');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Partido no encontrado</h2>
          <p className="text-gray-500 mb-4">No pudimos encontrar los detalles de este partido</p>
          <CustomButton onClick={handleBack}>Volver</CustomButton>
        </div>
      </div>
    );
  }

  return (
    <AnimatedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-fuchiball-green text-white">
          <div className="container mx-auto px-4 py-14 pt-16 relative">
            <button 
              onClick={handleBack}
              className="absolute top-6 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <button 
              className="absolute top-6 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full"
              onClick={() => toast.info('Compartido con éxito')}
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center justify-center">
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  match.level === 'Básico' ? 'bg-blue-100 text-blue-800' :
                  match.level === 'Intermedio' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                )}>
                  {match.level}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-1">{match.title}</h1>
              
              <div className="flex items-center justify-center text-white/80 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{match.location}</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Match Details */}
        <div className="container mx-auto px-4 -mt-5">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                <Calendar className="w-6 h-6 text-fuchiball-green mb-2" />
                <span className="text-sm text-gray-500">Fecha</span>
                <span className="font-medium">{match.date}</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                <Clock className="w-6 h-6 text-fuchiball-green mb-2" />
                <span className="text-sm text-gray-500">Hora</span>
                <span className="font-medium">{match.time}</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                <Users className="w-6 h-6 text-fuchiball-green mb-2" />
                <span className="text-sm text-gray-500">Cupos</span>
                <span className="font-medium">{match.availableSpots} disponibles</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                <Star className="w-6 h-6 text-fuchiball-green mb-2" />
                <span className="text-sm text-gray-500">Nivel</span>
                <span className="font-medium">{match.level}</span>
              </div>
            </div>
            
            {/* Map placeholder */}
            <div className="mb-6 rounded-xl overflow-hidden h-48 bg-gray-200 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Mapa de ubicación</span>
            </div>
            
            {/* Price and buttons */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-gray-500 text-sm">Precio por persona</span>
                  <div className="font-bold text-2xl text-fuchiball-black">
                    S/ {match.price}
                  </div>
                </div>
                
                <CustomButton 
                  onClick={handleJoin}
                  size="lg"
                >
                  Unirme y pagar
                </CustomButton>
              </div>
              
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-medium mb-2">Descripción del partido</h3>
                <p className="text-gray-600 text-sm">
                  Partido amistoso con buen ambiente. La cancha cuenta con estacionamiento, vestuarios y duchas. Se juega en formato 7 vs 7.
                </p>
              </div>
              
              {/* Additional info */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-medium">90 minutos</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Formato</span>
                  <span className="font-medium">7 vs 7</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Incluye</span>
                  <span className="font-medium">Cancha, árbitro, petos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Selecciona método de pago</h2>
                <button 
                  onClick={() => setShowPaymentOptions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('yape')}
                  className={cn(
                    "w-full flex items-center p-4 border rounded-xl",
                    paymentMethod === 'yape' 
                      ? "border-fuchiball-green bg-fuchiball-green/5" 
                      : "border-gray-200"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <CircleDollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">Yape</div>
                    <div className="text-sm text-gray-500">Pago rápido con QR</div>
                  </div>
                  {paymentMethod === 'yape' && (
                    <div className="w-5 h-5 rounded-full bg-fuchiball-green text-white flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setPaymentMethod('plin')}
                  className={cn(
                    "w-full flex items-center p-4 border rounded-xl",
                    paymentMethod === 'plin' 
                      ? "border-fuchiball-green bg-fuchiball-green/5" 
                      : "border-gray-200"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CircleDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">Plin</div>
                    <div className="text-sm text-gray-500">Pago con teléfono</div>
                  </div>
                  {paymentMethod === 'plin' && (
                    <div className="w-5 h-5 rounded-full bg-fuchiball-green text-white flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "w-full flex items-center p-4 border rounded-xl",
                    paymentMethod === 'card' 
                      ? "border-fuchiball-green bg-fuchiball-green/5" 
                      : "border-gray-200"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <CircleDollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">Tarjeta</div>
                    <div className="text-sm text-gray-500">Crédito o débito</div>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="w-5 h-5 rounded-full bg-fuchiball-green text-white flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Precio</span>
                  <span>S/ {match.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/ {match.price.toFixed(2)}</span>
                </div>
              </div>
              
              <CustomButton
                fullWidth
                size="lg"
                onClick={handlePay}
              >
                Pagar ahora
              </CustomButton>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedRoute>
  );
};

export default MatchDetail;
