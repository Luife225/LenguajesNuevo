import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { availableGenres, availablePlatforms, genreToCode, platformToCode } from '../utils/genrePlatformMapping';
import { UserPlus, Mail, Lock, User, Gamepad2 } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferredGenre: '',
    preferredPlatform: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      // Convertir nombres legibles a códigos del backend
      const generoCode = formData.preferredGenre && formData.preferredGenre !== '' 
        ? (genreToCode(formData.preferredGenre) || formData.preferredGenre.toLowerCase()) 
        : undefined;
      const plataformaCode = formData.preferredPlatform && formData.preferredPlatform !== ''
        ? (platformToCode(formData.preferredPlatform) || formData.preferredPlatform)
        : undefined;

      console.log('Registrando con:', { generoCode, plataformaCode }); // Debug

      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password,
        genero_preferido: generoCode || null,
        plataforma_preferida: plataformaCode || null,
      });
      navigate('/');
    } catch (err: any) {
      console.error('Error en registro:', err); // Debug
      setError(err?.message || 'Error al registrar usuario');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crear Cuenta
          </h1>
          
          <p className="text-gray-400">
            Únete a nuestra comunidad de gamers
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
                <User className="w-4 h-4 text-purple-400" />
                Usuario *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Tu nombre de usuario"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Contraseña *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>

            {/* Género Preferido */}
            <div className="mb-5">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                Género Preferido
              </label>
              <select
                value={formData.preferredGenre}
                onChange={(e) => setFormData({ ...formData, preferredGenre: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="">Selecciona un género</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Plataforma Preferida */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                Plataforma Preferida
              </label>
              <select
                value={formData.preferredPlatform}
                onChange={(e) => setFormData({ ...formData, preferredPlatform: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="">Selecciona una plataforma</option>
                {availablePlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Registrarse
            </button>
          </div>
        </form>

        {/* Link a Login */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
