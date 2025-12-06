import os
import pandas as pd
from flask import Blueprint, render_template, request

reco_date = Blueprint('reco_date', __name__)
userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

# ------------------- Load Movie Data -------------------
def load_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'movies.csv')
    df = pd.read_csv(csv_path)

    df['release_date'] = pd.to_datetime(df['release_date'], errors='coerce')
    df['year'] = df['release_date'].dt.year

    return df[['title', 'year', 'release_date', 'overview', 'genres', 'movie_id']]

df = load_data()

# ------------------- Year-wise Movie Filter -------------------
@reco_date.route('/reco_date', methods=['GET', 'POST'])
def filter_by_year():
    years = sorted(df['year'].dropna().unique().astype(int).tolist())
    filtered_movies = []

    if request.method == "POST":
        selected_year = request.form.get('year')
        if selected_year:
            selected_year = int(selected_year)
            filtered_df = df[df['year'] == selected_year]

            for _, row in filtered_df.iterrows():
                poster_filename = f"{row['title']}.jpg"
                poster_url = f"/static/posters/{poster_filename}"
                filtered_movies.append({
                    "title": row['title'],
                    "release_date": row['release_date'].strftime('%d-%m-%Y') if pd.notnull(row['release_date']) else 'N/A',
                    "overview": row['overview'],
                    "poster_url": poster_url
                })

    return render_template("recomendation_datewise.html",
                           userdetails=userdetails,
                           years=years,
                           movies=filtered_movies)
