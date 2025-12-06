import pandas as pd
import pyodbc
from flask import Blueprint, render_template

# Define the Blueprint first
youtube = Blueprint('youtube', __name__)

userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

@youtube.route('/youtubess', methods=['GET', 'POST'])
def cash_prediction():
    return render_template("youtube.html", userdetails=userdetails)
