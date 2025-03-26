import MovieCard from '../MovieCard/MovieCard.jsx';
import Error from '../Error/Error.jsx';
import { Col, Input, Row, Spin, Pagination } from 'antd';
import './MoviesList.css';
import { Component } from 'react';
import { debounce } from 'lodash';
import { TheMovieDBContext } from '../../context/themoviedb.jsx';

class MoviesList extends Component {
  static contextType = TheMovieDBContext;

  state = {
    movies: [],
    loading: false,
    error: false,
    totalCount: 0,
    currentPage: 1,
    searchQuery: 'Spiderman',
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
    this.setState({ currentPage: 1, searchQuery: e.target.value }, () => {
      this.fetchMovies(this.state.searchQuery, this.state.currentPage);
    });
  };

  handlePagination = (pageNum) => {
    this.setState((prev) => ({ ...prev, currentPage: pageNum }));
  };

  async fetchMovies(query, page) {
    this.setState((prev) => ({ ...prev, loading: true, error: false }));
    const { movies, totalResults } = await this.context.getMovies(query, page);

    this.setState((prev) => ({
      ...prev,
      movies,
      loading: false,
      totalCount: totalResults,
      error: movies.length === 0,
    }));
  }
  render() {
    const { searchQuery, loading, movies, error, totalCount, currentPage } = this.state;
    const hasData = !loading && !error;
    console.log(totalCount);
    return (
      <div className="movies-list">
        <Input
          onChange={debounce(this.handleChange, 3000)}
          placeholder="Type to search..."
          defaultValue={searchQuery}
        />{' '}
        {error ? <Error /> : null}
        {loading ? (
          <div className="loader">
            <Spin size="large" />
          </div>
        ) : null}
        {hasData ? (
          <Row gutter={[32, 32]}>
            {movies.map((movie) => (
              <Col lg={12} key={movie.id}>
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
          pageSize={20}
          onChange={this.handlePagination}
          current={currentPage}
        />
      </div>
    );
  }
}

export default MoviesList;
