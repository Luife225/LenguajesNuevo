import { Star } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/30 backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300 card-hover">
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
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {game.title}
        </h3>
        
        {/* Géneros */}
        <div className="flex flex-wrap gap-2 mb-3">
          {game.genres.slice(0, 2).map((genre, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Plataformas */}
        <div className="text-sm text-gray-400">
          {game.platforms.slice(0, 3).join(' • ')}
        </div>
      </div>

      {/* Efecto de glow en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 pointer-events-none transition-all duration-300" />
    </div>
  );
};
