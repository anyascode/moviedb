/* eslint-disable react-refresh/only-export-components */
import { Spin } from 'antd';
import { createContext, useEffect, useState } from 'react';
import * as themoviedb from '../services/themoviedb';

const noop = () => {};

export const TheMovieDBContext = createContext({
  genres: {},
  ratings: {},
  getMovies: noop,
  getRatedMovies: noop,
  rateMovie: noop,
});

export function TheMovieDBProvider({ children }) {
  const [genres, setGenres] = useState({});
  const [ratings, setRatings] = useState({});
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function fetchData() {
      const [genres, session] = await Promise.all([themoviedb.getGenres(), themoviedb.getGuestSession()]);

      setGenres(genres.reduce((acc, genre) => ({ ...acc, [genre.id]: genre.name }), {}));
      setSessionId(session.guest_session_id);
      setStatus('idle');
    }
    fetchData();
  }, []);

  async function getMovies(query, page) {
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
        genres: movie.genre_ids.map((id) => genres[id]),
        id: movie.id,
        vote: movie.vote_average,
      })),
    };
  }

  async function getRatedMovies() {
    const data = await themoviedb.getRatedMovies(sessionId);

    return {
      totalResults: data.total_results,
      movies: data.results.map((movie) => ({
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : `https://www.discountdisplays.co.uk/media/catalog/product/cache/d17dcbfbf201117ac0b96e975ab403a2/p/i/pink_green_coming_soon_poster_.png`,
        date: movie.release_date,
        description: movie.overview,
        genres: movie.genre_ids.map((id) => genres[id]),
        id: movie.id,
        rating: movie.rating,
        vote: movie.vote_average,
      })),
    };
  }

  async function rateMovie(movieId, rating) {
    setRatings((prev) => ({ ...prev, [movieId]: rating }));
    return themoviedb.rateMovie(movieId, sessionId, rating);
  }

  return (
    <TheMovieDBContext.Provider
      value={{
        genres: genres,
        ratings: ratings,
        getMovies: getMovies,
        getRatedMovies: getRatedMovies,
        rateMovie: rateMovie,
      }}
    >
      {status === 'loading' ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : (
        children
      )}
    </TheMovieDBContext.Provider>
  );
}
