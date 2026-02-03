import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RoomList from './pages/Rooms/RoomList';
import RoomForm from './pages/Rooms/RoomForm';
import RoomDetails from './pages/Rooms/RoomDetails';
import IncentiveReport from './pages/Reports/IncentiveReport';

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
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
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
