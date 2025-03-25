import MovieCard from '../MovieCard/MovieCard.jsx';
import Error from '../Error/Error.jsx';
import { Col, Input, Row, Spin, Pagination } from 'antd';
import './MoviesList.css';
import { Component } from 'react';
import { debounce } from 'lodash';
import { getMovies } from '../../services/themoviedb.js';

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
    this.fetchMovies(this.state.searchQuery, this.state.currentPage);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      this.fetchMovies(this.state.searchQuery, this.state.currentPage);
    }
  }

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value }, () => {
      this.fetchMovies(this.state.searchQuery, this.state.currentPage);
    });
  };

  handlePagination = (pageNum) => {
    this.setState((prev) => ({ ...prev, currentPage: pageNum }));
  };

  async fetchMovies(query, page) {
    this.setState((prev) => ({ ...prev, loading: true, error: false }));
    const data = await getMovies(query, page);

    const movies = data.results.map((movie) => ({
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      date: movie.release_date,
      description: movie.overview,
      genres: movie.genre_ids,
      id: movie.id,
      vote: movie.vote_average,
    }));
    this.setState((prev) => ({
      ...prev,
      movies,
      loading: false,
      totalCount: data.total_results,
      error: movies.length === 0,
    }));
  }
  render() {
    const { loading, movies, error, totalCount } = this.state;
    const hasData = !loading && !error;

    return (
      <div className="movies-list">
        <Input onChange={debounce(this.handleChange, 3000)} placeholder="Type to search..." />
        {error ? <Error /> : null}
        {loading ? (
          <div className="loader">
            <Spin size="large" />
          </div>
        ) : null}
        {hasData ? (
          <Row gutter={[32, 32]}>
            {movies.map((movie) => (
              <Col span={12} key={movie.id}>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  description={movie.description}
                  posterUrl={movie.poster}
                  date={movie.date}
                  vote={movie.vote}
                  genres={movie.genres}
                />
              </Col>
            ))}
          </Row>
        ) : null}
        <Pagination
          align="center"
          defaultCurrent={1}
          total={totalCount}
          showSizeChanger={false}
          pageSize={movies.length}
          onChange={this.handlePagination}
        />
      </div>
    );
  }
}

export default MoviesList;
