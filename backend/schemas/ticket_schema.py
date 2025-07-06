from extensions import ma
from models.ticket import Ticket
from models.user import User
from models.categorie import Categorie
from models.statut import Statut
from models.type import Type
from schemas.categorie_schema import CategorieSchema
from schemas.statut_schema import StatutSchema
from schemas.type_schema import TypeSchema
from schemas.user_schema import UserSchema

class TicketSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        load_instance = True
        include_fk = True
    categorie = ma.Nested(CategorieSchema, only=("id", "nom"))
    statut = ma.Nested(StatutSchema, only=("id", "nom"))
    type = ma.Nested(TypeSchema, only=("id", "nom"))
    techniciens = ma.Nested(UserSchema, only=("id", "nom", "email", "role"), many=True)

ticket_schema = TicketSchema()
tickets_schema = TicketSchema(many=True) 