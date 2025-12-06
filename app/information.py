import pandas as pd
import pyodbc
from flask import Blueprint, render_template

# Define the Blueprint first
info = Blueprint('info', __name__)

userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

@info.route('/info', methods=['GET', 'POST'])
def informat():
    return render_template("informattion.html", userdetails=userdetails)
