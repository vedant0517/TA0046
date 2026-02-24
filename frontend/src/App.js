import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AIAssistant from './pages/AIAssistant';
import AuthPage from './pages/AuthPage';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('careconnect_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        } else {
          // Invalid token — clear storage
          localStorage.removeItem('careconnect_token');
          localStorage.removeItem('careconnect_user');
        }
      } catch {
        // Server unavailable — try cached user data
        const cachedUser = localStorage.getItem('careconnect_user');
        if (cachedUser) {
          try { setUser(JSON.parse(cachedUser)); } catch { }
        }
      }
      setAuthLoading(false);
    };

    restoreSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    const roleToPage = { donor: 'donor', volunteer: 'volunteer', organization: 'organization' };
    setCurrentPage(roleToPage[userData.role] || 'home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('careconnect_token');
    localStorage.removeItem('careconnect_user');
    setCurrentPage('home');
  };

  // Guard: redirect to auth if not logged in or wrong role
  const handleSetCurrentPage = (page) => {
    if (page === 'donor') {
      if (!user) { setCurrentPage('auth'); return; }
      if (user.role !== 'donor') { alert('Please log in as a Donor to access the Donor Dashboard.'); setCurrentPage('auth'); return; }
    }
    if (page === 'volunteer') {
      if (!user) { setCurrentPage('auth'); return; }
      if (user.role !== 'volunteer') { alert('Please log in as a Volunteer to access the Volunteer Dashboard.'); setCurrentPage('auth'); return; }
    }
    if (page === 'organization') {
      if (!user) { setCurrentPage('auth'); return; }
      if (user.role !== 'organization') { alert('Please log in as an Organization to access the Organization Dashboard.'); setCurrentPage('auth'); return; }
    }
    setCurrentPage(page);
  };

  if (authLoading) {
    return (
      <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💚</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar setCurrentPage={handleSetCurrentPage} user={user} onLogout={handleLogout} />
      {currentPage === 'home' && <Home setCurrentPage={handleSetCurrentPage} />}
      {currentPage === 'auth' && <AuthPage onLogin={handleLogin} setCurrentPage={handleSetCurrentPage} />}
      {currentPage === 'donor' && <DonorDashboard user={user} />}
      {currentPage === 'volunteer' && <VolunteerDashboard user={user} />}
      {currentPage === 'organization' && <OrganizationDashboard user={user} />}
      {currentPage === 'ai-assistant' && <AIAssistant setCurrentPage={handleSetCurrentPage} />}
      <Footer />
    </div>
  );
}

export default App;
