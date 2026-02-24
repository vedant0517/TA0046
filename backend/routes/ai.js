const express = require('express');
const router = express.Router();

// Complete CareConnect data from frontend
const CARE_CONNECT_DATA = require('../data/careConnectData');

// Get all NGOs
router.get('/ngos', (req, res) => {
  try {
    const { location, area } = req.query;
    let ngos = CARE_CONNECT_DATA.ngos;

    if (location) {
      ngos = ngos.filter(ngo =>
        ngo.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (area) {
      ngos = ngos.filter(ngo =>
        ngo.area.toLowerCase().includes(area.toLowerCase())
      );
    }

    res.json({ success: true, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all hospitals
router.get('/hospitals', (req, res) => {
  try {
    const { location, specialty } = req.query;
    let hospitals = CARE_CONNECT_DATA.hospitals;

    if (location) {
      hospitals = hospitals.filter(hospital =>
        hospital.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (specialty) {
      hospitals = hospitals.filter(hospital =>
        hospital.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all disaster zones
router.get('/disasters', (req, res) => {
  try {
    const { location, severity } = req.query;
    let disasters = CARE_CONNECT_DATA.disasterZones;

    if (location) {
      disasters = disasters.filter(disaster =>
        disaster.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (severity) {
      disasters = disasters.filter(disaster =>
        disaster.severity.toLowerCase() === severity.toLowerCase()
      );
    }

    res.json({ success: true, data: disasters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all schools
router.get('/schools', (req, res) => {
  try {
    const { location, type } = req.query;
    let schools = CARE_CONNECT_DATA.schools;

    if (location) {
      schools = schools.filter(school =>
        school.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      schools = schools.filter(school =>
        school.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    res.json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI Query endpoint
router.post('/query', (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const response = generateAIResponse(question.toLowerCase());

    res.json({
      success: true,
      data: {
        question,
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI Response Generator
function generateAIResponse(lowerQuestion) {
  const locations = ['mumbai', 'delhi', 'bangalore', 'chennai', 'pune', 'hyderabad', 'kolkata', 'ahmedabad'];
  const mentionedLocation = locations.find(loc => lowerQuestion.includes(loc));

  // NGO-related queries
  if (lowerQuestion.includes('ngo') || lowerQuestion.includes('organization') || lowerQuestion.includes('charity')) {
    const filteredNgos = mentionedLocation
      ? CARE_CONNECT_DATA.ngos.filter(ngo => ngo.location.toLowerCase() === mentionedLocation)
      : CARE_CONNECT_DATA.ngos.slice(0, 2);

    if (filteredNgos.length === 0) {
      return `I couldn't find NGOs specifically in ${mentionedLocation}. Here are some nearby options:\n\n${CARE_CONNECT_DATA.ngos.slice(0, 2).map(ngo =>
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
      ? CARE_CONNECT_DATA.hospitals.filter(h => h.location.toLowerCase() === mentionedLocation)
      : CARE_CONNECT_DATA.hospitals.slice(0, 2);

    if (filteredHospitals.length === 0) {
      return `No hospitals found in ${mentionedLocation}. Here are nearby options:\n\n${CARE_CONNECT_DATA.hospitals.slice(0, 2).map(h =>
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
      ? CARE_CONNECT_DATA.disasterZones.filter(d => d.location.toLowerCase() === mentionedLocation)
      : CARE_CONNECT_DATA.disasterZones.slice(0, 2);

    if (filteredZones.length === 0) {
      return `No active disaster zones in ${mentionedLocation} currently. Here are critical areas:\n\n${CARE_CONNECT_DATA.disasterZones.slice(0, 2).map(d =>
        `⚠️ ${d.area}\n  Risk: ${d.risk} | Severity: ${d.severity}\n  Victims: ${d.victims} | Relief: ${d.relief}`
      ).join('\n\n')}`;
    }

    return `${mentionedLocation ? `Disaster Zones in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:` : 'Critical Disaster-Prone Areas:'}\n\n${filteredZones.map(d =>
      `⚠️ ${d.area} - ${d.risk}\n  Severity: ${d.severity} Risk ⚡\n  Last Incident: ${d.lastIncident}\n  \n  📊 Current Status:\n  - Affected People: ${d.victims}\n  - Relief Status: ${d.relief}\n  - Evacuated: ${d.evacuated}\n  - Active Volunteers: ${d.volunteers}\n  - Medical Teams: ${d.medicalTeams}\n  \n  🏥 Relief Centers:\n  ${d.reliefCenters.map(rc => `  • ${rc}`).join('\n')}\n  \n  🤝 Partner NGOs:\n  ${d.ngoPartners.map(np => `  • ${np}`).join('\n')}\n  \n  📦 Supplies Status:\n  ${d.supplies}\n  \n  🆘 Emergency Contact:\n  - Coordinator: ${d.contactPerson}\n  - Emergency Phone: ${d.emergencyPhone}\n  - Shelter Capacity: ${d.shelterCapacity} people\n  \n  🎯 Immediate Needs: ${d.needs}`
    ).join('\n\n─────────────────────────────\n\n')}\n\n🚨 Contact emergency numbers immediately if you need assistance!`;
  }

  // School and education queries
  if (lowerQuestion.includes('school') || lowerQuestion.includes('education') || lowerQuestion.includes('student') || lowerQuestion.includes('children')) {
    const filteredSchools = mentionedLocation
      ? CARE_CONNECT_DATA.schools.filter(s => s.location.toLowerCase() === mentionedLocation)
      : CARE_CONNECT_DATA.schools.slice(0, 2);

    if (filteredSchools.length === 0) {
      return `No schools found in ${mentionedLocation}. Here are some schools that need support:\n\n${CARE_CONNECT_DATA.schools.slice(0, 2).map(s =>
        `🏫 ${s.name}\n  Location: ${s.location} | Students: ${s.students}\n  Needs: ${s.needs}\n  📞 ${s.phone}`
      ).join('\n\n')}`;
    }

    return `${mentionedLocation ? `Schools in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} that need your support:` : 'Schools Needing Support:'}\n\n${filteredSchools.map(s =>
      `🏫 ${s.name}\n  Type: ${s.type} | 📞 ${s.phone}\n  📍 ${s.address}\n  📅 Established: ${s.established}\n  \n  📊 School Details:\n  - Students: ${s.students} | Teachers: ${s.teachers}\n  - Achievement Rate: ${s.achievementRate}\n  - Monthly Budget: ${s.monthlyExpense}\n  \n  📚 Subjects: ${s.subjects.join(', ')}\n  \n  🏗️ Facilities:\n  ${s.facilities.map(f => `  • ${f}`).join('\n')}\n  \n  🎯 Urgent Needs:\n  - Scholarships for ${s.scholarshipsNeeded} students\n  - Uniforms for ${s.uniformsNeeded} students\n  - Books: ${s.booksNeeded}\n  - Infrastructure: ${s.infrastructure}\n  \n  ✨ Special Programs:\n  ${s.specialPrograms.map(p => `  • ${p}`).join('\n')}\n  \n  📧 Contact: ${s.contact}`
    ).join('\n\n─────────────────────────────\n\n')}\n\n💝 Your donations can make a real difference in these children's lives!`;
  }

  // General query
  return `Hello! I'm here to help you with:\n\n🏛️ Finding NGOs in your area\n🏥 Locating hospitals for organ donation\n🚨 Disaster relief information\n🏫 Schools that need support\n\nPlease specify your location or what type of information you're looking for. For example:\n- "NGOs in Mumbai for child welfare"\n- "Hospitals in Delhi for organ donation"\n- "Disaster zones in Bangalore"\n- "Schools in Chennai that need books"\n\nHow can I assist you today?`;
}

module.exports = router;
