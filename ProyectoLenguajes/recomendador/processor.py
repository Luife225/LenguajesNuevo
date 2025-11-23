def filtrar_videojuegos(videojuegos, genero=None, plataforma=None):
    if genero:
        videojuegos = list(filter(lambda v: any(g['name'].lower() == genero.lower() for g in v.get('genres', [])), videojuegos))
    if plataforma:
        videojuegos = list(filter(lambda v: any(p['platform']['name'].lower() == plataforma.lower() for p in v.get('platforms', [])), videojuegos))
    return videojuegos
