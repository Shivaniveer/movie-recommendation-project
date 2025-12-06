# from tmdbv3api import TMDb, Movie
# import requests
# import os
# import pandas as pd
#
# tmdb = TMDb()
# tmdb.api_key = 'be5ad339c7b6e1759183813ad1009a16'  # Replace with your real API key
#
# movie_search = Movie()
#
# df = pd.read_csv("D:/Shivadya/app/movies.csv")  # Update path
#
# os.makedirs("static/posters", exist_ok=True)
#
# for title in df['title']:
#     try:
#         result = movie_search.search(title)
#         if result:
#             poster_path = result[0].poster_path
#             if poster_path:
#                 full_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
#                 response = requests.get(full_url)
#                 if response.status_code == 200:
#                     with open(f"static/posters/{title}.jpg", "wb") as f:
#                         f.write(response.content)
#                     print(f"✅ Downloaded: {title}")
#                 else:
#                     print(f"❌ Failed for {title}")
#         else:
#             print(f"🔍 No result found for: {title}")
#     except Exception as e:
#         print(f"Error processing {title}: {e}")
