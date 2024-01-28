import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Login.js';
import NavBar from './components/NavBar.js';
import StoreDetail from './components/StoreDetail.js';
import StoreList from './components/StoreList.js';
import UserList from './components/UserList.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<StoreList />} />
            <Route path='/login' element={<Login />} />
            <Route path='/store/:storeID' element={<StoreDetail />} />
            <Route path='/users' element={<UserList />} />
          </Routes>
        </div>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
