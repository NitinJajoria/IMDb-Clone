const API_KEY = "39fe01a2d3d121ecb6be1779a37bd842";
const URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=39fe01a2d3d121ecb6be1779a37bd842&page=1"
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=39fe01a2d3d121ecb6be1779a37bd842&query=";
const image_path = `https://image.tmdb.org/t/p/w1280`

const movieContainer = document.querySelector(".movies-container");
const input = document.querySelector('.header input')
const heading = document.querySelector('.heading')
const moviePage = document.querySelector('.movie-page')
const favoriteMovies = document.querySelector('.favorite-page')
const favMoviesPage = document.querySelector('.favorite-movie-page')
const xIcon = document.querySelector('#x-icon')
const favIcon = document.querySelector('nav .fav-icon')

// console.log(favIcon, favMoviesPage, xIcon)

// For Click Event on Movie Card
function clickEvent (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () =>  show_movie(card))
    })
}

// For Click Event on Favorite Icon  
function clickEventOpen () {
    favIcon.addEventListener('click', () =>  openFavPage())
}
clickEventOpen ()

function clickEventClose () {
    xIcon.addEventListener('click', () =>  closeFavPage())
}
clickEventClose ()

function openFavPage(){
    favMoviesPage.classList.add('show_page')
}
function closeFavPage(){
    favMoviesPage.classList.remove('show_page')
}


// Local Storage 
function get_LS (){
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null ? [] : movie_ids
}

function add_to_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}

function remove_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}

// To Show Selected Movie
async function get_movie_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const data = await resp.json()
    return data
}

async function show_movie (card) {
    moviePage.classList.add('show_page')

    const movie_id = card.getAttribute('data-id')
    const movie = await get_movie_by_id(movie_id)

    moviePage.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`

    moviePage.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
        <div class="left">
            <div class="poster-img">
                <img src="${image_path + movie.poster_path}" alt="">
            </div>
            <div class="single-info">
                <span>Add to favorites:</span>
                <span class="heart-icon">&#9829;</span>
            </div>
        </div>
        <div class="right">
            <h1>${movie.title}</h1>
            <h3>${movie.tagline}</h3>
            <div class="single-info-container">
                <div class="single-info">
                    <span>Language:</span>
                    <span>${movie.spoken_languages[0].name}</span>
                </div>
                <div class="single-info">
                    <span>Length:</span>
                    <span>${movie.runtime} minutes</span>
                </div>
                <div class="single-info">
                    <span>Rate:</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Budget:</span>
                    <span>$ ${movie.budget}</span>
                </div>
                <div class="single-info">
                    <span>Release Date:</span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
            <div class="genres">
                <h2>Genres</h2>
                <ul>
                    ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                </ul>
            </div>
            <div class="overview">
                <h2>Overview</h2>
                <p>${movie.overview}</p>
            </div>
        </div>
    </div> 
    `
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () => moviePage.classList.remove('show_page'))

    const heart_icon = moviePage.querySelector('.heart-icon')

    const movie_ids = get_LS()
    for(let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color')
    }

    heart_icon.addEventListener('click', () => {
        if(heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id)
            heart_icon.classList.remove('change-color')
        } else {
            add_to_LS(movie_id)
            heart_icon.classList.add('change-color')
        }
        getFavMovies()
    })
}

// For Favorite Movies
const getFavMovies = async () => {
    favoriteMovies.innerHTML = ''

    const movies_LS = await get_LS()
    const movies = []
    for( let i = 0; i <= movies_LS.length - 1; i++){
        const movie_id = movies_LS[i]
        let movie = await get_movie_by_id(movie_id)
        showFavMovies(movie)
        movies.push(movie)
    }
}

function showFavMovies (e){
    favoriteMovies.innerHTML += `
        <div class="card" data-id="${e.id}">
            <div class="img">
                <img src="${image_path + e.poster_path}">
            </div>
            <div class="info">
                <h5>${e.title}</h5>
            </div>
            <span class="rating">${e.vote_average.toFixed(1)}</span>
        </div>
    `
    const cards = document.querySelectorAll('.card')
    clickEvent(cards)
}
getFavMovies()

// For Trending Movies
const getMovies = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.results)
    showMovies(data.results) 
}

const showMovies = (data) => {
    heading.innerText = `Top Trending Movies`
    movieContainer.innerHTML = data.map(e =>{
        return `
        <div class="card" data-id="${e.id}">
            <div class="img">
                <img src="${image_path + e.poster_path}">
            </div>
            <div class="info">
                <h5>${e.title}</h5>
            </div>
            <span class="rating">${e.vote_average}</span>
        </div>
        `
    }).join('')

    const cards = document.querySelectorAll('.card')
    clickEvent(cards)
}

// For Search Movies
const getSearchMovies = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.results)
    showSearchMovies(data.results) 
}

const showSearchMovies = (data) => {
    heading.innerText = `Search Results...`
    movieContainer.innerHTML = data.map(e =>{
        return `
        <div class="card" data-id="${e.id}">
            <div class="img">
                <img src="${image_path + e.poster_path}" onerror="this.onerror=null;this.src='./NIF.jpg';" >
            </div>
            <div class="info">
                <h5>${e.title}</h5>
            </div>
            <span class="rating">${e.vote_average.toFixed(1)}</span>
        </div>
        `
    }).join('')

    
    const cards = document.querySelectorAll('.card')
    clickEvent(cards)

}

document.querySelector(".header input").addEventListener(
    "keyup",
    function (event) {
        if (event.target.value != "") {
            getSearchMovies(SEARCHAPI + event.target.value)
        } else {
            getMovies(URL)
        }
    }
)

// initial Call
getMovies(URL)




// <img src="original-image.jpg" onerror="this.onerror=null;this.src='alternate-image.jpg';">
