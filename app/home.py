import pandas as pd
import pyodbc
from flask import Blueprint, render_template
home_bp = Blueprint("home", __name__)  # ✅ Use "home_bp" instead of "home"

@home_bp.route("/")  # ✅ Correctly define the route
def home():
    userdetails = {"name": "shivani veer", "email": "john@example.com"}
    return render_template("home.html", userdetails=userdetails)