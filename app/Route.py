import time
import traceback
from collections import defaultdict
from datetime import datetime, timedelta
from app import app
import pyodbc
import pandas as pd
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, Blueprint
from app.youtube import youtube
from app.recomendation import recomendation
from app.information import info
from app.chatbot import chatbot
from app.recomendation_date import reco_date
from app.contrywise import reco_country
userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

@app.route('/')
def home():
    userdetails = {"name": "shivani veer", "email": "john@example.com"}  # Sample data
    return render_template('home.html', userdetails=userdetails)

app.register_blueprint(reco_country)
app.register_blueprint(youtube)
app.register_blueprint(recomendation)
app.register_blueprint(info)
app.register_blueprint(chatbot)
app.register_blueprint(reco_date)