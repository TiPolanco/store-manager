import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Auth from './components/Auth.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>This is the Navbar</div>
        <div className='content'>
          <Routes>
            <Route path='/' element={<Auth />} />
          </Routes>
        </div>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
