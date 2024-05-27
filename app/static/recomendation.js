let ReleaseYearsStart = '&releaseYears.start=1874-2050';
let GenresName = '';
let CountriesName = '';
localStorage.setItem('Countries', CountriesName);
localStorage.setItem('Years', ReleaseYearsStart);
localStorage.setItem('Genres', GenresName);


async function get_preferences() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/preferences`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

let ReleaseDate = [];
let StrReleaseDate = '';
let DateList = document.querySelectorAll('.ReleaseDate')

get_preferences().then(data => {
    let savedDates = data[2][0];
    if (savedDates) {
        savedDates.split(',').forEach(function (savedDate) {
            DateList.forEach(function (ul) {
                ul.querySelectorAll('a').forEach(function (link) {
                    console.log(savedDate);
                    if (link.textContent.trim() === savedDate.split('-').join(' - ')) {
                        link.style.background = '#ffee58';
                        ReleaseDate.push(savedDate.split('-').join(' - '));
                    }
                });
            });
        });
    }
    StrReleaseDate = ReleaseDate.map(date => date.replace(/\s/g, '').replace("До", "1874-")).join('&releaseYears.start=');
    if (StrReleaseDate !== '') {
        ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
    } else {
        ReleaseYearsStart = '&releaseYears.start=1874-2050';
    }
    localStorage.setItem('Years', ReleaseYearsStart);
    console.log(ReleaseYearsStart);
});

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
            localStorage.setItem('Years', ReleaseYearsStart);
            console.log(ReleaseYearsStart);
            event.preventDefault();
        }
    });
});


//выбор фильмов по стране выхода
let ReleaseCountry = [];
let StrReleaseCountry = '';
let CountryList = document.querySelectorAll('.Country')

get_preferences().then(data => {
    let savedCountries = data[1][0];
    if (savedCountries) {
        savedCountries.split(',').forEach(function (savedCountry) {
            CountryList.forEach(function (ul) {
                ul.querySelectorAll('a').forEach(function (link) {
                    console.log(savedCountry);
                    if (link.textContent.trim() === savedCountry.split('-').join(' - ')) {
                        link.style.background = '#ffee58';
                        ReleaseCountry.push(savedCountry.split('-').join(' - '));
                    }
                });
            });
        });
    }
    StrReleaseCountry = ReleaseCountry.join('&countries.name=');
    if (StrReleaseCountry !== '') {
        CountriesName = `&countries.name=${StrReleaseCountry}`;
    } else {
        CountriesName = '';
    }
    localStorage.setItem('Countries', CountriesName);
    console.log(CountriesName);
});

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
            localStorage.setItem('Countries', CountriesName);
            console.log(CountriesName);
            event.preventDefault();
        }
    });
});


//выбор фильмов по жанру
let ReleaseGenre = [];
let StrGenreList = '';
let GenreList = document.querySelectorAll('.Genre')

get_preferences().then(data => {
    let savedGenres = data[0][0].split(',');
    if (savedGenres) {
        savedGenres.forEach(function (savedGenry) {
            GenreList.forEach(function (ul) {
                ul.querySelectorAll('a').forEach(function (link) {
                    console.log(savedGenry);
                    if (link.textContent.trim() === savedGenry.split('-').join(' - ')) {
                        link.style.background = '#ffee58';
                        ReleaseGenre.push(savedGenry.split('-').join(' - '));
                    }
                });
            });
        });
    }
    StrReleaseGenre = ReleaseGenre.join('&genres.name=');
    if (StrReleaseGenre !== '') {
        GenresName = `&genres.name=${StrReleaseGenre}`;
    } else {
        GenresName = ``;
    }
    localStorage.setItem('Genres', GenresName);
    console.log(GenresName);
});

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
            localStorage.setItem('Genres', GenresName);
            console.log(GenresName);
            event.preventDefault();
        }
    });
});


document.querySelector('.save').addEventListener('click', function (event) {
    event.preventDefault();
    const url = event.currentTarget.closest('.save-link').getAttribute('href');
    let j = 1;
    // Предполагаем, что api_url - это URL сервера для отправки POST запроса
    const api_url = `https://api.kinopoisk.dev/v1.4/movie?page=${j}&limit=10&selectFields=name&selectFields=id&selectFields=persons&selectFields=description&selectFields=shortDescription&selectFields=rating&selectFields=ageRating&selectFields=poster&selectFields=genres&selectFields=countries&selectFields=movieLength&selectFields=${ReleaseYearsStart}${GenresName}${CountriesName}`;

    fetch('/api/preferences/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: api_url}),
    }).then(response => {
        if (response.ok) {
            window.location.href = url;
            return response.json();
        }
        throw new Error('Server responded with an error.');
    }).catch(error => {
        console.error('Error:', error);
    });
    event.reventDefault();
});