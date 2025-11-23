import { Star, Trash2 } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FavoriteCardProps {
  game: Game;
  onRemove: (gameId: string | number) => void;
}

export const FavoriteCard = ({ game, onRemove }: FavoriteCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/30 backdrop-blur-sm hover:border-red-500/60 transition-all duration-300 card-hover">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-full">
          <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
          <span className="font-bold text-yellow-900">{game.rating}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
          {game.title}
        </h3>

        {/* Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Rating:</span>
            <span className="text-yellow-500 font-semibold">{game.rating}/10</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Género:</span>
            <span className="text-blue-400">{game.genres[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Plataforma:</span>
            <span className="text-purple-400">{game.platforms[0]}</span>
          </div>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => onRemove(game.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Trash2 className="w-4 h-4" />
          Quitar de Favoritos
        </button>
      </div>

      {/* Efecto de glow en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 pointer-events-none transition-all duration-300" />
    </div>
  );
};
