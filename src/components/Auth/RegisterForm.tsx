
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Smartphone } from 'lucide-react';
import CustomButton from '../ui/custom-button';
import { toast } from 'sonner';

const RegisterForm = () => {
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Cuenta creada correctamente');
      navigate('/home');
    }, 1500);
  };

  const handleGoogleRegister = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Cuenta creada con Google');
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <div className="bg-white rounded-full p-2 shadow-md border border-gray-100">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                registerMethod === 'email'
                  ? 'bg-fuchiball-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setRegisterMethod('email')}
            >
              Email
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                registerMethod === 'phone'
                  ? 'bg-fuchiball-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setRegisterMethod('phone')}
            >
              Teléfono
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Nombre completo"
            className="premium-input pl-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {registerMethod === 'email' ? (
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="premium-input pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              placeholder="Número de teléfono"
              className="premium-input pl-10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        )}
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Contraseña"
            className="premium-input pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-2">
          <CustomButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Registrarme
          </CustomButton>
        </div>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">o continúa con</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div>
        <button
          onClick={handleGoogleRegister}
          className="w-full bg-white flex items-center justify-center border border-gray-300 rounded-xl px-6 py-3 space-x-2 hover:bg-gray-50 transition duration-200"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          <span className="font-medium text-gray-700">Google</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
