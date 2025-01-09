const searchInput = document.getElementById("input");
const displaySearchList = document.getElementsByClassName("favorite");

const apikey = "239474ee";
const searchBar = document.getElementsByClassName("search__bar").value;
const url = `https://www.omdbapi.com/?apikey=${apikey}&s=${searchBar}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => console.log(data));

searchInput?.addEventListener("input", findMovies);

async function singleMovie() {
  var urlQueryParams = new URLSearchParams(window.location.search);
  var id = urlQueryParams.get("id");

  if (!id) {
    console.log("<p>No movies found</p>");
    return;
  }

  const movieUrl = `https://www.omdbapi.com/?apikey=${apikey}&i=${id}`;
  const res = await fetch(movieUrl);
  const data = await res.json();
  console.log(data);
  console.log(movieUrl);

  var output = `  

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
        </div>
        <div class="movie-details">
            <div class="details-header">
                <div class="dh-ls">
                    <h2>${data.Title}</h2>
                </div>
                <div class="dh-rs">
                    <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
                </div>
            </div>
            <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                        style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
            <ul class="details-ul">
                <li><strong>Actors: </strong>${data.Actors}</li>
                <li><strong>Director: </strong>${data.Director}</li>
                <li><strong>Writers: </strong>${data.Writer}</li>
            </ul>
            <ul class="details-ul">
                <li><strong>Genre: </strong>${data.Genre}</li>
                <li><strong>Release Date: </strong>${data.DVD}</li>
                <li><strong>Box Office: </strong>${data.BoxOffice}</li>
                <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
            </ul>
            <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
            <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
                <i class="fa-solid fa-award"></i>
                &thinsp; ${data.Awards}
            </p>
        </div> 
    `;

  document.querySelector(".movie-container").innerHTML = output;
}

async function addTofavorites(id) {
  console.log("fav-item", id);

  localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
  alert("Movie added to favorites");
}

async function removeFromFavorites(id) {
    if (!id) {
      alert("Invalid movie ID");
      return;
    }
  
    try {
      const key = Object.keys(localStorage).find(key => localStorage.getItem(key) === id);
      
      if (key) {
        localStorage.removeItem(key);
        alert("Movie removed from favorites");
        window.location.replace("favorite.html");
      } else {
        alert("Movie not found in favorites");
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      alert("Error removing movie from favorites");
    }
  }

async function displayMovieList(movies) {
  console.log("Movies received", movies);
  var output = "";

  if (!Array.isArray(movies) || movies.length === 0) {
    console.log("No movie found");
    document.querySelector(".fav-container").innerHTML =
      "<p>No movies found</p>";
    return;
  }

  for (let movie of movies) {
    let img = movie.Poster !== "N/A" ? movie.Poster : "img/blank-poster.webp";
    let id = movie.imdbID;

    output += `
        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${movie.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${movie.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
  document.querySelector(".fav-container").innerHTML = output;
}

async function findMovies() {
  if (searchInput.value.length > 0) {
    try {
      const url = `https://www.omdbapi.com/?apikey=${apikey}&s=${searchInput.value.trim()}`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data);

      if (data.Search && Array.isArray(data.Search)) {
        displayMovieList(data.Search);
      } else {
        document.querySelector(".fav-container").innerHTML =
          "<p>No movies found</p>";
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      document.querySelector(".fav-container").innerHTML =
        "<p>Error fetching movies</p>";
    }
  }
}

async function favoriteMovieLoader() {
  const favoriteContainer = document.querySelector(".favorite");
  favoriteContainer.innerHTML = '<div class="loading">Loading favorites...</div>';
  
  try {
    let output = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const id = localStorage.getItem(key);

      if (id) {
        const movieUrl = `https://www.omdbapi.com/?apikey=${apikey}&i=${id}`;
        const res = await fetch(movieUrl);
        const data = await res.json();

        if (data.Response === "False") {
          continue;
        }

        const img = data.Poster || "img/blank-poster.webp";
        const movieId = data.imdbID;

        output += `
          <div class="fav-item">
            <div class="fav-poster">
              <a href="movie.html?id=${movieId}"><img src="${img}" alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
              <div class="fav-details-box">
                <div>
                  <p class="fav-movie-name">${data.Title}</p>
                  <p class="fav-movie-rating">${data.Year} &middot; <span
                    style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                </div>
                <div style="color: maroon">
                  <i class="fa-solid fa-trash" style="cursor:pointer;" onclick="removeFromFavorites('${movieId}')"></i>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }
    favoriteContainer.innerHTML = output;
  } catch (error) {
    console.error("Error loading favorite movies:", error);
    favoriteContainer.innerHTML = "<p>Error loading favorite movies</p>";
  }
}

function openMenu() {
    document.body.classList += " menu--open";
}

function closeMenu() {
    document.body.classList.remove('menu--open');
}

function linkToHome(){
    location.href = "index.html";
}