
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';

const Index = () => {
  const navigate = useNavigate();

  // Update to navigate to Auth instead of directly to Home or LastMinute
  const handleNavigate = (destination: string) => {
    navigate(destination);
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-fuchiball-green/90 z-10" />
        <div 
          className="absolute inset-0 bg-black z-0 bg-[url('https://ytsvrhcubfdotvaomypr.supabase.co/storage/v1/object/sign/profiles/WhatsApp%20Image%202025-03-30%20at%206.32.47%20PM.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9maWxlcy9XaGF0c0FwcCBJbWFnZSAyMDI1LTAzLTMwIGF0IDYuMzIuNDcgUE0uanBlZyIsImlhdCI6MTc0MzM3ODQ0NSwiZXhwIjoxNzc0OTE0NDQ1fQ.hcwOBIw0njYqr5mZdAyY3iXu9cJEPtFacGv6sDxr_3s')] 
          bg-cover bg-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between min-h-screen px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white">
            <span className="text-fuchiball-gold">Pasa</span>
            <span className="text-white">LaVoz</span>
          </h1>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            ¿No tienes con quién jugar pichangas?
          </motion.h2>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Nosotros te conseguimos 
            <span className="text-fuchiball-gold"> cancha, equipo y rival.</span>
          </motion.h2>
          
          <motion.p 
            className="text-white/90 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Encuentra pichangas organizadas cerca de ti. 
            Pago rápido. Cero complicaciones.
          </motion.p>

          <motion.div 
            className="space-y-4 w-full max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <CustomButton 
              variant="primary"
              size="lg"
              fullWidth
              icon={<ArrowRight />}
              iconPosition="right"
              onClick={() => handleNavigate('/home')}
              className="shadow-lg shadow-fuchiball-green/30"
            >
              Ver Partidos Disponibles
            </CustomButton>
            
            <CustomButton 
              variant="accent"
              size="lg"
              fullWidth
              icon={<Zap className="text-black" />}
              iconPosition="right"
              onClick={() => handleNavigate('/last-minute')}
              className="shadow-lg shadow-fuchiball-gold/30"
            >
              Último Minuto
            </CustomButton>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center text-white/70 text-sm"
        >
          Powered by Fuchiball. Hecho con ❤️ en Perú.
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
