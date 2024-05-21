
//let API_KEY = '3VYPFA8-H37MAZ9-H0JA9A5-CRAJTFN';  
let API_URL;  
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': '3VYPFA8-H37MAZ9-H0JA9A5-CRAJTFN'}
  };

let Liked = []
//получение пользователя с каким-либо id
function getUserLike(){
    fetch('/api/favorites', {
        method: "GET",
    })
    .then(response => response.json())
    .then(info => {
        // Предполагая, что info - это массив объектов, представляющих понравившиеся фильмы
        Liked = info; // Сохраняем полученные данные в список Liked
        console.log(Liked); // Выводим в консоль список Liked
        if (document.querySelector('.mv_li1')){
            updateUI()}
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

function updateUI(){ //Для LikedMovies
    const Liked_MovieContent = document.querySelector('.mv_li1');
    if (Liked_MovieContent && Liked.length > 0) {
        Liked.forEach(movie => {
            let movieElement = CreateMovieElement(movie);
            Liked_MovieContent.append(movieElement);
        });
    }
}

if (!document.querySelector('.mv_li1')){
    getUserLike();}
if (document.querySelector('.Genre')){
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




let i = 0;
let j = 1;
let ImageList;
let LenOfImageList;
let countriesList;
let ageRating;
let resultString;

let ReleaseYearsStart='&releaseYears.start=1874-2050';
let GenresName = '';
let CountriesName = '';

function fetchMovies(){
    API_URL = `https://api.kinopoisk.dev/v1.4/movie?page=${j}&limit=10&selectFields=name&selectFields=description&selectFields=shortDescription&selectFields=rating&selectFields=ageRating&selectFields=poster&selectFields=genres&selectFields=countries&selectFields=movieLength&selectFields=releaseYears${ReleaseYearsStart}${GenresName}${CountriesName}`;
    fetch(API_URL, options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            ImageList = response;
            LenOfImageList = ImageList.docs.length; // Указываем длину списка
            i = 0;
            ThroughList(); // Вызываем функцию для обработки списка
        })
        .catch(err => {
            console.error(err);
            console.log(err);
        });
}
function ThroughList(){
    if (ImageList.docs.length === 0){
        i = 0; 
        j = 1;
        alert("Фильмы кончились, поменяйте фильтр");
        return;
    }
    if (i > LenOfImageList-1){
        j +=1;
        fetchMovies();
        return;
    }
    if (i === LenOfImageList-1 ){
        if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url){
            image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
            MovieName.textContent = `${ImageList.docs[i].name}`;
            countriesList = ImageList.docs[i].countries.map(country => country.name);
            ageRating = `${ImageList.docs[i].ageRating}+`;
            relYear = `${ImageList.docs[i].releaseYears[0].start}`
            if (ageRating ==='null+'){
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            }else{
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            }
            Description.textContent = `${resultString}`;
            Rating.textContent = `${parseFloat(ImageList.docs[i].rating.kp).toFixed(1)}`;
            i += 1;
            console.log(i);
        }else{
            i+=1;
            ThroughList();
        }
        }
    else if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
        image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
        MovieName.textContent = `${ImageList.docs[i].name}`;
        countriesList = ImageList.docs[i].countries.map(country => country.name);
        ageRating = `${ImageList.docs[i].ageRating}+`;
        relYear = `${ImageList.docs[i].releaseYears[0].start}`
        if (ageRating ==='null+'){
            resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
        }else{
            resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
        }
        console.log(countriesList);
        Description.textContent = `${resultString}`;
        Rating.textContent = `${parseFloat(ImageList.docs[i].rating.kp).toFixed(1)}`;
        i = (i + 1) % LenOfImageList;
        console.log(i);
    }else{
        for (i; i<= LenOfImageList-1; i++){
            if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
                ThroughList()
                break;
            }
        }
    }
}

fetchMovies();
const image = document.querySelector('.Tinder');
const MovieName = document.querySelector('.MovieName');
const Description = document.querySelector('.Description');
const Rating = document.querySelector('.Rating');


let Like = document.querySelector('.Heart2');
Like.addEventListener('click', () =>{
    if (!Liked.some(item => item.name === ImageList.docs[i-1].name)) {
        Liked.push(ImageList.docs[i-1]);
        console.log(JSON.stringify(Liked));
        fetchUser([Liked[Liked.length-1]]);
    }
})
Like.addEventListener('click', ThroughList);


let Skip = document.querySelector('.Cross');
Skip.addEventListener('click', ThroughList);


let Mark = document.querySelector('.Add');
let Marked = []
Mark.addEventListener('click', () =>{
    if (!Marked.some(item => item.name === ImageList.docs[i-1].name)) {
        Marked.push(ImageList.docs[i-1]);
        console.log(JSON.stringify(Marked));
    }
})
Mark.addEventListener('click', ThroughList);



let ReleaseDate = [];
let StrReleaseDate = '';
let DateList = document.querySelectorAll('.ReleaseDate')

DateList.forEach(function(Date) {
    Date.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        let content = event.target.textContent;
        let index = ReleaseDate.indexOf(content);
        if (index !== -1) {
            ReleaseDate.splice(index, 1);
            event.target.style.background = '#f5f5f5';
        } else {
            ReleaseDate.push(content);
            event.target.style.background = '#ffee58';
        }
        console.log(ReleaseDate);
        StrReleaseDate = ReleaseDate.map(date => date.replace(/\s/g, '').replace("До", "1874-")).join('&releaseYears.start=');
        if (StrReleaseDate !== ''){
            ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
        }else{
            ReleaseYearsStart = '&releaseYears.start=1874-2050';
        }
        fetchMovies();
        console.log(ReleaseYearsStart);
        console.log(API_URL);
        event.preventDefault();
    }
});
});


let ReleaseCountry = [];
let StrReleaseCountry = '';
let CountryList = document.querySelectorAll('.Country')

CountryList.forEach(function(Country) {
    Country.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        let content = event.target.textContent;
        let index = ReleaseCountry.indexOf(content);
        if (index !== -1) {
            ReleaseCountry.splice(index, 1);
            event.target.style.background = '#f5f5f5';
        } else {
            ReleaseCountry.push(content);
            event.target.style.background = '#ffee58';
        }
        console.log(ReleaseCountry);
        StrReleaseCountry = ReleaseCountry.join('&countries.name=');
        if (StrReleaseCountry !== ''){
            CountriesName = `&countries.name=${StrReleaseCountry}`;
        }else{
            CountriesName = '';
        }
        fetchMovies();
        console.log(CountriesName);
        console.log(API_URL);
        event.preventDefault();
    }
});
});

let ReleaseGenre = [];
let StrGenreList = '';
let GenreList = document.querySelectorAll('.Genre')

GenreList.forEach(function(Genre) {
    Genre.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        let content = event.target.textContent;
        let index = ReleaseGenre.indexOf(content);
        if (index !== -1) {
            ReleaseGenre.splice(index, 1);
            event.target.style.background = '#f5f5f5';
        } else {
            ReleaseGenre.push(content);
            event.target.style.background = '#ffee58';
        }

        console.log(ReleaseGenre);
        StrReleaseGenre = ReleaseGenre.join('&genres.name=');
        if (StrReleaseGenre !== ''){
            GenresName = `&genres.name=${StrReleaseGenre}`;
        }else{
            GenresName = ``;
        }
        fetchMovies();
        console.log(GenresName);
        console.log(API_URL);
        event.preventDefault();
    }
});
});
}

//other html
if (document.querySelector('.mv_li1')){
    getUserLike();
    function CreateMovieElement(movie){
        const div = document.createElement('div');
        div.className = 'movie';
        //div.id = movie-${movie.id}; надо будет добавить id
        div.id = `${movie.name}`;//надо будет поменять
        div.innerHTML = `
            <div class="like_movie_li">
                <div class="movie_photo_li">
                    <img src="${movie.posterUrl}">
                </div>
                <div class="movie_describe_li">
                    <div class="movie_name_li">${movie.name}</div>
                    <div class="movie_data_li">${movie.releaseStart} ${movie.ageRating}+</div>
                    <div class="movie_rating_li">
                        <img src="../static/star.png"> ${movie.imdb_rating}
                    </div>
                </div>
            </div>
    `/*<div class="movie_data_li">${movie.releaseStart} ${movie.movieLength} ${movie.ageRating}</div>*/
        return div
    }
    function MovieCard(movie){
        console.log('ss');
        console.log(movie.name);
        const div = document.createElement('div');
        div.className = 'MovieCard';
        div.id = `${movie.name}`;
        countriesList = movie.countries;
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
                                <div class="movie_element">Год производства <strong class="bl">${movie.releaseStart}</strong></div>
                                <div class="movie_element">Страна <strong class="bl">${countriesList}</strong></div>
                                <div class="movie_element">Жанр <strong class="bl">${movie.genres}</strong></div>
                                <div class="movie_element">Режиссер <strong class="bl">Николас Виндинг Рефн</strong></div> 
                                <div class="movie_element">Сценарий <strong class="bl">Хуссейн Амини, Джеймс Саллис</strong></div>
                                <div class="movie_element">Продюсер <strong class="bl">Мишель Литвак, Джон Палермо, Марк Э. Платт</strong></div>
                                <div class="movie_element">Художник <strong class="bl">Бет Микл, Кристофер Тандон, Эрин Бенач</strong></div>
                                <div class="movie_element">Композитор <strong class="bl">Клифф Мартинес</strong></div>
                                <div class="rating_block">
                                    <div class="srv_rate">
                                        <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                        <strong class="rate">${movie.kp_rating}</strong>
                                    </div>
                                    <div class="srv_rate">
                                        <img class="logo2" src="../static/jopa.png" >
                                        <strong class="rate">${movie.imdb_rating}</strong>
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
                            <img class="movie_photo" src="${movie.posterUrl}">
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
    let sigma;
    function UpdateMovieCard(id){
        const MovieCardContent = document.querySelector('.selected_movie');
        movie = Liked[id];
        sigma = movie.name;
        console.log('eshkere')
        console.log(Liked[id])
        MovieCardContent.innerHTML = '' ;
        MovieCardContent.appendChild(MovieCard(movie))
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');
    
        list.addEventListener('click', function(event) {
            // Всплываем от цели клика (event.target) вверх по DOM-дереву,
            // чтобы найти ближайшего предка с классом 'like_movie_li'.
            let target = event.target;
            while (target != this) {
                if (target.classList.contains('like_movie_li')) {
                    // Сброс фона всех элементов.
                    document.querySelectorAll('.like_movie_li').forEach(function(el) {
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
        });
    });
    let index;
    document.addEventListener('DOMContentLoaded', function() {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');
        if(list){
            list.addEventListener('click', function(event) {
            let movieElement = event.target.closest('.movie');
            if (movieElement) {
                let movieId = movieElement.id;
                console.log('Нажат фильм с ID:', movieId);
                for (let i = 0; i < Liked.length; i++) {
                    if (`${Liked[i].name}` === movieId) { // Убеждаемся, что используем строки для сравнения
                        UpdateMovieCard(i); // Передаем индекс найденного элемента
                        break;
                    }
                }
            }
            })
        }
        else{ console.error("Элемент с классом 'movie' не найден.");}
    });
    
    //дальше меню на карточке фильма
    document.addEventListener('DOMContentLoaded', function() {
        // Прикрепляем обработчик событий к документу, который реагирует на клики
        document.addEventListener('click', function(event) {
          // Проверяем, что элемент, по которому был совершён клик, имеет класс delete
          if (event.target.closest('.delete')) {
            // Ищем в списке элемент с атрибутом name, равным значению переменной sigma
            console.log(sigma)
            let index = Liked.findIndex(function(item) {
                return item.name === sigma;
              });
            fetchUserDel(Liked[index]);// удаляю, отправляю фулл элемент удаляемый
            console.log(index); 
            Liked = Liked.filter(function(item) {
                return item.name !== sigma;
              });
            //location.reload() //тип убрал и перезагружаю страницу
          }
        });
      });

    //запрос на удаление (нужно будет попросить поменять ссылку)
    function fetchUserDel(Liked){
        fetch('/api/favorites/фщфщфщфщфщ', {
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
}
