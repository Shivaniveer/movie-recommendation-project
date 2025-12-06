from flask import Blueprint, render_template, request
import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import os
recomendation = Blueprint('recomendation', __name__)

userdetails = {"UserName": "shivani veer", "email": "john@example.com"}

def load_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'movies.csv')
    df = pd.read_csv(csv_path)

    # Replace NaNs with empty lists (as strings)
    df['genres'] = df['genres'].fillna('[]')
    df['keywords'] = df['keywords'].fillna('[]')
    df['overview'] = df['overview'].fillna('')

    df['genres'] = df['genres'].apply(ast.literal_eval)
    df['keywords'] = df['keywords'].apply(ast.literal_eval)

    df['genres'] = df['genres'].apply(lambda x: [i['name'] for i in x])
    df['keywords'] = df['keywords'].apply(lambda x: [i['name'] for i in x])

    df['tags'] = df['overview'] + ' ' + df['genres'].apply(lambda x: ' '.join(x)) + ' ' + df['keywords'].apply(lambda x: ' '.join(x))

    return df[['movie_id', 'title', 'tags']]

df = load_data()

# -------------------- Vectorization ---------------------
tfidf = TfidfVectorizer(stop_words='english')
vector = tfidf.fit_transform(df['tags'].fillna(''))
similarity = cosine_similarity(vector)
def recommend(movie):
    try:
        idx = df[df['title'].str.lower() == movie.lower()].index[0]
    except IndexError:
        return []  # Return empty if movie not found

    distances = sorted(list(enumerate(similarity[idx])), reverse=True, key=lambda x: x[1])
    results = []
    for i in distances[1:6]:
        title = df.iloc[i[0]].title
        poster_url = f"/static/posters/{title}.jpg"
        results.append((title, poster_url))
    return results


# -------------------- Blueprint Route ---------------------
@recomendation.route('/recomendation', methods=['GET', 'POST'])
def home():
    suggestions = []
    if request.method == "POST":
        movie = request.form['movie']
        suggestions = recommend(movie)
    return render_template("recomendation.html", userdetails=userdetails, suggestions=suggestions)
