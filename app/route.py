from flask import render_template
from app import app

@app.route('/')
def home():
    userdetails = {"name": "shivani veer", "email": "john@example.com"}
    return render_template('home.html', userdetails=userdetails)
