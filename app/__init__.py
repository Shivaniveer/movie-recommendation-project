from flask import Flask
from datetime import datetime, timedelta
import pandas as pd
import pyodbc

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

# Import Blueprints
from app.youtube import youtube
from app.recomendation import recomendation
from app.information import info
from app.chatbot import chatbot
from app.recomendation_date import reco_date
from app.contrywise import reco_country

# Register Blueprints
app.register_blueprint(reco_country)
app.register_blueprint(youtube)
app.register_blueprint(recomendation)
app.register_blueprint(info)
app.register_blueprint(chatbot)
app.register_blueprint(reco_date)

# Import routes (home page)
from app import route
