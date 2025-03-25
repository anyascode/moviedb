import { createContext } from 'react';
import { Component } from 'react';
import * as themoviedb from '../services/themoviedb';

export const GenreContext = createContext(null);

export class SessionProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: [],
    };
  }

  componentDidMount() {
    this.getGenres();
  }

  async getGenres() {
    try {
      const genres = await themoviedb.getGenres();
      this.setState({ genres: genres });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return <GenreContext.Provider value={this.state.genres}>{this.props.children}</GenreContext.Provider>;
  }
}
