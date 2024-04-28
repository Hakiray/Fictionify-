
//для картинок
const ImageList = [{link: "zoo.webp", name: "Зверополис", description:'США 6+ 108 мин.', rate:'8.3'},
{link:"deadpool_17.jpg", name: "Дедпул", description: 'США 18+ 148 мин.', rate:'8.9'}];


// надо добавить логику обновления какую-нибудь, тип если список очистился и новый загрузился, го длина изменяется и i сбрасывается
LenOfImageList = ImageList.length;
const image = document.querySelector('.Tinder');
const MovieName = document.querySelector('.MovieName');
const Description = document.querySelector('.Description');
const Rating = document.querySelector('.Rating');
let i = 0;
function ThroughList(){
    i = (i + 1) % LenOfImageList;
    image.innerHTML = `<img src=${ImageList[i]['link']} width="350" height="500" alt="" ></img>`;
    MovieName.textContent = `${ImageList[i]['name']}`;
    Description.textContent = `${ImageList[i]['description']}`;
    Rating.textContent = `${ImageList[i]['rate']}`;
}



let Like = document.querySelector('.Heart2');
let Liked = []
Like.addEventListener('click', () =>{
    if (Liked.indexOf(ImageList[i]) === -1){
        Liked.push(ImageList[i]);
    }
    console.log(Liked);
})
Like.addEventListener('click', ThroughList);


let Skip = document.querySelector('.Cross');
Skip.addEventListener('click', ThroughList);


let Mark = document.querySelector('.Add');
let Marked = []
Mark.addEventListener('click', () =>{
    if (Marked.indexOf(ImageList[i]) === -1){
        Marked.push(ImageList[i]);
    }
    console.log(Marked);
})
Mark.addEventListener('click', ThroughList);



let ReleaseDate = [];
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
        event.preventDefault();
    }
});
});


let ReleaseCountry = [];
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
        event.preventDefault();
    }
});
});

let ReleaseGenre = [];
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
        event.preventDefault();
    }
});
});