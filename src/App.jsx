import './App.css';
import MoviesList from './components/MoviesList/MoviesList.jsx';
import RatedList from './components/RatedList/RatedList.jsx';
import { Online, Offline } from 'react-detect-offline';
import TabsComponent from './components/Tabs/TabsComponent.jsx';
import { SessionProvider } from './context/session.jsx';
import { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'Search',
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };
  render() {
    console.log(this.state.activeTab);
    return (
      <div>
        <Online>
          <SessionProvider>
            <div>
              <TabsComponent onTabChange={this.handleTabChange} />
              {this.state.activeTab === 'Rated' ? <RatedList /> : <MoviesList />}
            </div>
          </SessionProvider>
        </Online>
        <Offline>
          <div className="offline">
            <h1>"Oh no we lost connection!"</h1>
            <p>"Please check your internet connection and try again"</p>
          </div>
        </Offline>
      </div>
    );
  }
}

export default App;
