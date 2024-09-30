from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from config.database import engine, Base
from middlewares.error_handler import ErrorHandler
from routers.caja import caja_router
from routers.usuarios import usuarios_router
from routers.productos import producto_router  # Modificado para usar el router de productos
from routers.ventas import ventas_router  # Modificado para usar el router de ventas
from routers.categorias import categoria_router  # Agregado router para categorías
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.title = "Mi aplicación con FastAPI"
app.version = "0.0.1"

# Middleware
app.add_middleware(ErrorHandler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers
app.include_router(caja_router)  # Router para cajas
app.include_router(usuarios_router)  # Router para usuarios
app.include_router(producto_router)  # Router para productos
app.include_router(ventas_router)  # Router para ventas
app.include_router(categoria_router)  # Router para categorías

# Crear todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

@app.get('/', tags=['home'])
def message():
    return HTMLResponse('<h1>Hello world</h1>')
