from models.modelos import Venta as VentaModel
from schemas.ventas import Venta


class VentaService:
    
    def __init__(self, db) -> None:
        self.db = db

    def get_ventas(self):
        result = self.db.query(VentaModel).all()
        return result

    def get_venta_id(self, id: int):
        result = self.db.query(VentaModel).filter(VentaModel.id_venta == id).first()
        return result
    
    def create_venta(self, venta: Venta):
        new_venta = VentaModel(**venta.dict())
        self.db.add(new_venta)
        self.db.commit()
        return

    def update_venta(self, id: int, data: Venta):
        venta = self.db.query(VentaModel).filter(VentaModel.id_venta == id).first()
        if not venta:
            return None
        
        venta.id_producto = data.id_producto
        venta.id_usuario = data.id_usuario
        venta.total = data.total
        venta.cantidad_producto = data.cantidad_producto
        venta.tipo_pago = data.tipo_pago
        venta.fecha = data.fecha
        self.db.commit()
        return venta

    def delete_venta(self, id: int):
        self.db.query(VentaModel).filter(VentaModel.id_venta == id).delete()
        self.db.commit()
        return
