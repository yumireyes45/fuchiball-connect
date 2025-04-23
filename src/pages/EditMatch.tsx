import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import CustomButton from '@/components/ui/custom-button';
import { toast } from 'sonner';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import { Match } from '@/components/MatchCard/MatchCard';

type EditMatchFormData = Omit<Match, 'id' | 'created_at' | 'created_by' | 'available_spots'>;

const EditMatch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const [formData, setFormData] = useState<EditMatchFormData>({
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
    status: 'active'
  });

  useEffect(() => {
    const checkAdminAndLoadMatch = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error('No has iniciado sesión', { duration: 2000 });
        navigate('/login');
        return;
      }

      if (session.user.email !== 'yumireyes45@gmail.com') {
        toast.error('No tienes permisos de administrador', { duration: 2000 });
        navigate('/auth');
        return;
      }

      setAuthorized(true);

      // Cargar datos del partido
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Error al cargar el partido', { duration: 2000 });
        navigate('/admin/dashboard');
        return;
      }

      setFormData(data);
      setLoading(false);
    };

    checkAdminAndLoadMatch();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('matches')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Partido actualizado correctamente', { duration: 2000 });
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error('Error al actualizar el partido', { duration: 2000 });
    } finally {
      setSaving(false);
    }
  };

  if (!authorized || loading) {
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
        <h1 className="text-2xl font-bold mb-6 text-fuchiball-black">Editar Partido</h1>
        
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

          <div>
            <label className="block text-sm text-gray-500 mb-1">Nivel</label>
            <select
              className="premium-input"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as Match['level'] })}
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

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
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Formato</label>
              <input
                type="number"
                min="1"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: parseInt(e.target.value) })}
                className="premium-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Incluye</label>
            <input
              type="text"
              value={formData.includes}
              onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
              className="premium-input"
              placeholder="Árbitro, Chalecos, Balón"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="premium-input min-h-[100px]"
              placeholder="Información adicional..."
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_last_minute}
                onChange={(e) => setFormData({ ...formData, is_last_minute: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-gray-600">Último minuto</label>
            </div>

            {formData.is_last_minute && (
              <div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage || 0}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                  className="premium-input w-24"
                  placeholder="% descuento"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              fullWidth
            >
              Cancelar
            </CustomButton>

            <CustomButton
              type="submit"
              loading={saving}
              fullWidth
            >
              Guardar Cambios
            </CustomButton>
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default EditMatch;