import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { availableGenres, availablePlatforms, genreToCode, platformToCode } from '../utils/genrePlatformMapping';
import { Search, Sparkles } from 'lucide-react';

export const Recomendador = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    genre: 'all',
    platform: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar a resultados con los filtros como query params
    const params = new URLSearchParams();
    if (formData.name) params.append('name', formData.name);
    if (formData.genre !== 'all') {
      // Convertir nombre legible a código para la búsqueda
      const genreCode = genreToCode(formData.genre) || formData.genre;
      params.append('genre', genreCode);
    }
    if (formData.platform !== 'all') {
      // Convertir nombre legible a código para la búsqueda
      const platformCode = platformToCode(formData.platform) || formData.platform;
      params.append('platform', platformCode);
    }
    
    navigate(`/resultado?${params.toString()}`);
  };

  return (
    <MainLayout footerLinkText="Volver a la Página Principal" footerLinkTo="/">
      <div className="max-w-3xl mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">IA Powered</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sistema de Recomendación
          </h1>
          
          <p className="text-xl text-gray-400">
            Encuentra tu próximo juego favorito usando nuestros filtros inteligentes
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            {/* Nombre del juego */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Nombre del juego (opcional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Cyber, Racing, Horror..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Género */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                Género
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="all">Todos los géneros</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Plataforma */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                Plataforma
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="all">Todas las plataformas</option>
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
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Recomendar Juegos
            </button>
          </div>
        </form>

        {/* Info adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400 mb-1">500+</div>
            <div className="text-gray-400 text-sm">Juegos en la base de datos</div>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400 mb-1">12</div>
            <div className="text-gray-400 text-sm">Géneros disponibles</div>
          </div>
          <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/30">
            <div className="text-3xl font-bold text-pink-400 mb-1">5</div>
            <div className="text-gray-400 text-sm">Plataformas soportadas</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
