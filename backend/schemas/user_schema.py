from extensions import ma
from models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("mot_de_passe",)

user_schema = UserSchema()
users_schema = UserSchema(many=True) 