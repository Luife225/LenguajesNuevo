import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { LogIn, User, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Iniciar Sesión
          </h1>
          
          <p className="text-gray-400">
            Bienvenido de vuelta, gamer
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="mb-5">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Tu nombre de usuario"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Iniciar Sesión
            </button>

            {/* Forgot password */}
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </form>

        {/* Link a Register */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo info */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400 text-center">
            💡 <strong>Demo:</strong> Puedes usar cualquier usuario y contraseña para probar la aplicación
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
