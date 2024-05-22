let API_URL;
const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'X-API-KEY': '3VYPFA8-H37MAZ9-H0JA9A5-CRAJTFN' }
};

var data;

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        performSearch(query);
    }
});

async function performSearch(query) {
    API_URL = `https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=5&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function searchById(id) {
    API_URL = `https://api.kinopoisk.dev/v1.4/movie/${encodeURIComponent(id)}`;
    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        UpdateMovieCard(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function CreateMovieElement(movie) {
    const div = document.createElement('div');
    let movie_name = movie.name;
    div.className = 'movie';
    div.id = movie.id; // надо будет поменять
    if (movie.name.length > 40) {
        movie_name = movie.name.slice(0, 40) + '...';
    }
    div.innerHTML = `
        <div class="like_movie_li">
            <div class="movie_photo_li">
                <img src="${movie.poster.url}">
            </div>
            <div class="movie_describe_li">
                <div class="movie_name_li">${movie_name}</div>
                <div class="movie_data_li">${movie.year} ${movie.ageRating}+</div>
                <div class="movie_rating_li">
                    <img src="../static/star.png"> ${movie.rating.imdb}
                </div>
            </div>
        </div>
    `;

    return div;
}

document.addEventListener('DOMContentLoaded', function(){
    // Выбираем родительский элемент, например, <ul>
    const list = document.querySelector('.mv_li2');

    list.addEventListener('click', function (event) {
        // Всплываем от цели клика (event.target) вверх по DOM-дереву,
        // чтобы найти ближайшего предка с классом 'like_movie_li'.
        let target = event.target;
        while (target != this) {
            if (target.classList.contains('like_movie_li')) {
                // Сброс фона всех элементов.
                document.querySelectorAll('.like_movie_li').forEach(function (el) {
                    el.style.background = '';
                });
                // Установка фона для целевого элемента.
                target.style.background = 'white';
                // Выходим из цикла, так как нашли нужный элемент.
                break;
            }
            // Перемещаемся к следующему родительскому элементу.
            target = target.parentNode;
        }
        console.log(target);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем родительский элемент, например, <ul>
    const list = document.querySelector('.mv_li2');
    if(list){
        list.addEventListener('click', function(event) {
        let movieElement = event.target.closest('.movie');
        if (movieElement) {
            searchById(movieElement.id);
        }
        })
    }
    else{ console.error("Элемент с классом 'movie' не найден.");}
});

function MovieCard(movie){
    const div = document.createElement('div');
    div.className = 'MovieCard';
    div.id = `${movie.id}`;
    let directors = movie.persons.map(person => person.enProfession == 'director')
    //нужно добавить актеров и прочих челиков, imdb rating
    div.innerHTML = `
            <div class="movie_data">
                <div class="movie_name"><h1>${movie.name}</h1></div>
                <ul class="switch_menu mv_li">
                    <li class="select_option">
                        О фильме
                    </li>
                    <li class="select_option">
                        Рецензии зрителей
                    </li>
                </ul>
                <div class="movie_describe">
                    <div class="movie_text">
                        <div class="movie_element">Год производства <strong class="bl">${movie.year}</strong></div>
                        <div class="movie_element">Страна <strong class="bl">${movie.countries.map(country => country.name).join(', ')}</strong></div>
                        <div class="movie_element">Жанр <strong class="bl">${movie.genres.map(genre => genre.name).join(', ')}</strong></div>
                        <div class="movie_element">Режиссер <strong class="bl">${directors.slice(0, directors.length % 4)}</strong></div> 
                        <div class="movie_element">Сценарий <strong class="bl">Хуссейн Амини, Джеймс Саллис</strong></div>
                        <div class="movie_element">Продюсер <strong class="bl">Мишель Литвак, Джон Палермо, Марк Э. Платт</strong></div>
                        <div class="movie_element">Художник <strong class="bl">Бет Микл, Кристофер Тандон, Эрин Бенач</strong></div>
                        <div class="movie_element">Композитор <strong class="bl">Клифф Мартинес</strong></div>
                        <div class="rating_block">
                            <div class="srv_rate">
                                <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                <strong class="rate">${movie.rating.kp}</strong>
                            </div>
                            <div class="srv_rate">
                                <img class="logo2" src="../static/jopa.png" >
                                <strong class="rate">${movie.rating.imdb}</strong>
                            </div>
                        </div>
                        <div class="movie_retell">
                            ${movie.description}
                        </div>
                    </div>
                </div>
            </div>
            <div class="movie_panel">
                <div>
                    <img class="movie_photo" src="${movie.poster.url}">
                </div>
                <div class="movie_panel_li">
                    <ul class="mv_li">
                        <li>
                            <div class="movie_panel_btn willwatch">
                                <img class="mv_pnl_btn" src="../static/add_zq.png"">
                                <div class="btn_name">Буду смотреть</div>
                            </div>
                        </li>
                        <li>
                            <div class="movie_panel_btn delete">
                                <img class="mv_pnl_btn" src="../static/broken_heart.png"">
                                <div class="btn_name">Убрать из списка</div>
                            </div>
                        </li>
                        <li>
                            <div class="movie_panel_btn ratte">
                                <img class="mv_pnl_btn" src="../static/star.png" }}">
                                <div class="btn_name">Оценить</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
    `
    return div
}

function UpdateMovieCard(movie){
    console.log(movie);
    const MovieCardContent = document.querySelector('.selected_movie');
    MovieCardContent.innerHTML = '' ;
    MovieCardContent.appendChild(MovieCard(movie))
}

function displayResults(data) {
    const resultsList = document.querySelector('.mv_li2');
    resultsList.innerHTML = ''; // Очистка предыдущих результатов

    data.docs.slice(0, 5).forEach(item => { // Убедитесь, что `data.docs` содержит массив объектов
        const movieElement = CreateMovieElement(item);
        resultsList.appendChild(movieElement);
    });
}
