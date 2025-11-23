import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useIA } from '../hooks/useIA';
import { Brain, Sparkles, TrendingUp, MessageSquare, Star, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { adaptAPIGameToComponent } from '../utils/gameAdapter';

export const IAHub = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const { gameOfTheDay, aiResponse, analisis, isLoading, loadGameOfTheDay, askAI, loadAnalisis } = useIA();
  const [aiQuestion, setAiQuestion] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar datos al montar
    loadGameOfTheDay();
    loadAnalisis();
  }, [isAuthenticated, navigate, loadGameOfTheDay, loadAnalisis]);

  const handleAIQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    try {
      await askAI(aiQuestion);
    } catch (error) {
      console.error('Error al hacer pregunta a IA:', error);
    }
  };

  // Convertir juego del día al formato de componente si existe
  const recommendedGame = gameOfTheDay ? adaptAPIGameToComponent(gameOfTheDay) : null;

  // Mock: Historial de búsquedas (en el futuro se puede obtener de la API)
  const searchHistory = [
    'Juegos de acción',
    'RPG mundo abierto',
    'Shooter multijugador',
    'Juegos de estrategia'
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">IA Avanzada</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Centro de Recomendación Inteligente
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            La IA analiza tu comportamiento, tus favoritos y tus preferencias para darte recomendaciones más precisas.
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tarjeta: Aprendizaje del Usuario */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Aprendizaje del Usuario</h2>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Nuestro sistema de IA avanzado aprende constantemente de tu comportamiento para ofrecerte 
              recomendaciones cada vez más personalizadas. Analizamos múltiples factores en tiempo real 
              para entender tus gustos únicos.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-semibold">Juegos Vistos</div>
                  <div className="text-sm text-gray-400">Analizamos cada juego que explores</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-semibold">Juegos Buscados</div>
                  <div className="text-sm text-gray-400">Tus búsquedas revelan tus intereses</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-semibold">Géneros Favoritos</div>
                  <div className="text-sm text-gray-400">Identificamos patrones en tus preferencias</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-semibold">Juegos en Favoritos</div>
                  <div className="text-sm text-gray-400">Tu colección define tu perfil</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta: Tu Perfil de Jugador */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Tu Perfil de Jugador</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                <div className="text-sm text-gray-400 mb-1">Género Preferido</div>
                <div className="text-xl font-bold text-blue-400">
                  {analisis?.preferencias_actuales.genero || user?.profile?.genero_preferido || 'No especificado'}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                <div className="text-sm text-gray-400 mb-1">Plataforma Preferida</div>
                <div className="text-xl font-bold text-purple-400">
                  {analisis?.preferencias_actuales.plataforma || user?.profile?.plataforma_preferida || 'No especificada'}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-lg border border-pink-500/30">
                <div className="text-sm text-gray-400 mb-1">Juegos en Favoritos</div>
                <div className="text-xl font-bold text-pink-400">{favorites.length}</div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                <div className="text-sm text-gray-400 mb-1">Tipo de Jugador</div>
                <div className="text-xl font-bold text-green-400">
                  {analisis?.analisis.tipo_jugador || (favorites.length > 3 ? 'Hardcore Gamer' : 'Casual Explorer')}
                </div>
              </div>
            </div>

            {/* Historial de búsquedas */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-gray-400" />
                <div className="text-sm font-semibold text-gray-400">Historial de Búsquedas</div>
              </div>
              <div className="space-y-2">
                {searchHistory.map((search, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-gray-300 px-3 py-2 bg-gray-700/30 rounded-lg"
                  >
                    {search}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta: Recomendación IA del Día */}
        {recommendedGame && (
          <div className="mb-6 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-2 border-yellow-500/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/30 rounded-lg">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-yellow-400">Recomendación IA del Día</h2>
                <p className="text-yellow-200/80">Seleccionado especialmente para ti por nuestro algoritmo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Imagen */}
              <div className="relative h-64 md:h-full rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={recommendedGame.image}
                  alt={recommendedGame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 to-transparent" />
              </div>

              {/* Info */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-3xl font-bold text-white">{recommendedGame.title}</h3>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/30 rounded-lg border border-yellow-500/50">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold text-yellow-400">{recommendedGame.rating}</span>
                  </div>
                  <span className="text-gray-300">Rating excepcional</span>
                </div>

                <div>
                  <div className="text-sm text-yellow-200/80 mb-2">Géneros:</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendedGame.genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-yellow-200/80 mb-2">Disponible en:</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendedGame.platforms.map((platform, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {recommendedGame.description && (
                  <p className="text-gray-200 leading-relaxed">
                    {recommendedGame.description}
                  </p>
                )}

                <button className="px-6 py-3 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl font-semibold">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta: Pregúntale a la IA */}
        <div className="mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Pregúntale a la IA</h2>
          </div>

          <p className="text-gray-400 mb-6">
            Hazle cualquier pregunta a nuestra IA y recibe recomendaciones personalizadas al instante
          </p>

          <form onSubmit={handleAIQuestion} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="¿Qué juego me recomiendas si me gusta..."
                className="w-full px-4 py-4 pr-32 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Pensando...' : 'Preguntar'}
              </button>
            </div>
          </form>

          {/* Respuesta de IA */}
          {aiResponse && (
            <div className="mt-6 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl fade-in">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-cyan-400 font-semibold mb-2">Respuesta de la IA:</div>
                  <p className="text-gray-200 leading-relaxed">{aiResponse}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sugerencias rápidas */}
          <div className="mt-6">
            <div className="text-sm text-gray-400 mb-3">Prueba preguntando:</div>
            <div className="flex flex-wrap gap-2">
              {[
                '¿Juegos similares a Cyberpunk?',
                'RPG para principiantes',
                'Mejores juegos de terror',
                'Juegos multijugador cooperativos'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiQuestion(suggestion)}
                  className="px-3 py-2 text-sm bg-gray-700/30 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all border border-gray-600/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Volver al Inicio
          </button>
          <button
            onClick={() => navigate('/recomendador')}
            className="px-8 py-4 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all font-semibold"
          >
            Ir a Recomendador
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
