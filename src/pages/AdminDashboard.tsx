import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, Clock, Link } from 'lucide-react';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import CustomButton from '@/components/ui/custom-button';
import { Match } from '@/components/MatchCard/MatchCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
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
      fetchMatches();
    };

    checkAdmin();
  }, [navigate]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast.error('Error al cargar los partidos', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleLastMinute = async (matchId: string, isLastMinute: boolean, discountPercentage?: number) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ 
          is_last_minute: isLastMinute,
          discount_percentage: isLastMinute ? (discountPercentage || 0) : null 
        })
        .eq('id', matchId);

      if (error) throw error;
      
      toast.success('Partido actualizado correctamente', { duration: 1000 });
      fetchMatches();
    } catch (error: any) {
      toast.error('Error al actualizar el partido', { duration: 1000 });
    }
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;
      
      toast.success('Partido eliminado correctamente', { duration: 2000 });
      fetchMatches();
    } catch (error: any) {
      toast.error('Error al eliminar el partido', { duration: 2000 });
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
      <div className="pt-24 px-4 pb-24 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-fuchiball-black">Panel de Administración</h1>
          <CustomButton onClick={() => navigate('/admin/crear-partido')}>        
            <span><span className='text-lg'>+</span> Crear Partido</span>
          </CustomButton>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{match.title}</h3>
                  <p className="text-gray-500">{match.location}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleLastMinute(match.id, !match.is_last_minute)}
                    className={`p-2 rounded-lg ${
                      match.is_last_minute 
                        ? 'bg-fuchiball-gold text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/editar-partido/${match.id}`)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(match.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Fecha</span>
                  <p className="font-medium">{match.date}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hora</span>
                  <p className="font-medium">{match.time}</p>
                </div>
                <div>
                  <span className="text-gray-500">Cupos</span>
                  <p className="font-medium">{match.available_spots}/{match.total_spots}</p>
                </div>
                <div>
                  <span className="text-gray-500">Precio</span>
                  <p className="font-medium">
                    {match.is_last_minute && match.discount_percentage ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">S/{match.price}</span>
                        <span className="text-fuchiball-green">
                          S/{match.price - (match.price * (match.discount_percentage / 100))}
                        </span>
                      </>
                    ) : (
                      `S/${match.price}`
                    )}
                  </p>
                </div>
              </div>

              {match.is_last_minute && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500">Porcentaje de descuento</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={match.discount_percentage || 0}
                    onChange={(e) => handleLastMinute(match.id, true, parseInt(e.target.value))}
                    className="premium-input mt-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AdminDashboard;