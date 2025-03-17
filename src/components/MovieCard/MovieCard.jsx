import { Card, Tag, Col, Flex, ConfigProvider, Image } from 'antd';
import PropTypes from 'prop-types';
import './MovieCard.css';
import { format, parseISO } from 'date-fns';

function MovieCard({ title, description, posterUrl, date }) {
  let formattedDate = '';
  if (date) {
    try {
      formattedDate = format(parseISO(date), 'MMMM d, y');
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
    }
  }
  function truncateString(str, maxLength) {
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
            <Image src={`https://image.tmdb.org/t/p/original${posterUrl}`} alt="" />
          </Col>
          <Col span={14} className="movie-info">
            <h5 className="movie-title">{title}</h5>
            <p className="movie-date">{formattedDate}</p>
            <div className="movie-tags">
              <Tag className="movie-tag">Action</Tag> <Tag className="movie-tag">Drama</Tag>
            </div>
            <p className="movie-description">{truncateString(description, 24)}</p>
          </Col>
        </Flex>
      </Card>
    </ConfigProvider>
  );
}

MovieCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  posterUrl: PropTypes.string,
  date: PropTypes.string,
};

export default MovieCard;
