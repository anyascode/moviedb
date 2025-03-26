import { Spin } from 'antd';
import { Component, createContext } from 'react';
import * as themoviedb from '../services/themoviedb';

const noop = () => {};

export const TheMovieDBContext = createContext({
  genres: {},
  ratings: {},
  getMovies: noop,
  getRatedMovies: noop,
  rateMovie: noop,
});

export class TheMovieDBProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: {},
      ratings: {},
      sessionId: '',
      status: 'loading',
    };

    this.getMovies = this.getMovies.bind(this);
    this.getRatedMovies = this.getRatedMovies.bind(this);
    this.rateMovie = this.rateMovie.bind(this);
  }

  async componentDidMount() {
    const [genres, session] = await Promise.all([themoviedb.getGenres(), themoviedb.getGuestSession()]);
    this.setState((prev) => ({
      ...prev,
      genres: genres.reduce((acc, genre) => ({ ...acc, [genre.id]: genre.name }), {}),
      sessionId: session.guest_session_id,
      status: 'idle',
    }));
  }

  async getMovies(query, page) {
    const data = await themoviedb.getMovies(query, page);

    return {
      totalResults: data.total_results,
      movies: data.results.map((movie) => ({
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : `https://www.discountdisplays.co.uk/media/catalog/product/cache/d17dcbfbf201117ac0b96e975ab403a2/p/i/pink_green_coming_soon_poster_.png`,
        date: movie.release_date,
        description: movie.overview,
        genres: movie.genre_ids.map((id) => this.state.genres[id]),
        id: movie.id,
        vote: movie.vote_average,
      })),
    };
  }

  async getRatedMovies() {
    const data = await themoviedb.getRatedMovies(this.state.sessionId);

    return {
      totalResults: data.total_results,
      movies: data.results.map((movie) => ({
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : `https://www.discountdisplays.co.uk/media/catalog/product/cache/d17dcbfbf201117ac0b96e975ab403a2/p/i/pink_green_coming_soon_poster_.png`,
        date: movie.release_date,
        description: movie.overview,
        genres: movie.genre_ids.map((id) => this.state.genres[id]),
        id: movie.id,
        rating: movie.rating,
        vote: movie.vote_average,
      })),
    };
  }

  async rateMovie(movieId, rating) {
    this.setState((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [movieId]: rating,
      },
    }));
    return themoviedb.rateMovie(movieId, this.state.sessionId, rating);
  }

  render() {
    return (
      <TheMovieDBContext.Provider
        value={{
          genres: this.state.genres,
          ratings: this.state.ratings,
          getMovies: this.getMovies,
          getRatedMovies: this.getRatedMovies,
          rateMovie: this.rateMovie,
        }}
      >
        {this.state.status === 'loading' ? (
          <div className="loader">
            <Spin size="large" />
          </div>
        ) : (
          this.props.children
        )}
      </TheMovieDBContext.Provider>
    );
  }
}
