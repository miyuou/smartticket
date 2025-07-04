from extensions import ma
from models.categorie import Categorie

class CategorieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Categorie
        load_instance = True

categorie_schema = CategorieSchema()
categories_schema = CategorieSchema(many=True) 