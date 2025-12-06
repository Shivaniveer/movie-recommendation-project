import os
import pandas as pd
import ast
from flask import Blueprint, render_template, request

reco_country = Blueprint('reco_country', __name__)
userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

# ------------------- Load Movie Data -------------------
def load_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'movies.csv')
    df = pd.read_csv(csv_path)

    # Parse and clean production_countries
    df['production_countries'] = df['production_countries'].fillna('[]').apply(ast.literal_eval)
    df['country_names'] = df['production_countries'].apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])

    return df[['title', 'release_date', 'overview', 'country_names']]

df = load_data()

# ------------------- Country-wise Movie Filter -------------------
@reco_country.route('/reco_country', methods=['GET', 'POST'])
def filter_by_country():
    # Get unique country names
    country_set = set()
    for countries in df['country_names']:
        country_set.update(countries)
    country_list = sorted(list(country_set))

    filtered_movies = []

    if request.method == "POST":
        selected_country = request.form.get('country')
        if selected_country:
            filtered_df = df[df['country_names'].apply(lambda x: selected_country in x)]

            for _, row in filtered_df.iterrows():
                poster_filename = f"{row['title']}.jpg"
                poster_url = f"/static/posters/{poster_filename}"
                filtered_movies.append({
                    "title": row['title'],
                    "release_date": row['release_date'],
                    "overview": row['overview'],
                    "poster_url": poster_url
                })

    return render_template("recomendation_countrywise.html",userdetails=userdetails, countries=country_list,
                           movies=filtered_movies)
