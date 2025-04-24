import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      // Limpiar hash de la URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Verificar/crear perfil
      const checkProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url
          });
        }
      };

      checkProfile();
      toast.success('¡Bienvenido!');
      navigate('/home');
    }
  }, [session, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-fuchiball-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Iniciando sesión...</p>
      </div>
    </div>
  );
}
