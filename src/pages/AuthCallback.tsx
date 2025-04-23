import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        navigate('/login'); // Si no hay sesión, redirige al login
        return;
      }

      // Verifica si el perfil ya existe
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // Si hay un error distinto a "No encontrado", muestra un error
        toast.error('Error al obtener perfil: ' + profileError.message);
        navigate('/login');
        return;
      }

      // Si no existe el perfil, lo creamos
      if (!profile) {
        const { error: insertError } = await supabase.from('profile').insert({
          id: session.user.id,
          full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
          profile_image: session.user.user_metadata.avatar_url,
        });

        if (insertError) {
          toast.error('Error al crear perfil: ' + insertError.message);
          navigate('/login');
          return;
        }
      }

      // Si todo está bien, redirige a /home
      navigate('/home');
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-fuchiball-green/90 z-10" />
        <div 
          className="absolute inset-0 bg-black z-0 bg-[url('https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] 
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
            <span className="text-fuchiball-gold">Fuchi</span>
            <span className="text-white">ball</span>
          </h1>
        </motion.div>

        {/* Main Content - Loader */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center space-y-4"
        >
          <Loader2 className="w-12 h-12 text-fuchiball-gold animate-spin" />
          <p className="text-white text-xl font-medium">Iniciando sesión...</p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-white/70 text-sm"
        >
          Powered by Fuchiball. Hecho con ❤️ en Perú.
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCallback;
