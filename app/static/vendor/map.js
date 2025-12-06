const API_KEY = 'be5ad339c7b6e1759183813ad1009a16';

// Fetch movie list from backend
async function loadMovies() {
    const response = await fetch('/movies');
    const movies = await response.json();

    const select = document.getElementById("movie-select");
    movies.forEach(movie => {
        let option = document.createElement("option");
        option.value = movie.id;
        option.textContent = movie.title;
        select.appendChild(option);
    });
}

// Fetch recommendations from backend
async function getRecommendations() {
    let movieId = document.getElementById("movie-select").value;
    let response = await fetch(`/recommend?movie_id=${movieId}`);
    let data = await response.json();

    let container = document.getElementById("movies-container");
    container.innerHTML = "";

    data.forEach(movie => {
        let div = document.createElement("div");
        div.classList.add("movie-card");
        div.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><p>${movie.title}</p>`;
        container.appendChild(div);
    });
}

// Load movies when the page loads
window.onload = loadMovies;
