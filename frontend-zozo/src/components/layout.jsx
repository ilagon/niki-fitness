import React, { useState, useEffect, useRef } from 'react';
import './Layout.css';
import { Outlet, NavLink } from 'react-router';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="layout">
      <header>
        <button onClick={toggleDrawer} className="burger-button" style={{float: 'right'}}>
          {isOpen ? <span style={{color: 'black'}}>&#10006;</span> : '☰'}
        </button>
      </header>
      <aside ref={drawerRef} className={`drawer ${isOpen ? 'open' : ''}`}> 
        {/* Navigation items go here */}
        <nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/routines">Routines</NavLink></li>
            <li><NavLink to="/exercises">Exercises</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
