from extensions import ma
from models.statut import Statut

class StatutSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Statut
        load_instance = True

statut_schema = StatutSchema()
statuts_schema = StatutSchema(many=True) 