import { createContext } from 'react';
import { Component } from 'react';
import * as themoviedb from '../services/themoviedb';

export const SessionContext = createContext(null);

export class SessionProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session_id: '',
      ratedMovies: [],
    };
  }

  async componentDidMount() {
    const session = await themoviedb.getGuestSession();
    const ratedMovies = await themoviedb.getRatedMovies(session.guest_session_id);

    this.setState({
      sessionId: session.guest_session_id,
      ratedMovies,
    });
  }

  render() {
    return <SessionContext.Provider value={this.state}>{this.props.children}</SessionContext.Provider>;
  }
}
