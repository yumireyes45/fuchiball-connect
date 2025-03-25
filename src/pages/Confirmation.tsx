
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/ui/custom-button';
import { Check, Calendar, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedRoute from '@/components/ui/AnimatedRoute';

const Confirmation = () => {
  const navigate = useNavigate();
  
  // Generate a random confirmation code
  const confirmationCode = `FBC-${Math.floor(1000 + Math.random() * 9000)}`;
  
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);
  
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
                {confirmationCode}
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
                  <span className="font-medium">Pichanga en La Bombonera</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha</span>
                  <span className="font-medium">Hoy, 7:00 PM</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Lugar</span>
                  <span className="font-medium">La Molina, Lima</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel</span>
                  <span className="font-medium">Intermedio</span>
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
