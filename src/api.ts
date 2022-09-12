
const API_KEY = "c2fb08cd2af46e82f3f5f33f1d89bff9";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`)
          .then(resp => resp.json());
}

export function getTv() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`)
          .then(resp => resp.json());
}

// https://api.themoviedb.org/3/movie/now_playing?api_key=c2fb08cd2af46e82f3f5f33f1d89bff9&language=en-US&page=1&region=kr
// https://image.tmdb.org/t/p/w500/vvObT0eIWGlArLQx3K5wZ0uT812.jpg
// https://image.tmdb.org/t/p/original/vvObT0eIWGlArLQx3K5wZ0uT812.jpg

//https://api.themoviedb.org/3/tv/latest?api_key=c2fb08cd2af46e82f3f5f33f1d89bff9&language=en-US