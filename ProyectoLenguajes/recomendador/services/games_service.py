import requests
from django.contrib.auth.models import User
from recomendador.repositories.game_repo import GameRepository
from recomendador.processor import filtrar_videojuegos
from recomendador.logic import obtener_recomendacion_final

API_KEY = "1c0ceafa6be94108aab04750092adbd7"
API_URL = "https://api.rawg.io/api/games"


class GamesService:
    """Service para lógica de negocio de juegos"""
    
    def __init__(self):
        self.game_repo = GameRepository()
    
    def fetch_games_from_api(self, params=None):
        """Obtener juegos de la API externa"""
        if params is None:
            params = {}
        
        default_params = {"key": API_KEY}
        all_params = {**default_params, **params}
        
        try:
            response = requests.get(API_URL, params=all_params, timeout=10)
            response.raise_for_status()
            return response.json().get("results", [])
        except requests.RequestException as e:
            print(f"Error fetching games: {e}")
            return []
    
    def search_games(self, nombre: str = None, genero: str = None, plataforma: str = None):
        """Buscar juegos con filtros"""
        search_params = {}
        
        if nombre:
            search_params["search"] = nombre
        if genero:
            # La API de RAWG espera slugs de género (ej: "action", "role-playing-games-rpg")
            search_params["genres"] = genero
        if plataforma:
            # La API de RAWG espera IDs de plataforma (ej: "4", "187")
            search_params["platforms"] = plataforma
        
        search_params["page_size"] = 30  # Aumentar para tener más opciones
        
        videojuegos = self.fetch_games_from_api(search_params)
        
        # La API de RAWG ya filtra por género y plataforma, pero si no hay resultados
        # y hay filtros, intentar búsqueda más amplia primero
        if (not videojuegos) and (genero or plataforma):
            # Si no hay resultados con filtros estrictos, intentar sin filtros pero con nombre
            if nombre:
                search_params_wide = {"search": nombre, "page_size": 30}
                videojuegos = self.fetch_games_from_api(search_params_wide)
                # Luego filtrar localmente
                if genero:
                    videojuegos = [v for v in videojuegos if any(
                        g.get('slug', '').lower() == genero.lower() or 
                        g.get('name', '').lower() == genero.lower() 
                        for g in v.get('genres', [])
                    )]
                if plataforma:
                    videojuegos = [v for v in videojuegos if any(
                        str(p.get('platform', {}).get('id', '')) == plataforma or
                        p.get('platform', {}).get('name', '').lower() in ['pc', 'playstation', 'xbox', 'nintendo']
                        for p in v.get('platforms', [])
                    )]
        
        # Obtener recomendados (rating >= 4)
        destacados = obtener_recomendacion_final(videojuegos)
        
        # Formatear respuesta
        return {
            'results': videojuegos,
            'highlighted': destacados,
            'total': len(videojuegos)
        }
    
    def get_recommended_games(self, user: User = None):
        """Obtener juegos recomendados"""
        params = {"page_size": 12, "ordering": "-rating"}
        
        # Si hay usuario con perfil, usar sus preferencias
        if user and hasattr(user, 'profile'):
            profile = user.profile
            if profile.genero_preferido:
                params["genres"] = profile.genero_preferido
            if profile.plataforma_preferida:
                params["platforms"] = profile.plataforma_preferida
        
        games = self.fetch_games_from_api(params)
        
        return games
    
    def get_ia_game_of_the_day(self):
        """Obtener juego del día (mock para IA)"""
        # Por ahora, obtener el juego más popular del día
        params = {"page_size": 1, "ordering": "-added"}
        games = self.fetch_games_from_api(params)
        
        if games:
            return games[0]
        return None
    
    def add_favorite(self, user: User, api_id: int):
        """Agregar juego a favoritos"""
        # Obtener información del juego de la API
        games = self.fetch_games_from_api({"ids": api_id})
        
        if not games:
            raise ValueError("Juego no encontrado")
        
        game = games[0]
        
        # Extraer información
        nombre = game.get('name', 'Sin nombre')
        imagen = game.get('background_image', '')
        rating = game.get('rating', 0)
        genero = ", ".join([g['name'] for g in game.get('genres', [])])
        plataforma = ", ".join([p['platform']['name'] for p in game.get('platforms', [])])
        
        # Agregar a favoritos
        favorito, created = self.game_repo.add_favorite(
            user, api_id, nombre, imagen, rating, genero, plataforma
        )
        
        if not created:
            raise ValueError("El juego ya está en favoritos")
        
        return favorito
    
    def remove_favorite(self, user: User, favorito_id: int):
        """Eliminar favorito"""
        success = self.game_repo.remove_favorite(user, favorito_id)
        
        if not success:
            raise ValueError("Favorito no encontrado")
        
        return True
    
    def get_user_favorites(self, user: User):
        """Obtener favoritos del usuario"""
        favoritos = self.game_repo.get_user_favorites(user)
        
        return [
            {
                'id': fav.id,
                'api_id': fav.api_id,
                'nombre': fav.nombre,
                'imagen': fav.imagen,
                'rating': fav.rating,
                'genero': fav.genero,
                'plataforma': fav.plataforma,
                'created_at': fav.created_at.isoformat() if hasattr(fav, 'created_at') else None,
            }
            for fav in favoritos
        ]
    
    def mark_games_as_favorites(self, games: list, user: User):
        """Marcar juegos que son favoritos del usuario"""
        if not user or not user.is_authenticated:
            for game in games:
                game['es_favorito'] = False
            return games
        
        # Obtener IDs de favoritos del usuario
        favoritos = self.game_repo.get_user_favorites(user)
        favoritos_ids = {fav.api_id for fav in favoritos}
        
        # Marcar juegos
        for game in games:
            game['es_favorito'] = game.get('id') in favoritos_ids
        
        return games

