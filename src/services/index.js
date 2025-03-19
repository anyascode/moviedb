// const url = 'https://api.themoviedb.org/3/search/movie?query=returnhh&include_adult=false&language=en-US&page=1';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default class MovieService {
  async fetchMovies(query) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        options
      );
      if (!response.ok) {
        throw new Error(`${response.text}`);
      }
      const data = await response.json();

      return data.results.map((movie) => ({
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        date: movie.release_date,
        description: movie.overview,
        genres: movie.genre_ids,
        id: movie.id,
      }));
    } catch (err) {
      console.log(err);
    }
  }
}
