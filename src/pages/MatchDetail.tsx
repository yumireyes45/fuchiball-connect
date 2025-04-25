
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
import { supabase } from '@/lib/supabaseClient';



const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'card' | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);

  const [yapePhone, setYapePhone] = useState('');
  const [yapeName, setYapeName] = useState('');
  const [yapeCode, setYapeCode] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        if (!id) return;
  
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .eq('id', id)
          .single();
  
        if (error) throw error;
  
        setMatch(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match:', error);
        toast.error('Error al cargar los detalles del partido');
        navigate('/home');
      }
    };
  
    const checkParticipation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && id) {
          const { data: participation } = await supabase
            .from('match_participants')
            .select('*')
            .eq('match_id', id)
            .eq('user_id', session.user.id)
            .single();
  
          setIsAlreadyJoined(!!participation);
        }
      } catch (error) {
        console.error('Error checking participation:', error);
      }
    };
  
    fetchMatchDetails();
    checkParticipation();
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleJoin = () => {
    setShowPaymentOptions(true);
  };

  const handlePay = async () => {
    if (!paymentMethod) {
      toast.error('Por favor selecciona un método de pago', { duration: 1000 });
      return;
    }

    if (paymentMethod !== 'yape') {
      toast.error('Por el momento solo aceptamos Yape', { duration: 1000 });
      return;
    }

    if (!yapePhone || !yapeName || !yapeCode) {
      toast.error('Por favor completa todos los campos requeridos', { duration: 1000 });
      return;
    }
  
    if (!match || isProcessing) {
      return;
    }
  
    setIsProcessing(true);
  
    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error('No has iniciado sesión');
        navigate('/auth');
        return;
      }

      // Subir comprobante si existe
      let paymentProofUrl = null;

      if (paymentProof) {
        try {
          // Subir la imagen al bucket payment_proofs
          const { data: fileData, error: fileError } = await supabase.storage
            .from('payment_proofs')
            .upload(
              `${session.user.id}/${match.id}/${Date.now()}-${paymentProof.name}`, 
              paymentProof,
              { cacheControl: '3600' }
            );
      
          if (fileError) throw fileError;
      
          // Obtener la URL pública del archivo
          const { data: publicUrl } = supabase.storage
            .from('payment_proofs')
            .getPublicUrl(fileData.path);
      
          paymentProofUrl = publicUrl.publicUrl;
        } catch (error) {
          console.error('Error uploading payment proof:', error);
          toast.error('Error al subir el comprobante');
          return;
        }
      }

      // Crear el pending booking con la URL del comprobante
      const { error: bookingError } = await supabase
      .from('pending_bookings')
      .insert({
        match_id: match.id,
        user_id: session.user.id,
        yape_phone: yapePhone,
        yape_name: yapeName,
        yape_code: yapeCode,
        payment_proof_url: paymentProofUrl,
        status: 'pending'
      });

      if (bookingError) throw bookingError;
  
      // Check available spots
      if (match.available_spots < 1) {
        toast.error('Ya no hay cupos disponibles');
        return;
      }
  
      toast.success('Pago registrado y en revisión');
        navigate('/my-matches');

    } catch (error: any) {
      toast.error('Error al procesar el registro');
      console.error('Payment error:', error);
      } finally {
        setIsProcessing(false);
        }
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
              onClick={() => toast.info('Compartido con éxito', { duration: 1000 })}
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
                <span className="font-medium">{match.available_spots} disponibles</span>
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
              <span className="ml-2 text-gray-500">Mapa de ubicación bloqueada</span>
            </div>
            
            {/* Price and buttons */}
            <div className="mb-4">
            {/* Cambiar flex por flex-col en mobile y row en desktop */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="w-full sm:w-auto align-center text-center sm:text-left">
                <span className="text-gray-500 text-sm">Precio por persona</span>
                {match.is_last_minute && match.discount_percentage ? (
                  <div>
                    <span className="text-gray-500 line-through text-lg mr-2">
                      S/ {match.price}
                    </span>
                    <span className="font-bold text-3xl text-fuchiball-green mr-3">
                      S/ {(match.price - (match.price * (match.discount_percentage / 100))).toFixed(2)}
                    </span>
                    <span className="text-fuchiball-gold text-base font-medium block sm:inline">
                      {match.discount_percentage}% de descuento
                    </span>
                  </div>
                ) : (
                  <div className="font-bold text-2xl text-fuchiball-black">
                    S/ {match.price}
                  </div>
                )}
              </div>
              
                <CustomButton 
                onClick={handleJoin}
                size="lg"
                className="w-full sm:w-auto"
                disabled={isAlreadyJoined || match.available_spots < 1}
              >
                {isAlreadyJoined 
                  ? 'Ya estás inscrito en esta pichanga' 
                  : match.available_spots < 1 
                    ? 'No hay cupos' 
                    : 'Unirme y pagar'}
              </CustomButton>
            </div>
              
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold mb-2">Descripción del partido</h3>
                <p className="text-gray-600 text-base">
                {match.description}
                </p>
              </div>
              
              {/* Additional info */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-medium">{match.duration} minutos</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Formato</span>
                  <span className="font-medium">{match.format} vs {match.format}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Incluye</span>
                  <span className="font-medium">{match.includes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          onClick={() => setShowPaymentOptions(false)}>

          {/* Centering container */}
            <div className="flex items-center justify-center min-h-screen p-4">
            {/* motion.div */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-6
                          overflow-y-auto max-h-auto mx-auto"
                          onClick={(e) => e.stopPropagation()}         // ② evita cerrar al clicar dentro
            >
              {/* Close button - fixed at top */}
              <button 
                onClick={() => setShowPaymentOptions(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className="w-6 h-6" />
              </button>

              {/* Title with padding for close button */}
              <h2 className="text-xl font-bold mb-6 pr-8">Selecciona método de pago</h2>
              
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


                  {paymentMethod !== 'yape' && (
                    <div className="flex items-center w-full">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <CircleDollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-grow text-center">
                        <div className="font-medium">Yape</div>
                        <div className="text-sm text-gray-500">Pago rápido con QR</div>
                      </div>
                    </div>
                  )}


                  {/* Dentro del Payment Modal */}
                  {paymentMethod === 'yape' && (
                    <div className="space-y-4 mt-2">
                      <div className="bg-purple-50 p-4 rounded-lg text-center space-y-3">
                      <h3 className="font-bold text-purple-700 text-lg">¡Paga con QR en 3 pasos!</h3>
                        <ol className="list-decimal list-inside text-left text-purple-800 font-medium space-y-1">
                          <li>Abre Yape 📱</li>
                          <li>Clic en "Escanear QR"</li>
                          <li>Abajo haz clic en “Subir una imagen con QR” 📷 y comparte tu comprobante</li>
                        </ol>
                        <img 
                          src="https://ytsvrhcubfdotvaomypr.supabase.co/storage/v1/object/sign/imagenes/WhatsApp%20Image%202025-04-24%20at%2012.49.00%20PM.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzViMmEzZmMzLWVmOGEtNGZlYS04NDMzLTY4ZTQzYTU5ZTM2OSJ9.eyJ1cmwiOiJpbWFnZW5lcy9XaGF0c0FwcCBJbWFnZSAyMDI1LTA0LTI0IGF0IDEyLjQ5LjAwIFBNLndlYnAiLCJpYXQiOjE3NDU1MzQ4MTMsImV4cCI6MTc3NzA3MDgxM30.aR7cJwvIZkWWpeP2ICUt80dFCDlZ_eCshonbr-nyvw4" 
                          alt="QR Code" 
                          className="w-45 h-55 mx-auto"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Número de Yape</label>
                        <input
                          type="tel"
                          maxLength={9}
                          className="w-full p-3 border rounded-lg"
                          value={yapePhone}
                          onChange={(e) => setYapePhone(e.target.value)}
                          placeholder="Ej: 999999999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre en Yape</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg"
                          value={yapeName}
                          onChange={(e) => setYapeName(e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Código de seguridad Yape</label>
                        <input
                          type="text"
                          maxLength={3}
                          className="w-full p-3 border rounded-lg"
                          value={yapeCode}
                          onChange={(e) => setYapeCode(e.target.value)}
                          placeholder="Código de 3 dígitos"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Comprobante (opcional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full p-3 border rounded-lg"
                          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        />
                      </div>
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
              {match.is_last_minute && match.discount_percentage ? (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Precio regular</span>
                    <span className="line-through text-gray-500">S/ {match.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-fuchiball-gold">Descuento {match.discount_percentage}%</span>
                    <span className="text-fuchiball-gold">
                      - S/ {(match.price * (match.discount_percentage / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-fuchiball-green">
                      S/ {(match.price - (match.price * (match.discount_percentage / 100))).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Precio</span>
                    <span>S/ {match.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>S/ {match.price.toFixed(2)}</span>
                  </div>
                </>
              )}
              </div>
              
              <CustomButton
                fullWidth
                size="lg"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Pagar ahora'}
              </CustomButton>
            </motion.div>
          </div>
          </div>
        )}
      </div>
    </AnimatedRoute>
  );
};

export default MatchDetail;
