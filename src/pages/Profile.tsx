
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import CustomButton from '@/components/ui/custom-button';
import { User, LogOut, Edit2, Shield, CreditCard, Bell, HelpCircle, SoccerBall } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedRoute from '@/components/ui/AnimatedRoute';
import { cn } from '@/lib/utils';

const profileTabs = [
  { id: 'info', label: 'Información' },
  { id: 'stats', label: 'Estadísticas' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  const handleLogout = () => {
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  const menuItems = [
    { icon: <CreditCard className="w-5 h-5" />, label: 'Métodos de pago', action: () => toast.info('Próximamente') },
    { icon: <Bell className="w-5 h-5" />, label: 'Notificaciones', action: () => toast.info('Próximamente') },
    { icon: <Shield className="w-5 h-5" />, label: 'Privacidad', action: () => toast.info('Próximamente') },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Ayuda y soporte', action: () => toast.info('Próximamente') },
  ];

  return (
    <AnimatedRoute>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-fuchiball-black">Mi Perfil</h1>
            <button 
              onClick={handleLogout}
              className="text-gray-600 flex items-center text-sm"
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
                  <User className="w-10 h-10" />
                </div>
                <button className="absolute bottom-0 right-0 bg-fuchiball-green text-white rounded-full p-1 shadow-md">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="ml-4">
                <h2 className="text-xl font-bold">Carlos Rodriguez</h2>
                <p className="text-gray-500">carlos@example.com</p>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">
                    Intermedio
                  </span>
                  <span className="ml-2 text-gray-500 text-sm flex items-center">
                    <SoccerBall className="w-3 h-3 mr-1" />
                    8 partidos jugados
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="mb-6">
            <div className="flex space-x-2 border-b border-gray-200">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={cn(
                    "pb-2 px-4 font-medium transition-all",
                    activeTab === tab.id
                      ? "text-fuchiball-green border-b-2 border-fuchiball-green"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-sm mb-6">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-medium">Información personal</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm mb-1">Nombre completo</label>
                        <input type="text" className="premium-input" defaultValue="Carlos Rodriguez" />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-1">Email</label>
                        <input type="email" className="premium-input" defaultValue="carlos@example.com" />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-1">Teléfono</label>
                        <input type="tel" className="premium-input" defaultValue="+51 987 654 321" />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-1">Nivel de juego</label>
                        <select className="premium-input">
                          <option>Básico</option>
                          <option selected>Intermedio</option>
                          <option>Avanzado</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-1">Posición favorita</label>
                        <select className="premium-input">
                          <option>Portero</option>
                          <option>Defensa</option>
                          <option selected>Mediocampista</option>
                          <option>Delantero</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <CustomButton
                        onClick={() => toast.success('Perfil actualizado')}
                        size="sm"
                      >
                        Guardar cambios
                      </CustomButton>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors"
                        onClick={item.action}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <span className="font-medium text-left flex-grow">{item.label}</span>
                        <span className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-medium mb-4">Mis estadísticas</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-fuchiball-green">8</div>
                    <div className="text-gray-500 text-sm">Partidos jugados</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-fuchiball-green">12</div>
                    <div className="text-gray-500 text-sm">Goles anotados</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-fuchiball-green">5</div>
                    <div className="text-gray-500 text-sm">Asistencias</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-fuchiball-green">4.8</div>
                    <div className="text-gray-500 text-sm">Valoración</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">Próximas características</h4>
                  <p className="text-gray-500 text-sm">
                    Pronto podrás ver más estadísticas como pases completados, 
                    recuperaciones y una gráfica de tu progreso a lo largo del tiempo.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </AnimatedRoute>
  );
};

export default Profile;
