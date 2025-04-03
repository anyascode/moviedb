import { Tabs } from 'antd';
import { useState } from 'react';
import { Offline, Online } from 'react-detect-offline';
import './App.css';
import MoviesList from './components/MoviesList/MoviesList.jsx';
import RatedList from './components/RatedList/RatedList.jsx';
import { TheMovieDBProvider } from './context/themoviedb.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('Search');
  return (
    <div>
      <Online>
        <TheMovieDBProvider>
          <div>
            <Tabs
              defaultActiveKey="1"
              items={[
                { key: '1', label: 'Search' },
                { key: '2', label: 'Rated' },
              ]}
              onChange={(key) => setActiveTab(key === '1' ? 'Search' : 'Rated')}
              centered
              destroyInactiveTabPane={false}
            />
            {activeTab === 'Rated' ? <RatedList /> : <MoviesList />}
          </div>
        </TheMovieDBProvider>
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

export default App;
