import React from 'react';
import './Navbar.css';

function Navbar({ setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setCurrentPage('home')}>
          <h1>CareConnect</h1>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="#donor" className="navbar-link" onClick={(e) => { e.preventDefault(); setCurrentPage('donor'); }}>Donor</a>
          </li>
          <li className="navbar-item">
            <a href="#volunteer" className="navbar-link" onClick={(e) => { e.preventDefault(); setCurrentPage('volunteer'); }}>Volunteer</a>
          </li>
          <li className="navbar-item">
            <a href="#organization" className="navbar-link" onClick={(e) => { e.preventDefault(); setCurrentPage('organization'); }}>Organization</a>
          </li>
          <li className="navbar-item">
            <a href="#ai-assistant" className="navbar-link ai-link" onClick={(e) => { e.preventDefault(); setCurrentPage('ai-assistant'); }}>
              🤖 AI Assistant
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
