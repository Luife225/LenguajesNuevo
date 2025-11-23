def obtener_recomendacion_final(videojuegos):
    """
    Retorna una lista de nombres de videojuegos con una puntuación de 4 o más.
    """
    recomendados = [v['name'] for v in videojuegos if v.get('rating', 0) >= 4]
    return recomendados
