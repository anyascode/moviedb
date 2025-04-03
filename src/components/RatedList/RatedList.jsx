import { Col, Row, Spin, Pagination } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { TheMovieDBContext } from '../../context/themoviedb.jsx';
import Error from '../Error/Error.jsx';
import MovieCard from '../MovieCard/MovieCard.jsx';
import '../MoviesList/MoviesList.css';

function RatedList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const context = useContext(TheMovieDBContext);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(false);
      const { movies, totalResults } = await context.getRatedMovies();
      setMovies(movies);
      setLoading(false);
      setTotalCount(totalResults);
      setError(movies.length === 0);
    }
    fetchMovies();
  }, [context]);

  function handlePagination(pageNum) {
    setCurrentPage(pageNum);
  }

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
        onChange={handlePagination}
        current={currentPage}
      />
    </div>
  );
}

export default RatedList;
