
const api = axios.create({
  baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false',
});

const apiHighLight = axios.create({
  baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR',
});

let previous = 0;
let next = 6;

let arrayGlobalMovies = []

const movies = document.querySelector('.movies');

const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const highLightVideo = document.querySelector('.highlight__video');
const highLightTitle = document.querySelector('.highlight__title');
const highLightRating = document.querySelector('.highlight__rating');
const highLightGenres = document.querySelector('.highlight__genres');
const highLightLaunch = document.querySelector('.highlight__launch');
const highLightDescription = document.querySelector('.highlight__description');

const inputSearch = document.querySelector('.input');

const btnTheme = document.querySelector('.btn-theme');

const body = document.querySelector('body');
const header = document.querySelector('.header');
const highlight = document.querySelector('.highlight');
const moviesContainer = document.querySelector('.movies-container');
const headerTitle = document.querySelector('.header__title');
const imgLogoTheme = document.querySelector('.header__container-logo img');

const modalBodyTheme = document.querySelector('.modal__body');
const modalTitleTheme = document.querySelector('.modal__title');
const modalDescriptionTheme = document.querySelector('.modal__description');
const modalCloseTheme = document.querySelector('.modal__close');

async function listMoviesCarrosel(newArrayMovies) {

  const arrayMovies = newArrayMovies.slice(0, 18);

  movies.innerHTML = '';

  arrayMovies.slice(previous, next).forEach(movie => {

    const divMovie = document.createElement('div');
    divMovie.classList.add('movie');
    divMovie.setAttribute('style', `background-image: url('${movie.poster_path}')`);

    const divMovieInfo = document.createElement('div');
    divMovieInfo.classList.add('movie__info');
    
    const spanMovieTitle = document.createElement('span');
    spanMovieTitle.classList.add('movie__title')
    spanMovieTitle.textContent = `${movie.title}`

    const spanMovieRating = document.createElement('span');
    spanMovieRating.classList.add('movie__rating')
    spanMovieRating.textContent = `${movie.vote_average}`

    const spanImgEstrela = document.createElement('img');
    spanImgEstrela.setAttribute('src', '/assets/estrela.svg');

    divMovie.addEventListener('click', async () => {
      
      const modalHidden = document.querySelector('.modal');
      const modalBody = document.querySelector('.modal__body');
      const modalClose = document.querySelector('.modal__close');

      const modalTitle = document.querySelector('.modal__title');
      const modalImg = document.querySelector('.modal__img');
      const modalDescription = document.querySelector('.modal__description');
      const modalGenres = document.querySelector('.modal__genres');
      const modalAverage = document.querySelector('.modal__average');

      try {

        const { data } = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`);

        for (const category of data.genres) {
          modalGenres.innerHTML = `
            ${modalGenres.innerHTML}
            <span class="modal__genre">${category.name}</span>
          `;
        }

      } catch(err) {
        console.log('Pane no sistema!')
      }
      
      modalTitle.textContent = `${movie.title}`;
      modalImg.setAttribute('src', `${movie.backdrop_path}`);
      modalDescription.textContent = `${movie.overview}`;
      modalAverage.textContent = `${movie.vote_average}`;

      modalHidden.classList.remove('hidden');

      modalBody.addEventListener('click', () => {
        modalHidden.classList.add('hidden');
      });

      modalClose.addEventListener('click', () => {
        modalHidden.classList.add('hidden');
      });
      
    });

    spanMovieRating.appendChild(spanImgEstrela)
    divMovieInfo.appendChild(spanMovieTitle)
    divMovieInfo.appendChild(spanMovieRating)
    divMovie.appendChild(divMovieInfo)
    movies.appendChild(divMovie)

  });
}

async function getDataMovie() {

  const respond = await api.get();

  arrayGlobalMovies = respond.data.results;

  listMoviesCarrosel(respond.data.results);

}
getDataMovie()

async function getHighLight() {

  const response = await apiHighLight.get();
  const filmDay = response.data;

  const genresCategory = filmDay.genres;
  let arrayGenres = '';

  for (const genres of genresCategory) {
    arrayGenres = arrayGenres + `${genres.name.toUpperCase()}, `;
  }
  
  const stringGernes = arrayGenres.slice(0, (arrayGenres.length - 2));
  

  highLightVideo.setAttribute('style', `background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${filmDay.backdrop_path}')`);
  
  highLightTitle.textContent = `${filmDay.title}`;

  highLightRating.textContent = `${filmDay.vote_average.toFixed(1)}`;

  highLightGenres.textContent = `${stringGernes}`;

  const dateFormat = new Date(filmDay.release_date).toLocaleDateString('pt-br', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  highLightLaunch.textContent = `${dateFormat.toUpperCase()}`;

  highLightDescription.textContent = `${filmDay.overview}`;

}
getHighLight()

btnPrev.addEventListener('click', (e) => {
  e.stopPropagation();

  if(previous === 0) {
    previous = 12;
    next = 18;

    listMoviesCarrosel(arrayGlobalMovies);
    return;
  }

  previous -= 6;
  next -= 6;

  listMoviesCarrosel(arrayGlobalMovies);
});

btnNext.addEventListener('click', (e) => {
  e.stopPropagation();

  if(next === 18) {
    next = 6;
    previous = 0;

    listMoviesCarrosel(arrayGlobalMovies);
    return;
  }

  previous += 6;
  next += 6;

  listMoviesCarrosel(arrayGlobalMovies);
});

inputSearch.addEventListener('keypress', async (e) => {
  e.stopPropagation();
  
  if(e.key !== 'Enter') return;

  try {
    const { data } = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputSearch.value}`);

    if(data.results.length === 0) {
      getDataMovie()
    }
    
    arrayGlobalMovies = data.results;

    listMoviesCarrosel(data.results);

  } catch (error) {
    getDataMovie()
  }
  inputSearch.value = "";

});

btnTheme.addEventListener('click', (e) => {
  e.stopPropagation();
  
  body.classList.toggle('bodyTheme');
  header.classList.toggle('headerTheme');
  highlight.classList.toggle('highlightTheme');
  moviesContainer.classList.toggle('moviesContainerTheme');
  inputSearch.classList.toggle('inputTheme');
  headerTitle.classList.toggle('header__titleTheme');
  highLightTitle.classList.toggle('highlight__titleTheme');
  highLightGenres.classList.toggle('highlight__titleTheme');
  highLightLaunch.classList.toggle('highlight__titleTheme');
  highLightDescription.classList.toggle('highlight__descriptionTheme');
  modalBodyTheme.classList.toggle('modal__bodyTheme');
  modalTitleTheme.classList.toggle('modal__titleTheme');
  modalDescriptionTheme.classList.toggle('modal__descriptionTheme');
  

  const booleanThemeDark = body.classList.contains('bodyTheme');

  if(booleanThemeDark) {
    btnTheme.setAttribute('src', '/assets/dark-mode.svg');
    imgLogoTheme.setAttribute('src', '/assets/logo.svg');
    btnPrev.setAttribute('src', '/assets/arrow-left-light.svg');
    btnNext.setAttribute('src', '/assets/arrow-right-light.svg');
    modalCloseTheme.setAttribute('src', '/assets/close.svg');
  
  } else {
    btnTheme.setAttribute('src', '/assets/light-mode.svg');
    imgLogoTheme.setAttribute('src', '/assets/logo-dark.png');
    btnPrev.setAttribute('src', '/assets/arrow-left-dark.svg');
    btnNext.setAttribute('src', '/assets/arrow-right-dark.svg');
    modalCloseTheme.setAttribute('src', '/assets/close-dark.svg');
    
  }
  
});