import MovieCard from '../MovieCard/MovieCard.jsx';
import Error from '../Error/Error.jsx';
import { Col, Input, Row, Spin, Pagination } from 'antd';
import './MoviesList.css';
import { useContext, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { TheMovieDBContext } from '../../context/themoviedb.jsx';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('Spiderman');

  const context = useContext(TheMovieDBContext);

  useEffect(() => {
    async function fetchMovies(query, page) {
      setLoading(true);
      setError(false);
      const { movies, totalResults } = await context.getMovies(query, page);
      setMovies(movies);
      setLoading(false);
      setTotalCount(totalResults);
      setError(movies.length === 0);
    }

    fetchMovies(searchQuery, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  function handleChange(e) {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  }

  const hasData = !loading && !error;

  return (
    <div className="movies-list">
      <Input onChange={debounce(handleChange, 3000)} placeholder="Type to search..." defaultValue={searchQuery} />{' '}
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
        onChange={(pageNum) => setCurrentPage(pageNum)}
        current={currentPage}
      />
    </div>
  );
}

export default MoviesList;
