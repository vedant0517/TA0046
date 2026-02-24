import React from 'react';
import './Navbar.css';

function Navbar({ setCurrentPage, user, onLogout }) {
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

          {/* Auth Section */}
          {user ? (
            <li className="navbar-item navbar-user-section">
              <div className="navbar-user-info">
                <span className="navbar-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="navbar-user-details">
                  <span className="navbar-user-name">{user.name}</span>
                  <span className={`navbar-role-badge navbar-role-${user.role}`}>
                    {user.role === 'donor' ? '💰' : '🤲'} {user.role}
                  </span>
                </div>
              </div>
              <button className="navbar-logout-btn" onClick={onLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="navbar-item">
              <a
                href="#auth"
                className="navbar-link auth-link"
                onClick={(e) => { e.preventDefault(); setCurrentPage('auth'); }}
              >
                Login / Sign Up
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
