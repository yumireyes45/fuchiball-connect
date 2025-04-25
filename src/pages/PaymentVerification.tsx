import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { ADMIN_EMAILS } from '@/components/constants/admins';
import { Check, X, Eye, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomButton from '@/components/ui/custom-button';

interface PendingBooking {
  id: string;
  match_id: string;
  user_id: string;
  yape_phone: string;
  yape_name: string;
  yape_code: string;
  payment_proof_url: string | null;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  matches: {
    title: string;
    date: string;
    time: string;
    price: number;
  };
  profiles: {
    full_name: string;
  };
}

const PaymentVerification = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user.email || '')) {
        toast.error('No tienes acceso a esta página');
        navigate('/home');
      }
    };

    const fetchPendingBookings = async () => {
      const { data, error } = await supabase
        .from('pending_bookings')
        .select(`
          *,
          matches:matches!pending_bookings_match_id_fkey (title, date, time, price),
          profiles:profile!pending_bookings_profile_fkey (full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error al cargar las solicitudes');
        console.error(error);
      } else {
        setPendingBookings(data || []);
      }
      setLoading(false);
    };

    checkAdmin();
    fetchPendingBookings();
  }, [navigate]);

  const handleVerification = async (bookingId: string, matchId: string, userId: string, verified: boolean) => {
    try {
      if (verified) {
        // Actualizar estado del booking
        const { error: bookingError } = await supabase
          .from('pending_bookings')
          .update({ status: 'verified' })
          .eq('id', bookingId);

        if (bookingError) throw bookingError;

        // Crear participación
        const { error: participationError } = await supabase
          .from('match_participants')
          .insert({
            match_id: matchId,
            user_id: userId,
            status: 'confirmed',
            code: `FBC-${Math.floor(1000 + Math.random() * 9000)}`,
            joined_at: new Date().toISOString()
          });

        if (participationError) throw participationError;

        // Actualizar cupos disponibles
        // Actualizar cupos disponibles usando la función RPC
        const { error: spotError } = await supabase
        .rpc('decrement_available_spots', { match_id: matchId });

        if (spotError) throw spotError;

        toast.success('Pago verificado y participación confirmada', {duration: 2000});
      } else {
        const { error } = await supabase
          .from('pending_bookings')
          .update({ status: 'rejected' })
          .eq('id', bookingId);

        if (error) throw error;
        toast.success('Pago rechazado');
      }

      // Actualizar lista local
      setPendingBookings(prev => prev.filter(booking => booking.id !== bookingId));

    } catch (error) {
      toast.error('Error al procesar la verificación', {duration: 2000});
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchiball-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Verificación de Pagos</h1>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">No hay pagos pendientes</h2>
            <p className="text-gray-500">Todos los pagos han sido verificados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{booking.matches.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Solicitado por: {booking.profiles.full_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">S/ {booking.matches.price}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Número Yape</p>
                    <p className="font-medium">{booking.yape_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nombre en Yape</p>
                    <p className="font-medium">{booking.yape_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Código de validación</p>
                    <p className="font-medium">{booking.yape_code}</p>
                  </div>
                </div>

                {booking.payment_proof_url && (
                  <div className="mb-4">
                    <a
                      href={booking.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-fuchiball-green hover:text-fuchiball-green/80"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver comprobante
                    </a>
                  </div>
                )}

                <div className="flex space-x-3">
                  
                  <CustomButton
                    onClick={() => handleVerification(booking.id, booking.match_id, booking.user_id, false)}
                    className="flex-1 !bg-red-600 !hover:bg-red-700"
                  >
                    ❎ Rechazar
                  </CustomButton>

                  <CustomButton
                    onClick={() => handleVerification(booking.id, booking.match_id, booking.user_id, true)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ✅ Aprobar
                  </CustomButton>


                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;