
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import CustomButton from '@/components/ui/custom-button';
import { toast } from 'sonner';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';

type MatchFormData = {
  title: string;
  location: string;
  date: string;
  time: string;
  total_spots: number;
  price: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  is_last_minute: boolean;
  duration: number;
  format: number;
  includes: string;
  description: string;
  discount_percentage: number;
};

const CreateMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const [formData, setFormData] = useState<MatchFormData>({
    title: '',
    location: '',
    date: '',
    time: '',
    total_spots: 14,
    price: 15,
    level: 'Básico',
    is_last_minute: false,
    duration: 90,
    format: 7,
    includes: '',
    description: '',
    discount_percentage: 0,
  });


  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        toast.error('No has iniciado sesión', { duration: 2000 });
        navigate('/auth');
        return;
      }

      if (session.user.email !== 'yumireyes45@gmail.com') {
        toast.error('No tienes permisos de administrador', { duration: 2000 });
        navigate('/auth');
        return;
      }

      setAuthorized(true);
    };

    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const matchData = {
        ...formData,
        available_spots: formData.total_spots,
        created_by: session.user.id,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('matches').insert(matchData);

      if (error) throw error;

      toast.success('Partido creado correctamente', { duration: 2000 });
      navigate('/home');
    } catch (error: any) {
      toast.error('Error al crear el partido: ' + error.message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchiball-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 px-4 pb-24 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-fuchiball-black">Crear Nuevo Partido</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Título del partido</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="premium-input"
              placeholder="Ej: Partido Amistoso Sábado"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Ubicación</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="premium-input"
              placeholder="Ej: Cancha Principal - Club XYZ"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="premium-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Hora</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="premium-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cupos Totales</label>
              <input
                type="number"
                min="1"
                max="22"
                value={formData.total_spots}
                onChange={(e) => setFormData({ ...formData, total_spots: parseInt(e.target.value) })}
                className="premium-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Precio (S/)</label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="premium-input"
                required
              />
            </div>
          </div>

          {/* CAMPOS NUEVOS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Duración (minutos)</label>
              <input
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="premium-input"
                required
                placeholder="90"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Formato (jugadores por lado)</label>
              <input
                type="number"
                min="1"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: parseInt(e.target.value) })}
                className="premium-input"
                required
                placeholder="7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Incluye (separado por comas)</label>
            <input
              type="text"
              value={formData.includes}
              onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
              className="premium-input"
              placeholder="Árbitro, Chalecos, Balón, Agua"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="premium-input min-h-[100px]"
              placeholder="Información adicional sobre el partido..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_last_minute}
              onChange={(e) => setFormData({ ...formData, is_last_minute: e.target.checked })}
            />
            <label className="text-sm text-gray-600">Partido Last Minute</label>
          </div>

          {formData.is_last_minute && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  discount_percentage: parseInt(e.target.value) 
                })}
                className="premium-input"
                placeholder="Ej: 20"
              />
            </div>
          )}


          <div>
            <label className="block text-sm text-gray-500 mb-1">Nivel</label>
            <select
              className="premium-input"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as MatchFormData['level'] })}
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <CustomButton
            type="submit"
            fullWidth
            loading={loading}
          >
            Crear Partido
          </CustomButton>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default CreateMatch;