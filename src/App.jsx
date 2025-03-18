import './App.css';
import MoviesList from './components/MoviesList/MoviesList.jsx';
import { Online, Offline } from 'react-detect-offline';

function App() {
  return (
    <div>
      <Online>
        <div>
          <MoviesList />
        </div>
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
