import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to CareConnect</h1>
          <p className="hero-subtitle">
            Bridging the Gap Between Generosity and Need
          </p>
          <p className="hero-description">
            A centralized and transparent platform connecting donors, volunteers, and genuine beneficiaries to make help accessible and impactful
          </p>
          <button className="cta-button">Explore Opportunities</button>
        </div>
      </section>

      <section className="impact-image-section">
        <div className="impact-image-container">
          <img 
            src="/images/children-smiling.png" 
            alt="Happy children benefiting from community support" 
            className="impact-image"
          />
          <div className="impact-overlay">
            <h2>Making a Real Difference</h2>
            <p>Together, we bring smiles and hope to those who need it most</p>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="problem-content">
          <h2 className="section-title">The Challenge We Address</h2>
          <p className="problem-text">
            Many donors and social groups are willing to help people in need, but the absence of 
            a centralized and transparent platform makes it difficult to connect them with genuine 
            beneficiaries. This leads to poor coordination, lack of trust, and inefficient distribution 
            of donations.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How CareConnect Works</h2>
        <div className="features-content">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🙋</div>
              <h3>Coordinate Volunteers</h3>
              <p>Organize and manage volunteers willing to contribute their time and skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Impact</h3>
              <p>Monitor and report the distribution and impact of every donation made</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Social Groups Network</h3>
              <p>Connect with NGOs, charities, and community organizations for greater reach</p>
            </div>
          </div>
        </div>
      </section>

      <section className="roles-section">
        <h2 className="section-title">Who Can Participate?</h2>
        <div className="roles-grid">
          <div className="role-card">
            <h3>💰 Donors</h3>
            <p>Individuals or organizations wanting to make a difference through financial contributions or resources</p>
          </div>
          <div className="role-card">
            <h3>🤲 Volunteers</h3>
            <p>People willing to offer their time, skills, and effort to help those in need</p>
          </div>
          <div className="role-card">
            <h3>🏢 Social Groups</h3>
            <p>NGOs, charities, and community organizations working to serve underprivileged communities</p>
          </div>
          <div className="role-card">
            <h3>👥 Beneficiaries</h3>
            <p>Individuals or families in genuine need of support and assistance</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2 className="info-section-title">Why Choose CareConnect?</h2>
        <div className="info-content">
          <div className="info-text">
            <ul className="info-list">
              <li>✓ Centralized platform for all charitable activities</li>
              <li>✓ Complete transparency in donation tracking</li>
              <li>✓ Verified beneficiaries to ensure genuine help</li>
              <li>✓ Efficient coordination between all stakeholders</li>
              <li>✓ Real-time impact reporting and analytics</li>
              <li>✓ Build trust through transparent operations</li>
              <li>✓ Reduce wastage and improve resource distribution</li>
            </ul>
          </div>
          <div className="info-image-container">
            <img 
              src="/images/why-choose.png" 
              alt="CareConnect benefits" 
              className="info-image"
            />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of donors, volunteers, and social groups making real impact</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Browse Causes</button>
            <button className="cta-btn secondary">See Success Stories</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
