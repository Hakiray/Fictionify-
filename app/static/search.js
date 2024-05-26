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
    let movie_name = movie.name.length > 40 ? movie.name.slice(0, 40) + '...' : movie.name;
    let poster_url = movie.poster.url != null ? movie.poster.url : "../static/zaglushka.jpg";
    let age_rating = movie.ageRating != null ? movie.ageRating + '+' : '';
    let imdb_rating = movie.rating.imdb != '0' ? movie.rating.imdb : 'Нет';
    div.className = 'movie';
    div.id = movie.id; // надо будет поменять
    div.innerHTML = `
        <div class="like_movie_li">
            <div class="movie_photo_li">
                <img src="${poster_url}">
            </div>
            <div class="movie_describe_li">
                <div class="movie_name_li">${movie_name}</div>
                <div class="movie_data_li">${movie.year} ${age_rating}</div>
                <div class="movie_rating_li">
                    <img src="../static/star.png"> ${imdb_rating}
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
    let poster_url = movie.poster.url != null ? movie.poster.url : "../static/zaglushka.jpg";
    let country = movie.countries.map(country => country.name).join(', ');
    let genres = movie.genres.map(genre => genre.name).join(', ');
    let directors = movie.persons.filter(i => i.enProfession == 'director'); // режиссеры
    directors = directors.length > 4 ? directors.slice(0, 4) : directors;
    directors = directors.length == 0 ? "Нет" : directors.map(director => director.name).join(', ')
    let scenarists = movie.persons.filter(i => i.enProfession == 'scenarist'); // сценаристы
    scenarists = scenarists.length > 4 ? scenarists.slice(0, 4) : scenarists;
    scenarists = scenarists.length == 0 ? "Нет" : scenarists.map(scenarist => scenarist.name).join(', ')
    let producers = movie.persons.filter(i => i.enProfession == 'producer'); // продюсеры
    producers = producers.length > 4 ? producers.slice(0, 4) : producers;
    producers = producers.length == 0 ? "Нет" : producers.map(producer => producer.name).join(', ')
    let designers = movie.persons.filter(i => i.enProfession == 'designer'); // дизайнеры
    designers = designers.length > 4 ? designers.slice(0, 4) : designers;
    designers = designers.length == 0 ? "Нет" : designers.map(designer => designer.name).join(', ')
    let composers = movie.persons.filter(i => i.enProfession == 'composer'); // композиторы
    composers = composers.length > 4 ? composers.slice(0, 4) : composers;
    composers = composers.length == 0 ? "Нет" : composers.map(composer => composer.name).join(', ')
    div.className = 'MovieCard';
    div.id = `${movie.id}`;
    div.innerHTML = `
            <div class="movie_data">
                <div class="movie_name"><h1>${movie.name}</h1></div>
                <div class="movie_describe">
                    <div class="movie_text">
                        <div class="movie_element">Год производства <strong class="bl">${movie.year}</strong></div>
                        <div class="movie_element">Страна <strong class="bl">${country}</strong></div>
                        <div class="movie_element">Жанр <strong class="bl">${genres}</strong></div>
                        <div class="movie_element">Режиссер <strong class="bl">${directors}</strong></div> 
                        <div class="movie_element">Сценарий <strong class="bl">${scenarists}</strong></div>
                        <div class="movie_element">Продюсер <strong class="bl">${producers}</strong></div>
                        <div class="movie_element">Художник <strong class="bl">${designers}</strong></div>
                        <div class="movie_element">Композитор <strong class="bl">${composers}</strong></div>
                        <div class="rating_block">
                            <div class="srv_rate">
                                <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                <strong class="rate">${movie.rating.kp != '0' ? movie.rating.kp : "Нет"}</strong>
                            </div>
                            <div class="srv_rate">
                                <img class="logo2" src="../static/jopa.png" >
                                <strong class="rate">${movie.rating.imdb != '0' ? movie.rating.imdb : "Нет"}</strong>
                            </div>
                        </div>
                        <div class="movie_retell">
                            ${movie.description != null ? movie.description : ''}
                        </div>
                        <div class="summary-text movie_element">
                        </div>
                    </div>
                </div>
            </div>
            <div class="movie_panel">
                <div>
                    <img class="movie_photo" src="${poster_url}">
                </div>
                <div class="movie_panel_li">
                    <ul class="mv_li">
                        <li>
                            <div class="movie_panel_btn willwatch">
                                <img class="mv_pnl_btn1" src="../static/heart.png">
                                <div class="btn_name1">Буду смотреть</div>
                            </div>
                        </li>
                        <li>
                            <div class="movie_panel_btn">
                                <img class="mv_pnl_btn1 summary" src="../static/book.png">
                                <div class="btn_name1">Краткий пересказ</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
    `
    return div
}

let newfilm;
function UpdateMovieCard(movie){
    console.log(movie);
    newfilm = movie;
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


//ОШИБКА 500
//отправлка лайкнутого фильма
function fetchUser(Liked){
    fetch('/api/favorites/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Liked),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong with the network response.');
        }
    })
    .then(info => {
        console.log(info);
    })
    .catch(error => {
        console.error('There was an error:', error);
    });
}

//сохраняем новый фильм с поиска
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
      if (event.target.closest('.willwatch')) {
        console.log(JSON.stringify([newfilm]));
        fetchUser([newfilm]);
        //location.reload() //тип убрал и перезагружаю страницу
      }
    });
});
// краткое содержание фильма с поиска через гигачат

async function get_summary(film_name) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_summary/${encodeURIComponent(film_name)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        const text_summary = document.querySelector('.summary-text');
        text_summary.innerHTML = `<div class="big"><strong class="bl">Краткий пересказ с помощью Gigachat:</strong></div>
                                  <div class="summary-text">${data.content}</div>`
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
      if (event.target.closest('.summary')) {
          let movie_data = newfilm.name + '~' + newfilm.year + '~' + newfilm.genres[0];
          get_summary(movie_data);
      }
    });
});