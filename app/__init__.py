import os

from flask import Flask
from config import Config
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
RqUID = os.environ.get('RqUID')
Authorization = os.environ.get('Authorization')
login = LoginManager(app)
login.login_view = 'login'
cors = CORS(app)
app.static_folder ='static'


from app import routes, models