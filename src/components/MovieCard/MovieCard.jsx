import { Card, Tag, Col, Flex, ConfigProvider, Image, Rate } from 'antd';
import PropTypes from 'prop-types';
import './MovieCard.css';
import { format, parseISO } from 'date-fns';
import { rateMovie } from '../../services/themoviedb.js';
import { SessionContext } from '../../context/session.jsx';
import { Component } from 'react';
import { GenreContext } from '../../context/genres.jsx';

class MovieCard extends Component {
  static contextType = SessionContext;

  constructor() {
    super();

    this.handleRate = this.handleRate.bind(this);
    this.truncateString = this.truncateString.bind(this);
  }

  async handleRate(rating) {
    await rateMovie(this.props.id, this.context, rating);
  }

  truncateString(str, maxLength) {
    let truncatedString = '';
    if (str.split(' ').length > maxLength) {
      truncatedString =
        str
          .split(' ')
          .slice(0, maxLength - 1)
          .join(' ') + '...';
    }
    return truncatedString;
  }

  render() {
    const { title, description, posterUrl, date, rating, vote, genres } = this.props;
    let formattedDate = '';
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
          },
        }}
      >
        <Card className="movie-card" bodyPadding="0">
          <Flex justify="space-between">
            <Col span={10}>
              <Image src={posterUrl} alt="" />
            </Col>
            <Col span={14} className="movie-info">
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
                <Tag className="movie-tag">{genres}</Tag> <Tag className="movie-tag">Drama</Tag>
              </div>
              <p className="movie-description">{this.truncateString(description, 24)}</p>
              <Rate count={10} onChange={this.handleRate} value={rating} />
            </Col>
          </Flex>
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
