import { Star, Heart } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { useAuth } from '../hooks/useAuth';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultCardProps {
  game: Game;
  onAddFavorite?: (game: Game) => void;
  isFavorite?: boolean;
}

export const ResultCard = ({ game, onAddFavorite, isFavorite }: ResultCardProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 card-hover ${
      game.isHighlighted
        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-500/50'
        : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-purple-500/30'
    }`}>
      {/* Badge destacado */}
      {game.isHighlighted && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-bold">
          ⭐ DESTACADO
        </div>
      )}

      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
          {game.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-yellow-500 font-bold text-lg">{game.rating}</span>
          <span className="text-gray-400 text-sm">/ 5</span>
        </div>

        {/* Géneros */}
        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">Géneros:</div>
          <div className="flex flex-wrap gap-2">
            {game.genres.map((genre, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Plataformas */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Plataformas:</div>
          <div className="flex flex-wrap gap-2">
            {game.platforms.map((platform, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Botón favoritos */}
        {isAuthenticated && onAddFavorite && !isFavorite && (
          <button
            onClick={() => onAddFavorite(game)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Heart className="w-4 h-4" />
            Agregar a Favoritos
          </button>
        )}

        {isFavorite && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
            <Heart className="w-4 h-4 fill-green-400" />
            En tus favoritos
          </div>
        )}
      </div>

      {/* Efecto de glow */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
        game.isHighlighted
          ? 'bg-gradient-to-br from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/10 group-hover:to-amber-500/10'
          : 'bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10'
      }`} />
    </div>
  );
};
