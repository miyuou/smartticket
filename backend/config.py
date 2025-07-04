import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'mysql://user:password@localhost:3306/smartticket')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads') 