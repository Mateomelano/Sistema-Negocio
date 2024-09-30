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


# Tabla Productos
class Producto(Base):
    __tablename__ = 'productos'
    id_producto = Column(Integer, primary_key=True, index=True)
    cod_barra = Column(String(50), nullable=False)
    precio_coste = Column(Float, nullable=False)
    precio_final = Column(Float, nullable=False)
    peso = Column(Float, nullable=False)
    imagen = Column(String(255), nullable=True)  # La imagen puede ser nullable
    id_categoria = Column(Integer, ForeignKey('categorias.id_categoria'), nullable=False)

    # Relación con la tabla Categorías
    categoria = relationship("Categoria", back_populates="productos")
    ventas = relationship("Venta", back_populates="producto")


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
    id_producto = Column(Integer, ForeignKey('productos.id_producto'), nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)  # Relación con la tabla Usuarios
    total = Column(Float, nullable=False)
    cantidad_producto = Column(Integer, nullable=False)
    tipo_pago = Column(String(50), nullable=False)
    fecha = Column(Date, nullable=False)

    # Relación con la tabla Productos
    producto = relationship("Producto", back_populates="ventas")
    
    # Relación con la tabla Usuarios (cada venta está asociada a un usuario)
    usuario = relationship("Usuarios", back_populates="ventas")

    # Relación con la tabla Caja
    cajas = relationship("Caja", back_populates="venta")


# Tabla Caja
class Caja(Base):
    __tablename__ = 'caja'
    id_caja = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False)
    id_venta = Column(Integer, ForeignKey('venta.id_venta'), nullable=False)  # Relacionada con id_venta de Venta
    total = Column(Float, nullable=False)
    estado = Column(String(50), nullable=False)

    # Relación con la tabla Venta
    venta = relationship("Venta", back_populates="cajas")
