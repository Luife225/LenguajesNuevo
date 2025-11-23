from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import random
from datetime import datetime


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_ia(request):
    """POST /api/ia/chat/ - Chat con IA (mock)"""
    mensaje = request.data.get('mensaje', '')
    
    if not mensaje:
        return Response(
            {'error': 'El mensaje es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Respuestas mock basadas en palabras clave
    mensaje_lower = mensaje.lower()
    
    respuestas_mock = [
        "Te recomiendo explorar juegos de acción y aventura. Son muy emocionantes!",
        "Basándome en tus preferencias, creo que te gustarían juegos RPG con historias profundas.",
        "Los juegos indie suelen tener mecánicas innovadoras. Vale la pena probarlos!",
        "Los shooters competitivos son ideales si buscas acción rápida.",
        "Si prefieres algo más relajado, los juegos de estrategia te pueden interesar.",
    ]
    
    # Seleccionar respuesta basada en palabras clave
    if any(palabra in mensaje_lower for palabra in ['acción', 'action', 'combate']):
        respuesta = "Para juegos de acción, te recomiendo explorar títulos como Doom Eternal o Devil May Cry. ¡Son intensos y emocionantes!"
    elif any(palabra in mensaje_lower for palabra in ['rpg', 'rol', 'historia']):
        respuesta = "Los RPG como The Witcher 3 o Final Fantasy ofrecen historias épicas y mundos inmersivos."
    elif any(palabra in mensaje_lower for palabra in ['indie', 'pequeño', 'independiente']):
        respuesta = "Los juegos indie como Hollow Knight o Celeste ofrecen experiencias únicas y creativas."
    elif any(palabra in mensaje_lower for palabra in ['favorito', 'me gusta', 'preferencia']):
        respuesta = "Basándome en tus juegos favoritos, te sugiero explorar géneros similares o juegos con mecánicas parecidas."
    else:
        respuesta = random.choice(respuestas_mock)
    
    return Response({
        'respuesta': respuesta,
        'timestamp': datetime.now().isoformat(),
        'modelo': 'mock-ia-v1.0'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analisis_usuario(request):
    """GET /api/ia/analisis-usuario/ - Análisis de usuario (mock)"""
    user = request.user
    
    # Obtener información básica del usuario
    genero_preferido = None
    plataforma_preferida = None
    
    try:
        profile = user.profile
        genero_preferido = profile.genero_preferido
        plataforma_preferida = profile.plataforma_preferida
    except:
        pass
    
    # Generar análisis mock
    generos_favoritos = ['Action', 'Adventure', 'RPG', 'Indie']
    plataformas_favoritas = ['PC', 'PS5', 'Xbox', 'Switch']
    
    analisis = {
        'usuario_id': user.id,
        'username': user.username,
        'preferencias_actuales': {
            'genero': genero_preferido or 'No especificado',
            'plataforma': plataforma_preferida or 'No especificada'
        },
        'analisis': {
            'generos_recomendados': random.sample(generos_favoritos, 3),
            'plataformas_recomendadas': random.sample(plataformas_favoritas, 2),
            'nivel_experiencia': random.choice(['Principiante', 'Intermedio', 'Avanzado']),
            'tipo_jugador': random.choice(['Casual', 'Competitivo', 'Explorador', 'Completista'])
        },
        'recomendaciones_personales': [
            "Explora juegos indie para descubrir experiencias únicas",
            "Prueba géneros diferentes para ampliar tus horizontes",
            "Considera juegos multiplayer para conectar con otros jugadores"
        ],
        'timestamp': datetime.now().isoformat(),
        'modelo': 'mock-ia-analytics-v1.0'
    }
    
    return Response(analisis, status=status.HTTP_200_OK)

