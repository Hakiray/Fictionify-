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
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

getUserLike();

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