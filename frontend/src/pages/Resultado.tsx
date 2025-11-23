import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ResultCard } from '../components/ResultCard';
import { Game as ComponentGame } from '../services/gamesMock';
import { useRecomendador } from '../hooks/useRecomendador';
import { useFavorites } from '../hooks/useFavorites';
import { adaptAPIGamesToComponent, isHighlightedGame } from '../utils/gameAdapter';
import { Sparkles, AlertCircle } from 'lucide-react';

export const Resultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ComponentGame[]>([]);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const { searchGames, isLoading, error } = useRecomendador();
  const { addFavorite, isFavorite, getFavoriteId } = useFavorites();

  useEffect(() => {
    const loadGames = async () => {
      const filters = {
        nombre: searchParams.get('name') || undefined,
        genero: searchParams.get('genre') || undefined,
        plataforma: searchParams.get('platform') || undefined,
      };

      try {
        const response = await searchGames({
          nombre: filters.nombre,
          genero: filters.genero,
          plataforma: filters.plataforma,
        });

        // Convertir juegos de la API al formato de componentes
        const adaptedGames = adaptAPIGamesToComponent(response.results);

        // Marcar juegos destacados
        const markedGames = adaptedGames.map((game) => ({
          ...game,
          isHighlighted: isHighlightedGame(game.title, response.highlighted || []),
        }));

        setResults(markedGames);
        setHighlighted(response.highlighted || []);
      } catch (err) {
        console.error('Error al buscar juegos:', err);
        setResults([]);
        setHighlighted([]);
      }
    };

    loadGames();
  }, [searchParams, searchGames]);

  const handleAddFavorite = async (game: ComponentGame) => {
    try {
      const apiId = parseInt(game.id);
      await addFavorite(apiId);
    } catch (error) {
      console.error('Error al agregar favorito:', error);
    }
  };

  // Filtrar juegos destacados
  const highlightedGames = results.filter((game) =>
    isHighlightedGame(game.title, highlighted)
  );

  return (
    <MainLayout footerLinkText="Volver al Recomendador" footerLinkTo="/recomendador">
      <div className="fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Resultados Listos</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Resultados de tu Recomendación
          </h1>
          
          <p className="text-xl text-gray-400">
            {isLoading
              ? 'Buscando juegos...'
              : `Encontramos ${results.length} juego${results.length !== 1 ? 's' : ''} que coinciden con tus preferencias`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">Buscando juegos...</h2>
              <p className="text-gray-400">Esto puede tomar unos segundos</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Resultados principales */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                Todos los Resultados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((game) => {
                  const apiId = parseInt(game.id);
                  return (
                    <ResultCard
                      key={game.id}
                      game={game}
                      onAddFavorite={handleAddFavorite}
                      isFavorite={isFavorite(apiId)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Recomendaciones destacadas */}
            {highlightedGames.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-xl p-6 mb-6">
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    Recomendaciones Destacadas
                  </h2>
                  <p className="text-yellow-200/80">
                    Los juegos mejor valorados según tus criterios de búsqueda
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highlightedGames.map((game) => {
                    const apiId = parseInt(game.id);
                    return (
                      <ResultCard
                        key={game.id}
                        game={game}
                        onAddFavorite={handleAddFavorite}
                        isFavorite={isFavorite(apiId)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          // Sin resultados
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl border border-red-500/30 backdrop-blur-sm">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                No se encontraron resultados
              </h2>
              <p className="text-gray-400 mb-6">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <button
                onClick={() => navigate('/recomendador')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Volver al Recomendador
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
