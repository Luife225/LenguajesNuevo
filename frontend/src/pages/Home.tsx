import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { GameCard } from '../components/GameCard';
import { getRecomendaciones } from '../services/api';
import { adaptAPIGamesToComponent } from '../utils/gameAdapter';
import { Game as ComponentGame } from '../services/gamesMock';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<ComponentGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Obtener juegos recomendados de la API real
        const response = await getRecomendaciones();
        const adaptedGames = adaptAPIGamesToComponent(response.results || []);
        setGames(adaptedGames);
      } catch (err) {
        console.error('Error al cargar juegos:', err);
        setError('Error al cargar juegos. Por favor, intenta de nuevo.');
        // En caso de error, mantener la lista vacía o mostrar un mensaje
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [isAuthenticated]);

  return (
    <MainLayout footerLinkText="Ir al Recomendador" footerLinkTo="/recomendador">
      <div className="fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Sistema de Recomendación IA</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isAuthenticated
              ? `Recomendaciones para ${user?.username}`
              : 'Videojuegos Populares'}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            {isAuthenticated
              ? 'Descubre juegos personalizados basados en tus preferencias'
              : 'Explora los mejores videojuegos del momento'}
          </p>

          {/* CTA Section */}
          <div className="inline-block p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">
              ¿Buscas algo específico?
            </h2>
            <p className="text-gray-400 mb-4">
              Usa nuestro sistema de recomendación inteligente para encontrar tu próximo juego favorito
            </p>
            <button
              onClick={() => navigate('/recomendador')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Probar el Recomendador
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">Cargando juegos...</h2>
              <p className="text-gray-400">Esto puede tomar unos segundos</p>
            </div>
          </div>
        ) : games.length > 0 ? (
          /* Games Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="cursor-pointer" onClick={() => navigate('/recomendador')}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                No se encontraron juegos
              </h2>
              <p className="text-gray-400 mb-6">
                Intenta recargar la página o usar el recomendador
              </p>
              <button
                onClick={() => navigate('/recomendador')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Ir al Recomendador
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
