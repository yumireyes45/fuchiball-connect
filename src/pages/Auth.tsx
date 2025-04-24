
import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top curved design with soccer field pattern */}
      <div className="bg-fuchiball-green h-64 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEMxMy40 MzE1IDAgMCAxMy40MzE1IDAgMzBDMCA0Ni41Njg1IDEzLjQzMTUgNjAgMzAgNjBDNDYuNTY4NSA2MCA2MCA0Ni41Njg1IDYwIDMwQzYwIDEzLjQzMTUgNDYuNTY4NSAwIDMwIDBaTTMwIDU0QzE2Ljc0NTEgNTQgNiA0My4yNTQ5IDYgMzBDNiAxNi43NDUxIDE2Ljc0NTEgNiAzMCA2QzQzLjI1NDkgNiA1NCAxNi43NDUxIDU0IDMwQzU0IDQzLjI1NDkgNDMuMjU0OSA1NCAzMCA1NFoiIGZpbGw9IiMyQTgwMkEiLz48L3N2Zz4=')] opacity-10" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-4"
          >
            <div className="bg-white rounded-xl p-2 mr-3">
              <span className="text-fuchiball-green font-bold text-2xl">PLV</span>
            </div>
            <h1 className="text-3xl font-bold">PasaLaVoz!</h1>
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/90 text-center max-w-md mb-4"
          >
            Solo entra, elige un partido, paga y juega. Nosotros nos encargamos de todo lo demás.
          </motion.p>
        </div>
      </div>

      {/* Auth container */}
      <div className="flex-1 container mx-auto px-4 -mt-10 z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              className={`flex-1 py-3 text-center font-medium rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-fuchiball-green/10 text-fuchiball-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-fuchiball-green/10 text-fuchiball-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Registrarme
            </button>
          </div>

          {/* Form */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 mb-4 text-center text-gray-500 text-sm">
        © 2023 Fuchiball. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default Auth;
