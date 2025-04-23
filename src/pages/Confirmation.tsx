import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomButton from '@/components/ui/custom-button';
import { Check, Calendar, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { supabase } from '@/lib/supabaseClient';
import FootballLoader from '@/components/ui/FootballLoader';

interface MatchParticipant {
  id: string;
  match_id: string;
  user_id: string;
  code: string;
  joined_at: string;
  status: 'confirmed';
  match: {
    title: string;
    location: string;
    date: string;
    time: string;
    level: string;
  };
}

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [participation, setParticipation] = useState<MatchParticipant | null>(null);
  
  useEffect(() => {
    const createParticipation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('No has iniciado sesión');
          navigate('/login');
          return;
        }

        const matchId = location.state?.matchId;
        if (!matchId) {
          toast.error('No se encontró el partido');
          navigate('/home');
          return;
        }

        // Start a transaction
        const { data: matchCheck, error: matchError } = await supabase
          .from('matches')
          .select('available_spots')
          .eq('id', matchId)
          .single();

        if (matchError || !matchCheck || matchCheck.available_spots < 1) {
          throw new Error('No hay cupos disponibles');
        }

        // Generate unique code
        const code = `FBC-${Math.floor(1000 + Math.random() * 9000)}`;

        // Create participation record
        const { data: participationData, error: participationError } = await supabase
          .from('match_participants')
          .insert({
            match_id: matchId,
            user_id: session.user.id,
            code,
            status: 'confirmed',
            joined_at: new Date().toISOString()
          })
          .select(`
            *,
            match:matches (
              title,
              location,
              date,
              time,
              level
            )
          `)
          .single();

        if (participationError) {
          throw new Error('Error al crear la participación');
        }

        // Decrement available spots using RPC
        const { error: decrementError } = await supabase
          .rpc('decrement_available_spots', { match_id: matchId });

        if (decrementError) {
          throw new Error('Error al actualizar cupos');
        }

        setParticipation(participationData);
        toast.success('¡Inscripción exitosa!');

      } catch (error: any) {
        console.error('Error:', error);
        toast.error(error.message || 'Error al procesar tu inscripción');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    createParticipation();
  }, [navigate, location.state]);

  if (loading) return <FootballLoader />;
  if (!participation) return null;

  return (
    <AnimatedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-fuchiball-green rounded-full flex items-center justify-center mb-6"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">¡Estás dentro!</h1>
            <p className="text-gray-600 mb-6">
              Tu cupo está confirmado y reservado. Muestra este código en la cancha.
            </p>
            
            <div className="bg-white border-2 border-dashed border-fuchiball-green rounded-xl p-6 mb-8 max-w-xs mx-auto">
              <div className="text-4xl font-bold text-center text-fuchiball-green mb-2">
                {participation.code}
              </div>
              <div className="text-sm text-gray-500 text-center">
                Código de confirmación
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-sm mx-auto">
              <h3 className="font-bold mb-4">Detalles del partido</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Partido</span>
                  <span className="font-medium">{participation.match.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha</span>
                  <span className="font-medium">{participation.match.date}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora</span>
                  <span className="font-medium">{participation.match.time}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Lugar</span>
                  <span className="font-medium">{participation.match.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel</span>
                  <span className="font-medium">{participation.match.level}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-col space-y-3 w-full max-w-sm">
            <CustomButton
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => navigate('/my-matches')}
            >
              Ver mis partidos
            </CustomButton>
            
            <CustomButton
              variant="secondary"
              icon={<Share2 className="w-5 h-5" />}
              onClick={() => toast.success('¡Invitación compartida!')}
            >
              Invitar amigos
            </CustomButton>
          </div>
        </div>
      </div>
    </AnimatedRoute>
  );
};

export default Confirmation;