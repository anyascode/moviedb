import { createContext } from 'react';
import { Component } from 'react';
import * as themoviedb from '../services/themoviedb';

export const SessionContext = createContext(null);

export class SessionProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session_id: '',
    };
  }

  componentDidMount() {
    this.getSessionId();
  }

  async getSessionId() {
    try {
      const guestSession = await themoviedb.getGuestSession();
      this.setState({ session_id: guestSession.guest_session_id });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return <SessionContext.Provider value={this.state.session_id}>{this.props.children}</SessionContext.Provider>;
  }
}
