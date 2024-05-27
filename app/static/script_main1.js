//let API_KEY = '3VYPFA8-H37MAZ9-H0JA9A5-CRAJTFN';
let API_URL;
let StrReleaseCountry = '';
let StrReleaseDate = '';
let StrGenreList = '';
let ReleaseYearsStart;
let GenresName;
let CountriesName;
let SortingName = '';
let film_name_gigachat;


function getUserAPI_URL() {
    fetch('/api/preferences', {
        method: "GET",
    })
        .then(response => response.json())
        .then(info => {
            Destroy = info;
            console.log('adadada');
            console.log(Destroy);
            if (Destroy[2].length >= 1) {
                StrReleaseDate = Destroy[2][0].split(',');
                StrReleaseDate = StrReleaseDate.map(date => date.replace(/\s/g, '').replace("До", "1874-")).join('&releaseYears.start=');
                ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
            } else {
                ReleaseYearsStart = "&releaseYears.start=1874-2050";
            }
            if (Destroy[1].length >= 1) {
                StrReleaseCountry = Destroy[1][0].split(',');
                StrReleaseCountry = StrReleaseCountry.join('&countries.name=');
                CountriesName = `&countries.name=${StrReleaseCountry}`;
            } else {
                CountriesName = '';
            }

            if (Destroy[0].length >= 1) {
                StrReleaseGenre = Destroy[0][0].split(',');
                StrReleaseGenre = StrReleaseGenre.join('&genres.name=');
                GenresName = `&genres.name=${StrReleaseGenre}`;
            } else {
                GenresName = ''
            }
            console.log(GenresName, CountriesName, ReleaseYearsStart);

            fetchMovies();
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
}

if (document.querySelector(`.Country`)) {
    getUserAPI_URL(); //Надо будет убрать api_url в
    console.log(GenresName, CountriesName, ReleaseYearsStart);
}

const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': 'H18WF07-6R44C0Y-GCJ71GY-FKFQP9A'}
}

let Liked = []

//получение списка лайков пользователя
function getUserLike() {
    fetch('/api/favorites', {
        method: "GET",
    })
        .then(response => response.json())
        .then(info => {
            // Предполагая, что info - это массив объектов, представляющих понравившиеся фильмы
            Liked = info; // Сохраняем полученные данные в список Liked
            console.log(Liked); // Выводим в консоль список Liked
            if (document.querySelector('.mv_li1')) {
                updateUI()
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
}

//создание html контента по списку liked
function updateUI() { //Для LikedMovies
    const Liked_MovieContent = document.querySelector('.mv_li1');
    if (Liked_MovieContent && Liked.length > 0) {
        Liked.forEach(movie => {
            let movieElement = CreateMovieElement(movie);
            Liked_MovieContent.append(movieElement);
        });
    }
}


//чтобы не получать лайки 2 раза (это получение в main1)
if (!document.querySelector('.mv_li1')) {
    getUserLike();
}


//отправка лайкнутого фильма
if (document.querySelector('.Genre')) {
    function fetchUser(Liked) {
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

    console.log('dvs')
    console.log(GenresName);
    console.log(ReleaseYearsStart);
    console.log(CountriesName);
    console.log(SortingName);

    //запрос на фильмы
    function fetchMovies() {
        API_URL = `https://api.kinopoisk.dev/v1.4/movie?page=${j}&limit=10&selectFields=name&selectFields=id&selectFields=persons&selectFields=description&selectFields=shortDescription&selectFields=rating&selectFields=ageRating&selectFields=poster&selectFields=genres&selectFields=countries&selectFields=movieLength&selectFields=releaseYears&notNullFields=name&notNullFields=rating.imdb&notNullFields=year&notNullFields=poster.url${ReleaseYearsStart}${GenresName}${CountriesName}${SortingName}`;
        console.log(API_URL);
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


    //прокрутка фильмов
    const div = document.createElement('div');
    div.className = 'modal0';
    div.id = "my-modal0"

    function ThroughList() {
        if (ImageList.docs.length === 0) {
            i = 0;
            j = 1;
            alert("Фильмы кончились, поменяйте фильтр");
            return;
        }
        if (i > LenOfImageList - 1) {
            j += 1;
            fetchMovies();
            return;
        }
        if (i === LenOfImageList - 1) {
            if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
                image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
                MovieName.textContent = `${ImageList.docs[i].name}`;
                countriesList = ImageList.docs[i].countries.map(country => country.name);
                genreslist = ImageList.docs[i].genres.map(genre => genre.name);
                ageRating = `${ImageList.docs[i].ageRating}+`;
                relYear = `${ImageList.docs[i].releaseYears[0].start}`
                if (ageRating === 'null+') {
                    resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
                } else {
                    resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
                }
                console.log(countriesList);
                Description.textContent = `${resultString}`;
                Rating.textContent = `${parseFloat(ImageList.docs[i].rating.imdb).toFixed(1)}`;
                kp_rating = `${(ImageList.docs[i].rating.kp).toFixed(1)}`
                kp_rating = kp_rating !== '0.0' ? kp_rating : "Нет";
                imdb_rating = `${(ImageList.docs[i].rating.imdb).toFixed(1)}`
                imdb_rating = imdb_rating !== '0.0' ? imdb_rating : "Нет";
                console.log(kp_rating);
                div.innerHTML = `<div class="modal_box0">
                                    <button class=modal_close_btn id="close-my-modal-btn">
                                        <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.09082 0.03125L22.9999 22.0294L20.909 24.2292L-8.73579e-05 2.23106L2.09082 0.03125Z" fill="#333333"></path>
                                            <path d="M0 22.0295L20.9091 0.0314368L23 2.23125L2.09091 24.2294L0 22.0295Z" fill="#333333"></path>
                                        </svg>
                                    </button>
                                    <div class="movie_data">
                                    <div class="movie_name"><h1>${ImageList.docs[i].name}</h1></div>
                                    <div class="movie_describe">
                                        <div class="movie_text">
                                            <div class="movie_element">Год производства <strong class="bl">${ImageList.docs[i].releaseYears[0].start}</strong></div>
                                            <div class="movie_element">Страна <strong class="bl">${countriesList.join(", ")}</strong></div>
                                            <div class="movie_element">Жанр <strong class="bl">${genreslist.join(", ")}</strong></div>
                                            <div class="rating_block">
                                                <div class="srv_rate">
                                                    <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                                    <strong class="rate">${kp_rating}</strong>
                                                </div>
                                                <div class="srv_rate">
                                                    <img class="logo2" src="../static/imdb.png" >
                                                    <strong class="rate">${imdb_rating}</strong>
                                                </div>
                                            </div>
                                            <div class="movie_retell">
                                                ${ImageList.docs[i].description}
                                            </div>
                                            <div class="movie_panel1">
                                                <div>
                                                    <img class="movie_photo0" src="${ImageList.docs[i].poster.url}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                document.body.appendChild(div);
                i += 1;
                console.log(i);
            } else {
                i += 1;
                ThroughList();
            }
        } else if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
            image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
            MovieName.textContent = `${ImageList.docs[i].name}`;
            countriesList = ImageList.docs[i].countries.map(country => country.name);
            genreslist = ImageList.docs[i].genres.map(genre => genre.name);
            ageRating = `${ImageList.docs[i].ageRating}+`;
            relYear = `${ImageList.docs[i].releaseYears[0].start}`
            if (ageRating === 'null+') {
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            } else {
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            }
            console.log(countriesList);
            Description.textContent = `${resultString}`;
            Rating.textContent = `${parseFloat(ImageList.docs[i].rating.imdb).toFixed(1)}`;
            kp_rating = `${(ImageList.docs[i].rating.kp).toFixed(1)}`
            kp_rating = kp_rating !== '0.0' ? kp_rating : "Нет";
            imdb_rating = `${(ImageList.docs[i].rating.imdb).toFixed(1)}`
            imdb_rating = imdb_rating !== '0.0' ? imdb_rating : "Нет";
            console.log(kp_rating);
            div.innerHTML = `<div class="modal_box0">
                                <button class=modal_close_btn id="close-my-modal-btn">
                                    <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.09082 0.03125L22.9999 22.0294L20.909 24.2292L-8.73579e-05 2.23106L2.09082 0.03125Z" fill="#333333"></path>
                                        <path d="M0 22.0295L20.9091 0.0314368L23 2.23125L2.09091 24.2294L0 22.0295Z" fill="#333333"></path>
                                    </svg>
                                </button>
                                <div class="movie_data">
                                <div class="movie_name"><h1>${ImageList.docs[i].name}</h1></div>
                                <div class="movie_describe">
                                    <div class="movie_text">
                                        <div class="movie_element">Год производства <strong class="bl">${ImageList.docs[i].releaseYears[0].start}</strong></div>
                                        <div class="movie_element">Страна <strong class="bl">${countriesList.join(", ")}</strong></div>
                                        <div class="movie_element">Жанр <strong class="bl">${genreslist.join(", ")}</strong></div>
                                        <div class="rating_block">
                                            <div class="srv_rate">
                                                <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                                <strong class="rate">${kp_rating}</strong>
                                            </div>
                                            <div class="srv_rate">
                                                <img class="logo2" src="../static/imdb.png" >
                                                <strong class="rate">${imdb_rating}</strong>
                                            </div>
                                        </div>
                                        <div class="movie_retell">
                                            ${ImageList.docs[i].description}
                                        </div>
                                        <div class="movie_panel1">
                                            <div>
                                                <img class="movie_photo0" src="${ImageList.docs[i].poster.url}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
            document.body.appendChild(div);
            i = (i + 1) % LenOfImageList;
            console.log(i);
        } else {
            for (i; i <= LenOfImageList - 1; i++) {
                if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
                    ThroughList()
                    break;
                }
            }
        }
    }

    //модальное окно фильмов
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            if (event.target && event.target.className === "Tinder") {
                var modal = document.getElementById("my-modal0");
                if (modal) {
                    modal.classList.add("open");
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modal" not found.');
                }
            }
        });
    })
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            let closeButton = event.target.closest("#close-my-modal-btn");
            if (closeButton) {
                var modal = document.getElementById("my-modal0");
                if (modal) {
                    modal.classList.remove("open");
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modal" not found.');
                }
            }
        });
    })

    const image = document.querySelector('.Tinder');
    const MovieName = document.querySelector('.MovieName');
    const Description = document.querySelector('.Description');
    const Rating = document.querySelector('.Rating');

    //Нажатие на сердечко
    let Like = document.querySelector('.Heart2');
    Like.addEventListener('click', () => {
        if (!Liked.some(item => item.name === ImageList.docs[i - 1].name)) {
            Liked.push(ImageList.docs[i - 1]);
            console.log(JSON.stringify([Liked[Liked.length - 1]]));
            fetchUser([Liked[Liked.length - 1]]);
        }
    })
    Like.addEventListener('click', () => {
        div.innerHTML = ``;
        ThroughList();
    });

    //нажатие на крестик
    let Skip = document.querySelector('.Cross');
    Skip.addEventListener('click', () => {
        div.innerHTML = ``;
        ThroughList();
    });


    //Это надо для recomendation.html

    //выбор фильмов по дате выхода
    let ReleaseDate = [];
    let DateList = document.querySelectorAll('.ReleaseDate')

    DateList.forEach(function (Date) {
        Date.addEventListener('click', function (event) {
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
                if (StrReleaseDate !== '') {
                    ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
                } else {
                    ReleaseYearsStart = '&releaseYears.start=1874-2050';
                }
                fetchMovies(); //это в recomendation.html не надо
                console.log(ReleaseYearsStart);
                console.log(API_URL);
                event.preventDefault();
            }
        });
    });


    //выбор фильмов по стране выхода
    let ReleaseCountry = [];
    let CountryList = document.querySelectorAll('.Country')

    CountryList.forEach(function (Country) {
        Country.addEventListener('click', function (event) {
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
                if (StrReleaseCountry !== '') {
                    CountriesName = `&countries.name=${StrReleaseCountry}`;
                } else {
                    CountriesName = '';
                }
                fetchMovies(); //это в recomendation.html не надо
                console.log(CountriesName);
                console.log(API_URL);
                event.preventDefault();
            }
        });
    });


    //выбор фильмов по жанру
    let ReleaseGenre = [];
    let GenreList = document.querySelectorAll('.Genre')

    GenreList.forEach(function (Genre) {
        Genre.addEventListener('click', function (event) {
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
                if (StrReleaseGenre !== '') {
                    GenresName = `&genres.name=${StrReleaseGenre}`;
                } else {
                    GenresName = ``;
                }
                fetchMovies(); //это в recomendation.html не надо
                console.log(GenresName);
                console.log(API_URL);
                event.preventDefault();
            }
        });
    });

    // выбор сортировки
    let ReleaseSort = [];
    let sortingList = document.querySelectorAll('.Sorting')

    sortingList.forEach(function (Sort) {
        Sort.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                let content = event.target.textContent;
                let index = ReleaseSort.indexOf(content);
                if (index !== -1) {
                    ReleaseSort.splice(index, 1);
                    event.target.style.background = '#f5f5f5';
                } else {
                    ReleaseSort.push(content);
                    event.target.style.background = '#ffee58';
                }
                if (ReleaseSort.indexOf("по популярности") != -1 && ReleaseSort.indexOf("по новизне") != -1) {
                    SortingName = '&sortType=-1&sortField=votes.kp&sortType=-1&sortField=year';
                } else if (ReleaseSort.indexOf("по новизне") != -1) {
                    SortingName = '&sortType=-1&sortField=year';
                } else if (ReleaseSort.indexOf("по популярности") != -1) {
                    SortingName = '&sortType=-1&sortField=votes.kp';
                }
                console.log(SortingName);
                fetchMovies();
                event.preventDefault();
            }
        });
    });
}
//дальше в recomendation.html не надо


//other html
if (document.querySelector('.mv_li1')) {
    getUserLike();

    function CreateMovieElement(movie) {
        const div = document.createElement('div');
        console.log(movie);
        let movie_name = movie.name ? (movie.name.length > 40 ? movie.name.slice(0, 40) + '...' : movie.name) : "Нет названия";
        let poster_url = movie.posterUrl != null ? movie.posterUrl : "../static/zaglushka.jpg";
        let age_rating = movie.ageRating != null ? movie.ageRating + '+' : '';
        let imdb_rating = movie.imdb_rating != '0' ? movie.imdb_rating : 'Нет';
        div.className = 'movie';
        //div.id = movie-${movie.id}; надо будет добавить id
        div.id = `${movie.id}`;//надо будет поменять
        div.innerHTML = `
            <div class="like_movie_li">
                <div class="movie_photo_li">
                    <img src="${poster_url}">
                </div>
                <div class="movie_describe_li">
                    <div class="movie_name_li">${movie_name}</div>
                    <div class="movie_data_li">${movie.releaseStart} ${age_rating}</div>
                    <div class="movie_rating_li">
                        <img src="../static/star.png"> ${imdb_rating}
                    </div>
                </div>
            </div>
    `/*<div class="movie_data_li">${movie.releaseStart} ${movie.movieLength} ${movie.ageRating}</div>*/
        return div
    }


    /*
    <div class="movie_element">Режиссер <strong class="bl">Николас Виндинг Рефн</strong></div> 
    <div class="movie_element">Сценарий <strong class="bl">Хуссейн Амини, Джеймс Саллис</strong></div>
    <div class="movie_element">Продюсер <strong class="bl">Мишель Литвак, Джон Палермо, Марк Э. Платт</strong></div>
    <div class="movie_element">Художник <strong class="bl">Бет Микл, Кристофер Тандон, Эрин Бенач</strong></div>
    <div class="movie_element">Композитор <strong class="bl">Клифф Мартинес</strong></div>
    После  <div class="movie_name"><h1>${movie.name}</h1></div>
    <ul class="switch_menu mv_li">
        <li class="select_option">
            О фильме
        </li>
        <li class="select_option">
            Рецензии зрителей
        </li>
    </ul>
    */
    function MovieCard(movie, InnerRating, filmReviews) {
        console.log('ss');
        if (InnerRating.error === "Нет такого фильма в базе данных") {
            InnerRating = {average_rate: 0, rate: 0};
        }
        console.log(sigma);
        console.log(InnerRating);
        console.log(filmReviews)
        console.log(movie.name);
        const div = document.createElement('div');
        div.className = 'MovieCard';
        div.id = `${movie.id}`;
        const reviewsContainer = document.createElement('div');
        reviewsContainer.id = 'reviews-container';
        reviewsContainer.innerHTML = `<p class='otzivi'>Отзывы</p>`
        if (filmReviews.error !== 'Нет отзывов') {
            filmReviews.forEach(review => {
                const reviewDiv = document.createElement('div')
                reviewDiv.className = "ReviewCard";
                reviewDiv.innerHTML = `
                <p class="user_name">${review.user_name}</p>
                <p class="user_review">${review.review}</p>
                <p class="time">${review.timestamp}</p>`
                reviewsContainer.appendChild(reviewDiv);
            });
        }
        let poster_url = movie.posterUrl != null ? movie.posterUrl : "../static/zaglushka.jpg";
        let kp_rating = movie.kp_rating != '0' ? '' + movie.kp_rating : "Нет";
        let imdb_rating = movie.imdb_rating != '0' ? '' + movie.imdb_rating : "Нет";
        InnerRating.average_rate = (InnerRating.average_rate != "0" && InnerRating.average_rate != null) ? '' + InnerRating.average_rate : "Нет";
        InnerRating.rate = InnerRating.rate != "0" ? InnerRating.rate : ""
        countriesList = movie.countries;
        div.innerHTML = `
                    <div class="movie_data">
                        <div class="movie_name"><h1>${movie.name}</h1></div>
                        <div class="movie_describe">
                            <div class="movie_text">
                                <div class="movie_element">Год производства <strong class="bl">${movie.releaseStart}</strong></div>
                                <div class="movie_element">Страна <strong class="bl">${countriesList}</strong></div>
                                <div class="movie_element">Жанр <strong class="bl">${movie.genres}</strong></div>
                                <div class="rating_block">
                                    <div class="srv_rate">
                                        <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                        <strong class="rate">${kp_rating.slice(0, 3)}</strong>
                                    </div>
                                    <div class="srv_rate">
                                        <img class="logo2" src="../static/imdb.png" >
                                        <strong class="rate">${imdb_rating.slice(0, 3)}</strong>
                                    </div>
                                    <div>
                                        <img class="logo3" src="../static/logo.png">
                                        <strong class="rate0">${InnerRating.average_rate.slice(0, 3)}</strong>
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
                            <img class="movie_photo" src="${poster_url}">
                        </div>
                        <div class="movie_panel_li">
                            <ul class="mv_li">
                                <li>
                                    <div class="movie_panel_btn delete">
                                        <img class="mv_pnl_btn" src="../static/broken_heart.png"">
                                        <div class="btn_name">Убрать из списка</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="movie_panel_btn ratte" id="open-modal-btn">
                                        <img id="open-modal-btn" class="mv_pnl_btn" src="../static/star.png" }}">
                                        <div id="open-modal-btn" class="btn_name">Оценить</div>
                                    </div>
                                    <div class="YourMark">
                                        <p class="YourMark1">Ваша оценка</p>
                                        <div class="value">
                                            <img class="mv_mrk_btn" src="../static/star.png" }}">
                                            <p class="innerrating">${InnerRating.rate}</p>
                                        </div>
                                    </div>
                                    <div class="movie_panel_btnx review" id="open-modal-btnx">
                                        <p class="Review1">Оставить отзыв</p>
                                    </div>
                                    <div class="modal" id="my-modal">
                                        <div class="modal_box">
                                            <button type="button" class="modal_close_btn" id="close-my-modal-btn">
                                                <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.09082 0.03125L22.9999 22.0294L20.909 24.2292L-8.73579e-05 2.23106L2.09082 0.03125Z" fill="#333333"></path>
                                                    <path d="M0 22.0295L20.9091 0.0314368L23 2.23125L2.09091 24.2294L0 22.0295Z" fill="#333333"></path>
                                                </svg>
                                            </button>
                                            <div class="rate2">
                                                <img src="../static/star.png" width='50' height="50">
                                                <p class="bad">1</p>
                                                <p class="bad">2</p>
                                                <p class="bad">3</p>
                                                <p class="bad">4</p>
                                                <p class="okay">5</p>
                                                <p class="okay">6</p>
                                                <p class="good">7</p>
                                                <p class="good">8</p>
                                                <p class="good">9</p>
                                                <p class="good">10</p>
                                            </div>
                                            <div class="send">
                                                <p>Сохранить</p>
                                            </div>
                                            

                                        </div>
                                    </div>
                                    <div class="modalx" id="my-modalx">
                                        <div class="modal_boxx">
                                            <button type="button" class="modal_close_btnx" id="close-my-modal-btnx">
                                                <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.09082 0.03125L22.9999 22.0294L20.909 24.2292L-8.73579e-05 2.23106L2.09082 0.03125Z" fill="#333333"></path>
                                                    <path d="M0 22.0295L20.9091 0.0314368L23 2.23125L2.09091 24.2294L0 22.0295Z" fill="#333333"></path>
                                                </svg>
                                            </button>
                                            <div class="Review1">
                                                <textarea class="inputreview"></textarea>
                                            </div>
                                            <div class="sendx">
                                                <p>Сохранить</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
        `
        div.appendChild(reviewsContainer);
        return div
    }

    let sigma;  //хранение текущего названия фильма
    function UpdateMovieCard(id) {
        const MovieCardContent = document.querySelector('.selected_movie');
        const movie = Liked[id]; // Убедитесь, что переменные объявлены корректно
        sigma = movie.id;
        console.log(sigma, 'eesssa');

        // Асинхронно получаем рейтинг и отзывы, используя Promise.all для их одновременного выполнения
        Promise.all([
            getfilmark(sigma),
            getfilmReviews(sigma)
        ])
            .then(results => {
                const InnerRating = results[0];
                const filmReviews = results[1];

                console.log('eshkere');
                console.log(Liked[id]);
                MovieCardContent.innerHTML = ''; // Очищаем контент карточки
                MovieCardContent.appendChild(MovieCard(movie, InnerRating, filmReviews));
            })
            .catch(error => {
                console.error('Произошла ошибка при обновлении карточки фильма:', error);
            });
    }

    //нажатие на фильм
    document.addEventListener('DOMContentLoaded', function () {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');

        list.addEventListener('click', function (event) {
            // ищем ближайшего предка с классом 'like_movie_li'.
            let target = event.target;
            while (target != this) {
                if (target.classList.contains('like_movie_li')) {

                    document.querySelectorAll('.like_movie_li').forEach(function (el) {
                        el.style.background = '';
                    });
                    target.style.background = 'white';
                    break;
                }
                // Перемещаемся к следующему родительскому элементу.
                target = target.parentNode;
            }
        });
    });
    let index;

    //меняем карточку
    document.addEventListener('DOMContentLoaded', function () {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');
        if (list) {
            list.addEventListener('click', function (event) {
                let movieElement = event.target.closest('.movie');
                if (movieElement) {
                    let movieId = movieElement.id;
                    console.log('Нажат фильм с ID:', movieId);
                    for (let i = 0; i < Liked.length; i++) {
                        if (`${Liked[i].id}` === movieId) {
                            UpdateMovieCard(i);
                            break;
                        }
                    }
                }
            })
        } else {
            console.error("Элемент с классом 'movie' не найден.");
        }
    });


    //получение оценки текущего фильма с бд
    function getfilmark(sigma) {
        return fetch(`/api/rate/${sigma}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(info => {
                console.log(info);
                return info;
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    }

    //получение отзывов фильмы

    function getfilmReviews(sigma) {
        return fetch(`/api/review/${sigma}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(info => {
                console.log(info);
                return info;
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    }

    //отзыв
    //считывание текста
    let message;

    function saveAndClearText() {
        let textareaElement = document.querySelector('.inputreview');
        message = textareaElement.value;
        textareaElement.value = '';
    }

    //Добавка класса Open
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener('click', function (event) {
            var targetElement = event.target;
            while (targetElement != null) {
                if (targetElement.id === 'open-modal-btnx') {
                    var modal = document.getElementById('my-modalx');
                    if (modal) {
                        modal.classList.add('open');
                    } else {
                        console.error('Element with id "my-modalx" not found.');
                    }
                    break;
                }
                targetElement = targetElement.parentElement;
            }
        });
    });

    //убираем класс Open
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            let closeButton = event.target.closest("#close-my-modal-btnx");
            if (closeButton) {
                var modal = document.getElementById("my-modalx");
                if (modal) {
                    modal.classList.remove("open");
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modalx" not found.');
                }
            }
        });
    })

    //запрос отправки отзыва
    function fetchUserReview() {
        fetch('/api/add_review', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([message, sigma]),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong with the network response.');
                }
            })
            .then(data => {
                console.log('успешно отправлено', data);
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
    }

    //отправка на серв по клику
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            let closeButton = event.target.closest(".sendx");
            if (closeButton) {
                saveAndClearText()
                fetchUserReview()
                if (message == "") {
                    alert('Оставьте отзыв');
                } else {
                    console.log(JSON.stringify([message, sigma]))
                    JustPushedReview = document.getElementById('reviews-container');
                    const reviewDiv = document.createElement('div')
                    let user_name = document.querySelector('.Name').textContent;
                    let date = new Date();
                    const moscowOffset = 0;
                    const localOffset = date.getTimezoneOffset();
                    const offsetDifference = moscowOffset - localOffset;
                    date.setMinutes(date.getMinutes() + offsetDifference);
                    let currentGMTString = date.toUTCString();
                    reviewDiv.className = "ReviewCard";
                    reviewDiv.innerHTML = `
                    <p class="user_name">${user_name}</p>
                    <p class="user_review">${message}</p>
                    <p class="time">${currentGMTString}</p>`
                    JustPushedReview.appendChild(reviewDiv);

                }
            }
        });
    });


    //оценка
    //Добавка класса Open
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener('click', function (event) {
            var targetElement = event.target;
            while (targetElement != null) {
                if (targetElement.id === 'open-modal-btn') {
                    var modal = document.getElementById('my-modal');
                    if (modal) {
                        modal.classList.add('open');
                    } else {
                        console.error('Element with id "my-modal" not found.');
                    }
                    break;
                }
                targetElement = targetElement.parentElement;
            }
        });
    });
    //убираем класс Open
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            let closeButton = event.target.closest("#close-my-modal-btn");
            if (closeButton) {
                var modal = document.getElementById("my-modal");
                if (modal) {
                    modal.classList.remove("open");
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modal" not found.');
                }
            }
        });
    })


    //отправка на серв по клику
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener("click", function (event) {
            let closeButton = event.target.closest(".send");
            if (closeButton && star !== 11) {
                Rate(star, sigma, function () {
                    const ratingElement = document.querySelector('.innerrating');
                    ratingElement.textContent = star;
                    console.log('success');
                    getfilmark(sigma).then(InnerRating => {
                        console.log('eshkere');
                        console.log(InnerRating);
                        websiterating = document.querySelector('.rate0');
                        websiterating.textContent = InnerRating.average_rate.toFixed(1);
                        ;
                    });
                });
            } else if (closeButton && star === 11) {
                alert('поставьте оценку фильму');
            }
        });
    });


    //нажатие на число оценки
    let star;
    document.addEventListener('DOMContentLoaded', function () {
        let selected;

        function resetColors() {
            document.querySelectorAll('.rate2 p').forEach(function (p) {
                p.style.color = ''; // Сброс цвета текста
            });
        }

        document.body.addEventListener('click', function (e) {
            // чекаем, что элемент на который нажали это тег p в .rate2
            if (e.target && e.target.nodeName === 'P' && e.target.closest('.rate2')) {
                resetColors();
                star = e.target.textContent;
                selected = e.target;
                if (['1', '2', '3', '4'].includes(star)) {
                    selected.style.color = 'red';
                } else if (['5', '6'].includes(star)) {
                    selected.style.color = 'brown';
                } else if (['7', '8', '9', '10'].includes(star)) {
                    selected.style.color = 'green';
                }
                console.log(star);
                console.log(sigma);
            }
        });
    });

    //запрос на отправку фильма и оценки пользователя нужен будет адрес (отправка оценки и названия фильма)
    function Rate(star, sigma, callback) {
        fetch('/api/rate/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: sigma, rate: star}),
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
                console.log("wtf")
                console.log(JSON.stringify({name: sigma, rate: star}));
                if (callback) {
                    callback(info); // Вызываем колбэк с результатом
                }
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
    }

    //удаление у пользователя
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (event) {
            // Проверяем, что элемент имеет класс delete
            if (event.target.closest('.delete')) {
                // Ищем фильм с нужным названием sigma в Liked
                let index = Liked.findIndex(function (item) {
                    return item.id === sigma;
                });
                fetchUserDel(Liked[index]);// удаляю, отправляю фулл элемент удаляемый
                console.log(index);
                Liked = Liked.filter(function (item) {
                    return item.id !== sigma;
                });
            }
        });
    });

    //запрос на удаление (нужно будет попросить поменять ссылку)
    function fetchUserDel(movie) {
        fetch('/api/favorites/delete', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: movie.id}),
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
                location.reload();
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
    }
}

async function get_film_name() {
    const response = await fetch(`http://127.0.0.1:5000/api/gigachat_film`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    data = await response.json();
    film_name_gigachat = data.content;
    API_URL = `https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=5&query=${encodeURIComponent(film_name_gigachat)}`;
    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        ImageList = data;
        LenOfImageList = ImageList.docs.length; // Указываем длину списка
        i = 0;
        ThroughList(); // Вызываем функцию для обработки списка
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.closest('.gigachat_btn')) {
            get_film_name();
        }
    });
});