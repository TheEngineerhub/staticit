import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar';
import Router from './Router';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
