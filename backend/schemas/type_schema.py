from extensions import ma
from models.type import Type

class TypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Type
        load_instance = True

type_schema = TypeSchema()
types_schema = TypeSchema(many=True) 