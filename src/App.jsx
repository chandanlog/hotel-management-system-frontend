import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RoomList from './pages/Rooms/RoomList';
import RoomForm from './pages/Rooms/RoomForm';
import RoomDetails from './pages/Rooms/RoomDetails';
import IncentiveReport from './pages/Reports/IncentiveReport';

import { LuSun, LuMoon } from 'react-icons/lu';

const ThemeContext = createContext();

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          LuxStay
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Rooms</Link>
          <Link to="/rooms/create" className={isActive('/rooms/create')}>Add Room</Link>
          <Link to="/reports" className={isActive('/reports')}>Reports</Link>
        </div>

        <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} className="theme-toggle-btn">
            {theme === 'dark' ? <LuSun size={20} /> : <LuMoon size={20} />}
        </button>
      </div>
    </nav>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<RoomList />} />
              <Route path="/rooms/create" element={<RoomForm />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/reports" element={<IncentiveReport />} />
            </Routes>
          </div>
        </div>
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
