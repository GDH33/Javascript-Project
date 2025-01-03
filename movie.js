var searchInput = document.getElementById("input");
var displaySearchList = document.getElementsByClassName('favorite')

const apikey = '239474ee';
const url = `https://www.omdbapi.com/?i=tt3896198&apikey=239474ee`;


fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))

searchInput.addEventListener("input", findMovies);

async function singleMovie() {
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${apikey}&`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

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
    `
  
    document.querySelector('.movie-container').innerHTML = output

}

async function addTofavorites(id) {
    console.log("fav-item", id)

    localStorage.setItem(Math.random().toString(36).slice(2, 7), 
    `https://www.omdbapi.com/?i=tt3896198&apikey=239474ee`);
    alert('Movie added to Watchlist')
}

async function removeFromFavorites(id) {
    console.log(id);
    for (let i =0; i < localStorage.length; i++){
        let key = localStorage.key(i)
        if (localStorage.getItem(key) === id) {
            localStorage.removeItem(key)
            break;
        }
}
    alert ('Movie removed to Watchlist');
    window.location.replace('favorite.html')
}

async function displayMovieList(movies) {
    var output = '';

    for (i of movies) {
        var img = '';
        if (i.poster != 'N/A') {
            img = i.Poster
        }
        else {
            img = 'img/blank-poster.webp';
        }
        var id = i.imdbID;

        output += `
        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    document.querySelector('.favorite').innerHTML = output;
    console.log("here is movie list . .", movies);
}

async function findMovies() {
    if (searchInput.value.length > 1) {
        const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&apikey=${apikey}&`;
        const res = await fetch(`${url}`);
        const data = await res.json();

    if (data.search) {
        displayMovieList(data.search)
    }
  }
}

async function favoriteMovieLoader() {
    var output = '';
    for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)
            let id = localStorage.getItem(key)

            if (id != null) {
            const url =  `https://www.omdbapi.com/?i=${id}&apikey=${apikey}&`
            const res = await fetch(`${url}`)
            const data = await res.json();
            console.log(data)

            var img = '';
            if (data.poster) {
                img = data.Poster
            }
            else {img + data.Title}
            let id = data.imdbID;

            output += `
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
document.querySelector('.favorite').innerHTML = output;
}