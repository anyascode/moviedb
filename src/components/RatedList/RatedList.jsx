import { Col, Row, Spin, Pagination } from 'antd';
import { Component } from 'react';
import { TheMovieDBContext } from '../../context/themoviedb.jsx';
import Error from '../Error/Error.jsx';
import MovieCard from '../MovieCard/MovieCard.jsx';
import '../MoviesList/MoviesList.css';

class RatedList extends Component {
  static contextType = TheMovieDBContext;
  state = {
    movies: [],
    loading: false,
    error: false,
    totalCount: 0,
    currentPage: 1,
  };

  componentDidMount() {
    this.fetchMovies(this.state.searchQuery, this.state.currentPage);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      this.fetchMovies(this.state.searchQuery, this.state.currentPage);
    }
  }

  handlePagination = (pageNum) => {
    this.setState((prev) => ({ ...prev, currentPage: pageNum }));
  };

  async fetchMovies() {
    this.setState((prev) => ({ ...prev, loading: true, error: false }));
    const { movies, totalResults } = await this.context.getRatedMovies();
    console.log(movies);
    this.setState((prev) => ({
      ...prev,
      movies,
      loading: false,
      totalCount: totalResults,
      error: movies.length === 0,
    }));
  }
  render() {
    const { loading, movies, error, totalCount } = this.state;
    const hasData = !loading && !error;

    return (
      <div className="movies-list">
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
                  rating={movie.rating}
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

export default RatedList;
