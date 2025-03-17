import MovieCard from '../MovieCard/MovieCard.jsx';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import './MoviesList.css';
import { Component } from 'react';

import MovieService from '../../services/index.js';

class MoviesList extends Component {
  movieService = new MovieService();
  state = {
    movies: [],
  };

  componentDidMount() {
    this.getMovies();
  }

  async getMovies() {
    const movies = await this.movieService.fetchMovies();
    this.setState({ movies });
  }
  render() {
    return (
      <div className="movies-list">
        <Row gutter={[32, 32]}>
          {this.state.movies.map((movie) => (
            <Col span={12} key={movie.id}>
              <MovieCard
                key={movie.id}
                title={movie.title}
                description={movie.description}
                posterUrl={movie.poster}
                date={movie.date}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

// function MoviesList({ movielist }) {
//   return (
//     <div className="movies-list">
//       <Row gutter={[32, 32]}>
//         {movielist.map((movie) => (
//           <Col span={12} key={movie.id}>
//             <MovieCard title={movie.title} description={movie.description} posterUrl={movie.poster} date={movie.date} />
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// }

MoviesList.propTypes = {
  movielist: PropTypes.array,
};

export default MoviesList;
