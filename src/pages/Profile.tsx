import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Edit2, Shield, CreditCard, Bell, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import CustomButton from '@/components/ui/custom-button';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { cn } from '@/lib/utils';
import FootballLoader from '@/components/ui/FootballLoader';

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  skill_level: 'Básico' | 'Intermedio' | 'Avanzado';
  favorite_position: 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  profile_image: string | null;
};

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  // Obtener datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error('Sesión no válida', { duration: 2000 });
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', session.user.id)
        .single();

        if (error) {
          toast.error('Error al cargar perfil', { duration: 2000 });
          return;
        }

      setProfile({
        ...data,
        email: session.user.email as string
      });
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <FootballLoader />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profile')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        skill_level: profile.skill_level || 'Básico',
        favorite_position: profile.favorite_position || 'Delantero'
      })
      .eq('id', profile.id);

    setSaving(false);
    
    if (error) {
      toast.error('Error al actualizar perfil', { duration: 1000 });
      return;
    }

    toast.success('Perfil actualizado correctamente', { duration: 1000 });
  };

  const isProfileComplete = profile?.phone;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchiball-green" />
      </div>
    );
  }

  return (
    <AnimatedRoute>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-fuchiball-black">Mi Perfil</h1>
            <button 
              type='button'
              onClick={handleLogout}
              className="flex items-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Cerrar sesión
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  {profile?.profile_image ? (
                    <img 
                      src={profile.profile_image} 
                      alt={profile.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-fuchiball-green text-white rounded-full p-1 shadow-md">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="ml-4">
                <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                <p className="text-gray-500">{profile?.email}</p>
                {!isProfileComplete && (
                  <span className="text-red-500 text-sm">
                    Completa tu perfil para acceder a todas las funciones
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium">Información personal</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Nombre completo o Apodo</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Email</label>
                  <input 
                    type="email" 
                    className="premium-input" 
                    value={profile?.email || ''} 
                    disabled 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    className="premium-input" 
                    value={profile?.phone || ''} 
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      setProfile(prev => prev ? {...prev, phone: onlyNums} : null);
                    }}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="987654321"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Nivel de juego</label>
                  <select 
                    className="premium-input"
                    value={profile?.skill_level || 'Básico'}
                    onChange={(e) => setProfile(prev => prev ? {
                      ...prev, 
                      skill_level: e.target.value as Profile['skill_level']
                    } : null)}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Posición favorita</label>
                  <select 
                    className="premium-input"
                    value={profile?.favorite_position || 'Delantero'}
                    onChange={(e) => setProfile(prev => prev ? {
                      ...prev, 
                      favorite_position: e.target.value as Profile['favorite_position']
                    } : null)}
                  >
                    <option value="Delantero">Delantero</option>
                    <option value="Mediocampista">Mediocampista</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Portero">Portero</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <CustomButton
                  onClick={handleSaveChanges}
                  loading={saving}
                  disabled={!profile?.phone}
                >
                  Guardar cambios
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className={cn(
            "bg-white rounded-xl shadow-sm transition-opacity",
            !isProfileComplete && "opacity-50 pointer-events-none"
          )}>
            <div className="divide-y divide-gray-100">
              {[
                { icon: <CreditCard className="w-5 h-5" />, label: 'Métodos de pago' },
                { icon: <Bell className="w-5 h-5" />, label: 'Notificaciones' },
                { icon: <Shield className="w-5 h-5" />, label: 'Privacidad' },
                { icon: <HelpCircle className="w-5 h-5" />, label: 'Ayuda y soporte' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => toast.info('Próximamente', { duration: 1000 })}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    {item.icon}
                  </div>
                  <span className="font-medium text-left flex-grow">{item.label}</span>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </AnimatedRoute>
  );
};

export default Profile;