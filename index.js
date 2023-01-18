const apikey = "236035ca857f1ac1e566c6975bcf6951";
let url = "https://api.themoviedb.org/3";
let imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchCategory: `${url}/genre/movie/list?api_key=${apikey}`,
  fetchMovieList: (id) =>
    `${url}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchUpcoming:`${url}/movie/upcoming?api_key=${apikey}`,
    fetchPopular:`${url}/movie/top_rated?api_key=${apikey}`,
  fetchTrending: `${url}/trending/all/day?api_key=${apikey}`,
  fetchNowPlaying:`${url}/movie/now_playing?api_key=${apikey}`,
  fetchYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBmqpJH3-0Cbiy39_EidQM3D4p_6LAtlao`,
   
};

let init = () => {
    fetchNowPlaying();
    fetchUpcoming();
    fetchTrendingMovie();
    fetchPopular();
  fetchSections();
};

let fetchPopular = ()=>{
    fetchSection(apiPaths.fetchPopular,"Popular Now");
};
let fetchUpcoming = ()=>{
    fetchSection(apiPaths.fetchUpcoming,"Upcoming");
};
let  fetchNowPlaying = ()=>{
    fetchSection(apiPaths. fetchNowPlaying,"Now Playing");
};

let fetchTrendingMovie = () => {
  fetchSection(apiPaths.fetchTrending, "Trending Now").then((list) => {
    const random = Math.floor(Math.random() * 20);
    console.log(random);
    buildBannerSection(list[random]);
  });
};



let buildBannerSection = (movie) => {
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

  const div = document.createElement("div");
  div.innerHTML = `
<h2 class="banner-title">${movie.name || movie.title}  </h2>
<p class="banner-info">${movie.release_date || movie.first_air_date}</p>
<p class="banner-overview">${
    movie.overview && movie.overview.length > 200
      ? movie.overview.slice(0, 200).trim() + "..."
      : movie.overview
  }</p>
<div class="action-button-cont">
    <button class="action-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
      </svg>
PLay
    </button>
    <button class="action-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
More Info
    </button>
</div>
`;
  div.className = "banner-content container";
  bannerCont.append(div);
};

let fetchSections = () => {
  fetch(apiPaths.fetchCategory)
    .then((res) => res.json())
    .then((res) => {
      const categorys = res.genres;
      if (Array.isArray(categorys) && categorys.length) {
        categorys.forEach((category) => {
          fetchSection(apiPaths.fetchMovieList(category.id), category.name);
        });
      }
      // console.table(movies);
    });
};


let fetchSection = (fetchUrl, categoryName) => {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
};

let buildMovieSection = (list, categoryName) => {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const movieListHtml = list
    .map((item) => {
      return `
    <div class="movie-item" id = "movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')" >
   
        <img  width="300px" src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="movie-item-img" )>
        <iframe width="300px" height="150px" src="" 
        id="yt${item.id}"></iframe>
        <div class="movie-info">
        <div class = "info-icon">
        <div>
          <i class="bi bi-play-circle-fill"></i>
          <i class="bi bi-plus-circle"></i>
          <i class="bi bi-hand-thumbs-up"></i>
          </div>
           <div>
            <i class="bi bi-caret-down-fill" id="bigInfoCont"></i>
            </div>
        </div>
    <div class="info-cont">
    <p>${item.title}</p>
    <p>${item.release_date} Language:${item.original_language}</p>
    <p>Rating: ${item.vote_average}</p>

    </div>
       </div>

    </div>  
   
`;
    })
    .join("");
   

  const movieSectionHtml = `
<h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">&nbsp;Explore All </span> </h2>
<div class="movies-row" id="movies-row">

${movieListHtml}
</div>

`;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = movieSectionHtml;
  moviesCont.append(div);
}

let searchMovieTrailer = (movieName, iframeId) => {
  if (!movieName) return;
  fetch(apiPaths.fetchYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const bestResult = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
      console.log(youtubeUrl);
      document.getElementById(
        iframeId
      ).src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&mute=1`;
    })
    .catch((err) => console.error(err));
};


window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", () => {
    const head = document.getElementById("header");
    if (window.scrollY > 5) head.classList.add("black_bg");
    else head.classList.remove("black_bg");
   
  });
});

/***
 *!DROPDOWN JS
 **/

function login() {
  document.getElementById("myDropdown").classList.toggle("show");
}




