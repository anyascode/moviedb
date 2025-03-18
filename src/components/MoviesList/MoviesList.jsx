import MovieCard from '../MovieCard/MovieCard.jsx';
import Error from '../Error/Error.jsx';
import { Col, Row, Spin } from 'antd';
import './MoviesList.css';
import { Component } from 'react';

import MovieService from '../../services/index.js';

class MoviesList extends Component {
  movieService = new MovieService();
  state = {
    movies: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    this.getMovies();
  }

  async getMovies() {
    this.setState({ loading: true, error: false });
    try {
      const movies = await this.movieService.fetchMovies();
      if (movies.length === 0) {
        throw new Error('нет фильмов');
      }
      this.setState({ movies: movies, loading: false });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false, error: true });
    }
  }
  render() {
    const { loading, movies, error } = this.state;

    const hasData = !(loading || error) && movies.length > 0;

    const errorMessage = error ? <Error /> : null;
    const loader = loading ? (
      <div className="loader">
        <Spin size="large" />
      </div>
    ) : null;
    const data = hasData ? (
      <Row gutter={[32, 32]}>
        {movies.map((movie) => (
          <Col span={12} key={movie.id}>
            <MovieCard title={movie.title} description={movie.description} posterUrl={movie.poster} date={movie.date} />
          </Col>
        ))}
      </Row>
    ) : null;

    return (
      <div className="movies-list">
        {errorMessage}
        {loader}
        {data}
      </div>
    );
  }
}

export default MoviesList;
