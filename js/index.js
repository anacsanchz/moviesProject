const app = document.querySelector('#app');
const topButton = document.querySelector('#topButton')
const latestButton = document.querySelector('#latestButton')
const upcomingButton = document.querySelector('#upcomingButton')
const nowButton = document.querySelector('#nowButton')
const reloadButton = document.querySelector('#reloadButton')

const searchForm = document.querySelector('#searchForm')

const imageBaseURL = "https://image.tmdb.org/t/p/w500"

const httpClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 1000,
});

httpClient.defaults.params = {};
httpClient.defaults.params = {
    'api_key': '5984216396c56fae67df1ec4ff248320',
};

const getGenres = async () => {
    const genresString = localStorage.getItem('genres')
    if (genresString) {
        return
    }
    try {
        const response = await httpClient.get('/genre/movie/list')
        localStorage.setItem('genres', JSON.stringify(response.data.genres))
        return response.data.genres
    } catch (error) {
        return error
    }
}


const getPopularMovies = async () => {
    const genres = await getGenres()

    httpClient.get('/movie/popular/').then(response => {
        const movies = response.data.results;
        console.log(movies)
        const dropdownGroup = document.querySelector('#myDropdown')
        dropdownGroup.innerText = ''
        render(movies)
    }).catch(error => error)
}

const topRated = () => {

    httpClient.get('/movie/top_rated').then(response => {
        const moviesTop = response.data.results;
        app.innerHTML = ''
        const dropdownGroup = document.querySelector('#myDropdown')
        dropdownGroup.innerText = ''
        render(moviesTop)
    }).catch(error => error)
}

const upcoming = () => {

    httpClient.get('/movie/upcoming').then(response => {
        const comingMovies = response.data.results;
        app.innerHTML = ''
        const dropdownGroup = document.querySelector('#myDropdown')
        dropdownGroup.innerText = ''
        render(comingMovies)
    }).catch(error => error)
}

const nowPlaying = () => {

    httpClient.get('/movie/now_playing').then(response => {
        const nowMovies = response.data.results;
        app.innerHTML = ''
        const dropdownGroup = document.querySelector('#myDropdown')
        dropdownGroup.innerText = ''
        render(nowMovies)
    }).catch(error => error)
}

const render = (movies) => {
    const genresString = localStorage.getItem('genres')
    const genres = JSON.parse(genresString)

    genres.forEach((genre) => {

        const dropdownGroup = document.querySelector('#myDropdown')
        let dropdownItem = document.createElement('a')

        dropdownGroup.append(dropdownItem)
        dropdownItem.setAttribute('href', '#')
        dropdownItem.setAttribute('id', 'ddItem')
        dropdownItem.innerText = genre.name

    })
    movies.forEach((movie) => {
        const movieGenres = genres.filter((genre) => {
            return movie.genre_ids.includes(genre.id)
        })
        let card = document.createElement('div')
        let img = document.createElement('img')
        let cardTitle = document.createElement('div')
        let movieName = document.createElement('p')
        let genresDiv = document.createElement('div')
        // let vote = document.createAttribute('p')

        img.setAttribute('src', `${imageBaseURL}/${movie.poster_path}`)
        card.append(img)
        card.append(cardTitle)
        // card.append(vote)
        cardTitle.append(movieName)
        cardTitle.append(genresDiv)

        // vote.innerText = movie.vote_average

        movieGenres.forEach((genre) => {

            let movieGenre = document.createElement('p')

            genresDiv.append(movieGenre)
            movieGenre.innerText = genre.name;
            genresDiv.classList.add('genres')
            movieGenre.classList.add('genreName')

        })
        app.append(card)

        movieName.innerText = movie.title;

        card.classList.add('card')
        cardTitle.classList.add('cardTitle')

    })
    const reload = () => {
        httpClient.get('/movie/popular/').then(response => {
            const movies = response.data.results;
            app.innerHTML = ''
            const dropdownGroup = document.querySelector('#myDropdown')
            dropdownGroup.innerText = ''
            render(movies)
        }).catch(error => error)
    }
    reloadButton.addEventListener('click', (e) => {
        reload(e)
    })

}

getPopularMovies()

const dropdown = () => {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// -------------- SEARCH -----------------

const search = (inputContent) => {
    httpClient.get('/movie/popular/').then(response => {
        const movies = response.data.results;
        const results = movies.filter((movie) => {
            return movie.original_title.toLowerCase().includes(inputContent.toLowerCase())
        })
        app.innerHTML = ''
        const dropdownGroup = document.querySelector('#myDropdown')
        dropdownGroup.innerText = ''
        render(results)
    }).catch(error => error)
}
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    search(e.target.searching.value)
})

//Falta: filtrar por cada genero, reviews, 

// -------------- FILTERS -----------------


topButton.addEventListener('click', (e) => {
    topRated(e)
})

upcomingButton.addEventListener('click', (e) => {
    upcoming(e)
})

nowButton.addEventListener('click', (e) => {
    nowPlaying(e)
})