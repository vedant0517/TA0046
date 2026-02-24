import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CareConnect</h3>
          <p>Bridging the gap between generosity and need through transparency and trust.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); alert('About Us page coming soon!'); }}>About Us</a></li>
            <li><a href="#causes" onClick={(e) => { e.preventDefault(); alert('Causes page coming soon!'); }}>Causes</a></li>
            <li><a href="#impact" onClick={(e) => { e.preventDefault(); alert('Impact page coming soon!'); }}>Impact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Get Involved</h4>
          <ul>
            <li><a href="#donor" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Become a Donor</a></li>
            <li><a href="#volunteer" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Volunteer</a></li>
            <li><a href="#organization" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Partner Organizations</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email: info@careconnect.org</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Charity Lane, Hope City</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 CareConnect. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy coming soon!'); }}>Privacy Policy</a>
          <span>|</span>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service coming soon!'); }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
