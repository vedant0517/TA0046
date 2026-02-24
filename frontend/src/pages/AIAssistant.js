import React, { useState } from 'react';
import './AIAssistant.css';
import { CARE_CONNECT_DATA } from '../utils/aiConfig';

function AIAssistant({ setCurrentPage }) {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Use data from config
  const mockData = CARE_CONNECT_DATA;

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const filterByLocation = (items) => {
    if (!searchLocation.trim()) return items;
    return items.filter(item =>
      item.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      item.area?.toLowerCase().includes(searchLocation.toLowerCase())
    );
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const newMessage = { type: 'user', text: userQuestion };
    setChatMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response - In production, integrate with OpenAI API
    setTimeout(() => {
      const aiResponse = generateAIResponse(userQuestion);
      setChatMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
      setIsLoading(false);
      setUserQuestion('');
    }, 1500);
  };

  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    // Detect specific locations
    const locations = ['mumbai', 'delhi', 'bangalore', 'chennai', 'pune', 'hyderabad', 'kolkata', 'ahmedabad'];
    const mentionedLocation = locations.find(loc => lowerQuestion.includes(loc));

    // NGO-related queries
    if (lowerQuestion.includes('ngo') || lowerQuestion.includes('organization') || lowerQuestion.includes('charity')) {
      const filteredNgos = mentionedLocation
        ? mockData.ngos.filter(ngo => ngo.location.toLowerCase() === mentionedLocation)
        : mockData.ngos.slice(0, 2);

      if (filteredNgos.length === 0) {
        return `I couldn't find NGOs specifically in ${mentionedLocation}. Here are some nearby options:\n\n${mockData.ngos.slice(0, 2).map(ngo =>
          `• ${ngo.name} - ${ngo.location}\n  Area: ${ngo.area}\n  📞 ${ngo.contact} | ✉️ ${ngo.email}\n  📍 ${ngo.address}\n  Description: ${ngo.description}\n  👥 Volunteers: ${ngo.volunteers} | Beneficiaries: ${ngo.beneficiaries}\n  Services: ${ngo.services.join(', ')}\n  💰 ${ngo.fundingNeeds}`
        ).join('\n\n')}`;
      }

      return `${mentionedLocation ? `NGOs in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:` : 'Recommended NGOs:'}\n\n${filteredNgos.map(ngo =>
        `🏛️ ${ngo.name}\n  Specialization: ${ngo.area}\n  📞 Contact: ${ngo.contact} | ✉️ ${ngo.email}\n  📍 Address: ${ngo.address}\n  📅 Established: ${ngo.established} | Hours: ${ngo.workingHours}\n  Description: ${ngo.description}\n  \n  📊 Impact:\n  - Volunteers: ${ngo.volunteers}\n  - People Helped: ${ngo.beneficiaries}\n  \n  🎯 Services Offered:\n  ${ngo.services.map(s => `  • ${s}`).join('\n')}\n  \n  💰 Funding Needs: ${ngo.fundingNeeds}`
      ).join('\n\n─────────────────────────────\n\n')}\n\n✨ These organizations are actively working and accepting donations!`;
    }

    // Hospital and organ donation queries
    if (lowerQuestion.includes('hospital') || lowerQuestion.includes('organ') || lowerQuestion.includes('transplant') || lowerQuestion.includes('donation')) {
      const filteredHospitals = mentionedLocation
        ? mockData.hospitals.filter(h => h.location.toLowerCase() === mentionedLocation)
        : mockData.hospitals.slice(0, 2);

      if (filteredHospitals.length === 0) {
        return `No hospitals found in ${mentionedLocation}. Here are nearby options:\n\n${mockData.hospitals.slice(0, 2).map(h =>
          `🏥 ${h.name}\n  Location: ${h.location} | Specialty: ${h.specialty}\n  Organs: ${h.organs}\n  📞 ${h.phone}\n  Coordinator: ${h.organDonationCoordinator} (${h.coordinatorContact})`
        ).join('\n\n')}`;
      }

      return `${mentionedLocation ? `Hospitals in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:` : 'Recommended Hospitals for Organ Donation:'}\n\n${filteredHospitals.map(h =>
        `🏥 ${h.name}\n  Specialty: ${h.specialty} | 🚨 Emergency: ${h.emergency}\n  📞 Main: ${h.phone} | 📍 ${h.address}\n  📅 Established: ${h.established} | Beds: ${h.beds}\n  \n  💝 Organ Donation Information:\n  - Available Organs: ${h.organs}\n  - Coordinator: ${h.organDonationCoordinator}\n  - Contact: ${h.coordinatorContact}\n  - Success Rate: ${h.transplantSuccessRate}\n  - Processing Time: ${h.processingTime}\n  \n  📋 Current Waitlist:\n  ${Object.entries(h.organWaitlist).map(([organ, count]) => `  • ${organ.charAt(0).toUpperCase() + organ.slice(1)}: ${count} patients`).join('\n')}\n  \n  🏆 Facilities:\n  ${h.facilities.map(f => `  • ${f}`).join('\n')}\n  \n  ✅ Accreditation: ${h.accreditation}\n  👨‍⚕️ Doctors: ${h.doctorCount}+`
      ).join('\n\n─────────────────────────────\n\n')}\n\n📞 For urgent organ donation queries, contact the coordinator directly!`;
    }

    // Disaster and emergency queries
    if (lowerQuestion.includes('disaster') || lowerQuestion.includes('emergency') || lowerQuestion.includes('victim') || lowerQuestion.includes('relief') || lowerQuestion.includes('flood') || lowerQuestion.includes('cyclone')) {
      const filteredZones = mentionedLocation
        ? mockData.disasterZones.filter(d => d.location.toLowerCase() === mentionedLocation)
        : mockData.disasterZones.slice(0, 2);

      if (filteredZones.length === 0) {
        return `No active disaster zones in ${mentionedLocation} currently. Here are critical areas:\n\n${mockData.disasterZones.slice(0, 2).map(d =>
          `⚠️ ${d.area}\n  Risk: ${d.risk} | Severity: ${d.severity}\n  Victims: ${d.victims} | Relief: ${d.relief}`
        ).join('\n\n')}`;
      }

      return `${mentionedLocation ? `Disaster Zones in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:` : 'Critical Disaster-Prone Areas:'}\n\n${filteredZones.map(d =>
        `⚠️ ${d.area} - ${d.risk}\n  Severity: ${d.severity} Risk ⚡\n  Last Incident: ${d.lastIncident}\n  \n  📊 Current Status:\n  - Affected People: ${d.victims}\n  - Relief Status: ${d.relief}\n  - Evacuated: ${d.evacuated}\n  - Active Volunteers: ${d.volunteers}\n  - Medical Teams: ${d.medicalTeams}\n  \n  🏥 Relief Centers:\n  ${d.reliefCenters.map(rc => `  • ${rc}`).join('\n')}\n  \n  🤝 Partner NGOs:\n  ${d.ngoPartners.map(np => `  • ${np}`).join('\n')}\n  \n  📦 Supplies Status:\n  ${d.supplies}\n  \n  🆘 Emergency Contact:\n  - Coordinator: ${d.contactPerson}\n  - Emergency Phone: ${d.emergencyPhone}\n  - Shelter Capacity: ${d.shelterCapacity} people\n  \n  🎯 Immediate Needs: ${d.needs}`
      ).join('\n\n─────────────────────────────\n\n')}\n\n🚨 If you want to help, contact the coordinators or partner NGOs immediately!`;
    }

    // School and education queries
    if (lowerQuestion.includes('school') || lowerQuestion.includes('child') || lowerQuestion.includes('education') || lowerQuestion.includes('student')) {
      const filteredSchools = mentionedLocation
        ? mockData.schools.filter(s => s.location.toLowerCase() === mentionedLocation)
        : mockData.schools.slice(0, 2);

      if (filteredSchools.length === 0) {
        return `No schools found in ${mentionedLocation}. Here are schools that need support:\n\n${mockData.schools.slice(0, 2).map(s =>
          `🎓 ${s.name}\n  Location: ${s.location} | Students: ${s.students}\n  Needs: ${s.needs}\n  Contact: ${s.contact}`
        ).join('\n\n')}`;
      }

      return `${mentionedLocation ? `Schools in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} Needing Support:` : 'Schools Requiring Donations:'}\n\n${filteredSchools.map(s =>
        `🎓 ${s.name}\n  Type: ${s.type} | Students: ${s.students}\n  📞 Phone: ${s.phone} | ✉️ ${s.contact}\n  📍 Address: ${s.address}\n  📅 Established: ${s.established} | Teachers: ${s.teachers}\n  \n  📚 Subjects Taught:\n  ${s.subjects.join(', ')}\n  \n  🏢 Current Facilities:\n  ${s.facilities.map(f => `  • ${f}`).join('\n')}\n  \n  🎯 Urgent Needs:\n  ${s.needs}\n  \n  📦 Detailed Requirements:\n  • Books Needed: ${s.booksNeeded}\n  • Uniforms Needed: ${s.uniformsNeeded} students\n  • Scholarships Needed: ${s.scholarshipsNeeded} students\n  • Infrastructure: ${s.infrastructure}\n  \n  💰 Monthly Expense: ${s.monthlyExpense}\n  📈 Achievement Rate: ${s.achievementRate}\n  \n  ✨ Special Programs:\n  ${s.specialPrograms.map(sp => `  • ${sp}`).join('\n')}`
      ).join('\n\n─────────────────────────────\n\n')}\n\n💝 Your donation can transform these children's futures!`;
    }

    // Location-specific general query
    if (mentionedLocation) {
      const locationData = {
        ngos: mockData.ngos.filter(n => n.location.toLowerCase() === mentionedLocation),
        hospitals: mockData.hospitals.filter(h => h.location.toLowerCase() === mentionedLocation),
        disasters: mockData.disasterZones.filter(d => d.location.toLowerCase() === mentionedLocation),
        schools: mockData.schools.filter(s => s.location.toLowerCase() === mentionedLocation)
      };

      return `📍 CareConnect Resources in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:\n\n🏛️ NGOs: ${locationData.ngos.length} organizations\n${locationData.ngos.map(n => `  • ${n.name} - ${n.area}`).join('\n')}\n\n🏥 Hospitals: ${locationData.hospitals.length} facilities with organ donation\n${locationData.hospitals.map(h => `  • ${h.name} - ${h.specialty}`).join('\n')}\n\n⚠️ Disaster Zones: ${locationData.disasters.length} areas\n${locationData.disasters.map(d => `  • ${d.area} - ${d.risk} (${d.severity})`).join('\n')}\n\n🎓 Schools: ${locationData.schools.length} schools needing support\n${locationData.schools.map(s => `  • ${s.name} - ${s.students} students`).join('\n')}\n\n💡 Ask me specifically about any category for detailed information!\nExamples:\n- "Tell me about NGOs in ${mentionedLocation}"\n- "Which hospitals in ${mentionedLocation} accept organ donations?"\n- "What are the disaster zones in ${mentionedLocation}?"\n- "Which schools in ${mentionedLocation} need help?"`;
    }

    // General help response
    return `👋 Hello! I'm your CareConnect AI Assistant. I can provide detailed information about:\n\n🏛️ **NGOs & Organizations**\n- Find NGOs by location and specialization\n- Get contact details, services, and funding needs\n- Learn about volunteer opportunities\n\n🏥 **Hospitals & Organ Donation**\n- Locate organ donation centers\n- Check current waitlists and success rates\n- Get coordinator contact information\n- Find specialized medical facilities\n\n⚠️ **Disaster Relief & Emergency**\n- Identify disaster-prone areas\n- Check relief status and needs\n- Find emergency contacts and shelters\n- Learn how to help affected communities\n\n🎓 **Schools & Education Support**\n- Discover schools needing donations\n- See specific requirements (books, computers, etc.)\n- Learn about students and programs\n- Connect with education initiatives\n\n📍 **Available Locations:**\nMumbai, Delhi, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Ahmedabad\n\n💬 **Try asking:**\n- "Show me NGOs in Mumbai"\n- "Which hospitals in Delhi accept heart donations?"\n- "What are the disaster zones in Chennai?"\n- "Tell me about schools in Bangalore that need computers"\n- "I want to help with flood relief"\n- "Where can I donate organs in Pune?"\n\nWhat would you like to know?`;
  };

  return (
    <div className="ai-assistant">
      <div className="ai-hero">
        <div className="ai-hero-content">
          <h1 className="ai-hero-title">
            <span className="ai-icon">🤖</span>
            CareConnect AI Assistant
          </h1>
          <p className="ai-hero-subtitle">
            Your intelligent companion for finding NGOs, hospitals, disaster relief, and educational support
          </p>
        </div>
      </div>

      <div className="ai-container">
        {/* Location-Based Search Section */}
        <div className="search-section">
          <h2 className="section-title">
            <span className="icon">📍</span>
            Smart Location Search
          </h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <input
                type="text"
                className="search-input"
                placeholder="Enter your city or area (e.g., Mumbai, Delhi, Bangalore)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                className="category-select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="ngos">NGOs</option>
                <option value="hospitals">Hospitals & Organ Donation</option>
                <option value="disaster">Disaster Zones</option>
                <option value="schools">Schools for Children</option>
              </select>
            </div>
            <button type="submit" className="search-btn">
              <span>🔍</span> Search Resources
            </button>
          </form>
        </div>

        {/* Results Display */}
        {showResults && (
          <div className="results-section">
            {(searchCategory === 'all' || searchCategory === 'ngos') && (
              <div className="result-category">
                <h3 className="category-header">
                  <span className="category-icon">🏛️</span>
                  NGOs & Organizations
                </h3>
                <div className="cards-grid">
                  {filterByLocation(mockData.ngos).map((ngo, index) => (
                    <div key={index} className="info-card ngo-card">
                      <div className="card-header">
                        <h4>{ngo.name}</h4>
                        <span className="badge">{ngo.area}</span>
                      </div>
                      <div className="card-body">
                        <p className="card-description">{ngo.description}</p>
                        <p><strong>📍 Location:</strong> {ngo.location}</p>
                        <p><strong>📞 Contact:</strong> {ngo.contact}</p>
                        <p><strong>✉️ Email:</strong> {ngo.email}</p>
                        <p><strong>⏰ Hours:</strong> {ngo.workingHours}</p>
                        <p><strong>👥 Volunteers:</strong> {ngo.volunteers} | <strong>Beneficiaries:</strong> {ngo.beneficiaries}</p>
                        <p><strong>💰 Funding:</strong> {ngo.fundingNeeds}</p>
                      </div>
                      <button className="card-action-btn" onClick={() => setCurrentPage('donor')}>Donate Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(searchCategory === 'all' || searchCategory === 'hospitals') && (
              <div className="result-category">
                <h3 className="category-header">
                  <span className="category-icon">🏥</span>
                  Hospitals & Organ Donation Centers
                </h3>
                <div className="cards-grid">
                  {filterByLocation(mockData.hospitals).map((hospital, index) => (
                    <div key={index} className="info-card hospital-card">
                      <div className="card-header">
                        <h4>{hospital.name}</h4>
                        <span className="badge emergency">{hospital.emergency === 'Yes' ? '🚨 24/7' : ''}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>📍 Location:</strong> {hospital.location}</p>
                        <p><strong>📞 Phone:</strong> {hospital.phone}</p>
                        <p><strong>🩺 Specialty:</strong> {hospital.specialty}</p>
                        <p><strong>💝 Organs:</strong> {hospital.organs}</p>
                        <p><strong>🏆 Success Rate:</strong> {hospital.transplantSuccessRate}</p>
                        <p><strong>👨‍⚕️ Coordinator:</strong> {hospital.organDonationCoordinator}</p>
                        <p><strong>📞 Coordinator:</strong> {hospital.coordinatorContact}</p>
                        <p><strong>🏥 Beds:</strong> {hospital.beds} | <strong>Doctors:</strong> {hospital.doctorCount}</p>
                      </div>
                      <button className="card-action-btn" onClick={() => setCurrentPage('donor')}>Donate Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(searchCategory === 'all' || searchCategory === 'disaster') && (
              <div className="result-category">
                <h3 className="category-header">
                  <span className="category-icon">⚠️</span>
                  Disaster-Prone Areas & Relief Efforts
                </h3>
                <div className="cards-grid">
                  {filterByLocation(mockData.disasterZones).map((zone, index) => (
                    <div key={index} className={`info-card disaster-card severity-${zone.severity.toLowerCase()}`}>
                      <div className="card-header">
                        <h4>{zone.area}</h4>
                        <span className={`badge ${zone.severity.toLowerCase()}`}>{zone.severity} Risk</span>
                      </div>
                      <div className="card-body">
                        <p><strong>⚠️ Risk Type:</strong> {zone.risk}</p>
                        <p><strong>� Last Incident:</strong> {zone.lastIncident}</p>
                        <p><strong>👥 Affected:</strong> {zone.victims} | <strong>Evacuated:</strong> {zone.evacuated}</p>
                        <p><strong>🆘 Relief Status:</strong> {zone.relief}</p>
                        <p><strong>👷 Volunteers:</strong> {zone.volunteers} | <strong>Medical Teams:</strong> {zone.medicalTeams}</p>
                        <p><strong>🏥 Shelter Capacity:</strong> {zone.shelterCapacity}</p>
                        <p><strong>📦 Needs:</strong> {zone.needs}</p>
                        <p><strong>📞 Emergency:</strong> {zone.emergencyPhone}</p>
                      </div>
                      <button className="card-action-btn urgent" onClick={() => setCurrentPage('donor')}>Donate Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(searchCategory === 'all' || searchCategory === 'schools') && (
              <div className="result-category">
                <h3 className="category-header">
                  <span className="category-icon">🎓</span>
                  Schools Needing Support
                </h3>
                <div className="cards-grid">
                  {filterByLocation(mockData.schools).map((school, index) => (
                    <div key={index} className="info-card school-card">
                      <div className="card-header">
                        <h4>{school.name}</h4>
                        <span className="badge students">{school.students} Students</span>
                      </div>
                      <div className="card-body">
                        <p><strong>📍 Location:</strong> {school.location}</p>
                        <p><strong>🏫 Type:</strong> {school.type} | <strong>👨‍🏫 Teachers:</strong> {school.teachers}</p>
                        <p><strong>📞 Phone:</strong> {school.phone}</p>
                        <p><strong>✉️ Email:</strong> {school.contact}</p>
                        <p><strong>📦 Urgent Needs:</strong> {school.needs}</p>
                        <p><strong>📚 Books Needed:</strong> {school.booksNeeded}</p>
                        <p><strong>👕 Uniforms:</strong> {school.uniformsNeeded} students</p>
                        <p><strong>🎓 Scholarships:</strong> {school.scholarshipsNeeded} students</p>
                        <p><strong>💰 Monthly Expense:</strong> {school.monthlyExpense}</p>
                        <p><strong>📈 Achievement:</strong> {school.achievementRate}</p>
                      </div>
                      <button className="card-action-btn" onClick={() => setCurrentPage('donor')}>Donate Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Chat Assistant */}
        <div className="chat-section">
          <h2 className="section-title">
            <span className="icon">💬</span>
            Ask AI Assistant
          </h2>
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-welcome">
                  <div className="welcome-icon">🤖</div>
                  <h3>Hello! I'm your CareConnect AI Assistant</h3>
                  <p>Ask me anything about:</p>
                  <ul className="welcome-list">
                    <li>🏛️ NGOs and organizations in your area</li>
                    <li>🏥 Organ donation hospitals and medical facilities</li>
                    <li>⚠️ Disaster-prone areas and relief efforts</li>
                    <li>🎓 Schools needing donations for children</li>
                  </ul>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="chat-message ai">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleAskQuestion} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask me about NGOs, hospitals, disasters, or schools..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={isLoading}>
                <span>✈️</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="ai-quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-card" onClick={() => { setSearchCategory('ngos'); setShowResults(true); }}>
              <span className="action-icon">🏛️</span>
              <span>Find NGOs</span>
            </button>
            <button className="action-card" onClick={() => { setSearchCategory('hospitals'); setShowResults(true); }}>
              <span className="action-icon">🏥</span>
              <span>Organ Donation</span>
            </button>
            <button className="action-card" onClick={() => { setSearchCategory('disaster'); setShowResults(true); }}>
              <span className="action-icon">⚠️</span>
              <span>Disaster Alerts</span>
            </button>
            <button className="action-card" onClick={() => { setSearchCategory('schools'); setShowResults(true); }}>
              <span className="action-icon">🎓</span>
              <span>Help Schools</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
