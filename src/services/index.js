const url = 'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default class MovieService {
  async fetchMovies() {
    const movies = await fetch(url, options).then((res) => res.json());
    return movies.results.map((movie) => ({
      title: movie.title,
      poster: movie.poster_path,
      date: movie.release_date,
      description: movie.overview,
      genres: movie.genre_ids,
      id: movie.id,
    }));
  }
}
