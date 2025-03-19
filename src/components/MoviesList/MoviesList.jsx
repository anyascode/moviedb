import MovieCard from '../MovieCard/MovieCard.jsx';
import Error from '../Error/Error.jsx';
import { Col, Input, Row, Spin, Pagination } from 'antd';
import './MoviesList.css';
import { Component } from 'react';
import { debounce } from 'lodash';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

class MoviesList extends Component {
  state = {
    movies: [],
    loading: false,
    error: false,
    totalCount: 0,
    currentPage: 1,
    searchQuery: 'A',
  };

  componentDidMount() {
    this.getMovies(this.state.searchQuery, this.state.currentPage);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      this.getMovies(this.state.searchQuery, this.state.currentPage);
    }
  }

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value }, () => {
      this.getMovies(this.state.searchQuery, this.state.currentPage);
    });
  };

  handlePagination = (pageNum) => {
    this.setState({ currentPage: pageNum });
  };

  async getMovies(query, pageNum) {
    this.setState({ loading: true, error: false });
    try {
      const movies = await this.fetchMovies(query, pageNum);
      console.log(movies);
      if (movies.length === 0) {
        throw new Error('нет фильмов');
      }
      this.setState({ movies: movies, loading: false });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false, error: true });
    }
  }

  async fetchMovies(query, pageNum) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNum}`,
        options
      );
      if (!response.ok) {
        throw new Error(`${response.text}`);
      }
      const data = await response.json();
      this.setState({ totalCount: data.total_results });
      console.log(data);
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
  render() {
    const { loading, movies, error, totalCount } = this.state;

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
        <Input onChange={debounce(this.handleChange, 3000)} placeholder="Type to search..." />
        {errorMessage}
        {loader}
        {data}
        <Pagination
          align="center"
          defaultCurrent={1}
          total={totalCount}
          showSizeChanger={false}
          onChange={this.handlePagination}
        />
      </div>
    );
  }
}

export default MoviesList;
