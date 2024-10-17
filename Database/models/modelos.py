from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from config.database import Base

# Tabla Usuarios (esta tabla no cambia)
class Usuarios(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(16), nullable=False)
    email = Column(String(25), unique=True, nullable=False, index=True)
    password = Column(String(60), nullable=False)  # Ajustado para almacenar hashes de contraseñas seguros
    rol = Column(String(20), nullable=False)

    # Relación con la tabla Venta (Un usuario puede realizar varias ventas)
    ventas = relationship("Venta", back_populates="usuario")
    
    # Relación con la tabla Caja (Un usuario puede estar asociado a varias cajas)
    cajas = relationship("Caja", back_populates="usuario")


# Tabla Productos
# Modelo Producto
class Producto(Base):
    __tablename__ = 'productos'
    id_producto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cod_barra = Column(String(50), nullable=False)
    descripcion = Column(String(255), nullable=True)
    precio_coste = Column(Float, nullable=False)
    precio_final = Column(Float, nullable=False)
    peso = Column(Float, nullable=False)
    imagen = Column(String(255), nullable=True)
    id_categoria = Column(Integer, ForeignKey('categorias.id_categoria'), nullable=False)

    # Relación con la tabla VentaProducto
    venta_productos = relationship("VentaProducto", back_populates="producto")

    # Relación inversa hacia Categoría (esto es lo que faltaba)
    categoria = relationship("Categoria", back_populates="productos")

    

# Tabla Categorías
class Categoria(Base):
    __tablename__ = 'categorias'
    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    descripcion = Column(String(255), nullable=True)

    # Relación inversa con la tabla Productos
    productos = relationship("Producto", back_populates="categoria")


# Tabla Venta
class Venta(Base):
    __tablename__ = 'venta'
    id_venta = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    total = Column(Float, nullable=False)
    tipo_pago = Column(String(50), nullable=False)
    fecha = Column(Date, nullable=False)

    # Relación con la tabla VentaProducto (una venta puede tener muchos productos)
    venta_productos = relationship("VentaProducto", back_populates="venta")

    # Relación con la tabla Usuarios (cada venta está asociada a un usuario)
    usuario = relationship("Usuarios", back_populates="ventas")

    # Relación con la tabla Caja (si es que corresponde)
    cajas = relationship("Caja", back_populates="venta")

    
    
## Tabla VentaProducto
class VentaProducto(Base):
    __tablename__ = 'venta_producto'
    id_venta_producto = Column(Integer, primary_key=True, index=True)
    id_venta = Column(Integer, ForeignKey('venta.id_venta'), nullable=False)
    id_producto = Column(Integer, ForeignKey('productos.id_producto'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)  # Precio total por este producto en la venta

    # Relación con las tablas Venta y Producto
    venta = relationship("Venta", back_populates="venta_productos")
    producto = relationship("Producto", back_populates="venta_productos")

# Tabla Caja
class Caja(Base):
    __tablename__ = 'caja'
    id_caja = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False)
    id_venta = Column(Integer, ForeignKey('venta.id_venta'), nullable=False)  # Relacionada con id_venta de Venta
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)  # Relacionada con id de Usuarios
    total = Column(Float, nullable=False)
    estado = Column(String(50), nullable=False)

    # Relación con la tabla Venta
    venta = relationship("Venta", back_populates="cajas")
    
    # Relación con la tabla Usuarios (cada caja está asociada a un usuario)
    usuario = relationship("Usuarios", back_populates="cajas")
