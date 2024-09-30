from models.modelos import Caja as CajaModel
from schemas.caja import Caja


class CajaService():
    
    def __init__(self, db) -> None:
        self.db = db

    def get_cajas(self):
        result = self.db.query(CajaModel).all()
        return result

    def get_caja_id(self, id):
        result = self.db.query(CajaModel).filter(CajaModel.id_caja == id).first()
        return result

    def create_caja(self, caja: Caja):
        new_caja = CajaModel(**caja.dict())
        self.db.add(new_caja)
        self.db.commit()
        return

    def update_caja(self, id: int, data: Caja):
        caja = self.db.query(CajaModel).filter(CajaModel.id_caja == id).first()
        if caja:
            caja.fecha = data.fecha
            caja.total = data.total
            caja.estado = data.estado
            self.db.commit()
        return

    def delete_caja(self, id: int):
        self.db.query(CajaModel).filter(CajaModel.id_caja == id).delete()
        self.db.commit()
        return
