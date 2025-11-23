import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FavoriteCard } from '../components/FavoriteCard';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Heart, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export const Favoritos = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites, removeFavorite } = useFavorites();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (favoritoId: number) => {
    try {
      await removeFavorite(favoritoId);
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  return (
    <MainLayout footerLinkText="Volver a la Página Principal" footerLinkTo="/">
      <div className="fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 mb-4">
            <Heart className="w-4 h-4 text-green-400 fill-green-400" />
            <span className="text-green-400 text-sm">Tu Colección</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Mis Favoritos
          </h1>
          
          <p className="text-xl text-gray-400">
            {favorites.length > 0
              ? `Tienes ${favorites.length} juego${favorites.length !== 1 ? 's' : ''} en tu lista`
              : 'Aún no has agregado juegos a favoritos'}
          </p>
        </div>

        {/* Grid de favoritos */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorito) => {
              // Convertir favorito a formato Game para el componente
              const game = {
                id: String(favorito.id),
                title: favorito.nombre,
                image: favorito.imagen,
                rating: favorito.rating,
                genres: favorito.genero.split(', '),
                platforms: favorito.plataforma.split(', '),
              };
              return (
                <FavoriteCard
                  key={favorito.id}
                  game={game}
                  onRemove={(id) => handleRemove(favorito.id)}
                />
              );
            })}
          </div>
        ) : (
          // Estado vacío
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Tu lista está vacía
              </h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Explora nuestro catálogo y agrega juegos a tu lista de favoritos para encontrarlos fácilmente más tarde
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Ver Juegos Populares
                </button>
                <button
                  onClick={() => navigate('/recomendador')}
                  className="px-6 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  Usar Recomendador
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {favorites.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {favorites.length}
              </div>
              <div className="text-gray-400">Juegos Guardados</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {favorites.length > 0
                  ? (favorites.reduce((sum, fav) => sum + fav.rating, 0) / favorites.length).toFixed(1)
                  : '0.0'}
              </div>
              <div className="text-gray-400">Rating Promedio</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-pink-400 mb-1">
                {new Set(favorites.flatMap(fav => fav.genero.split(', '))).size}
              </div>
              <div className="text-gray-400">Géneros Únicos</div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
