import { Card, Tag, Col, Flex, ConfigProvider, Image, Rate, Row } from 'antd';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { TheMovieDBContext } from '../../context/themoviedb.jsx';
import './MovieCard.css';

class MovieCard extends Component {
  static contextType = TheMovieDBContext;

  constructor() {
    super();

    this.handleRate = this.handleRate.bind(this);
    this.truncateString = this.truncateString.bind(this);
  }

  async handleRate(rating) {
    await this.context.rateMovie(this.props.id, rating);
  }

  truncateString(str, maxLength) {
    if (str.split(' ').length > maxLength) {
      return (
        str
          .split(' ')
          .slice(0, maxLength - 1)
          .join(' ') + '...'
      );
    }
    return '';
  }

  render() {
    const { title, description, posterUrl, date, vote, genres, id } = this.props;
    const rating = this.context.ratings[id];
    let formattedDate = 'Coming soon';
    if (date) {
      try {
        formattedDate = format(parseISO(date), 'MMMM d, y');
      } catch (error) {
        console.error('Ошибка форматирования даты:', error);
      }
    }

    const averageRating = Number.parseFloat(vote).toFixed(1);

    return (
      <ConfigProvider
        theme={{
          components: {
            Card: {
              bodyPadding: 0,
            },
            Rate: {
              starSize: 15,
            },
          },
        }}
      >
        <Card className="movie-card">
          <Row>
            <Col xl={10} sm={8} xs={6} md={9}>
              <Image src={posterUrl} alt={`${title} poster`} />
            </Col>
            <Col xl={14} sm={16} xs={18} md={15} className="movie-info">
              <h5 className="movie-title">
                {title}{' '}
                <span
                  className={`movie-vote ${averageRating >= 7 ? 'good' : averageRating >= 5 ? 'average' : averageRating >= 3 ? 'belowAverage' : 'awful'}`}
                >
                  {averageRating}
                </span>
              </h5>
              <p className="movie-date">{formattedDate}</p>
              <div className="movie-tags">
                {genres.map((genre) => (
                  <Tag key={genre} className="movie-tag">
                    {genre}
                  </Tag>
                ))}{' '}
              </div>
              <p className="movie-description">{this.truncateString(description, 20)}</p>
              <Rate count={10} onChange={this.handleRate} value={rating} className="movie-rate" />
            </Col>
          </Row>
        </Card>
      </ConfigProvider>
    );
  }
}

MovieCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  posterUrl: PropTypes.string,
  date: PropTypes.string,
};

export default MovieCard;
