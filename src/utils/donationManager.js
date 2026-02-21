// Donation Manager - handles localStorage operations for donations

const DONATIONS_KEY = 'careconnect_donations';
const DONATION_COUNTER_KEY = 'careconnect_donation_counter';

// Initialize counter if not exists
const initializeCounter = () => {
  if (!localStorage.getItem(DONATION_COUNTER_KEY)) {
    localStorage.setItem(DONATION_COUNTER_KEY, '0');
  }
};

// Get next donation ID
const getNextDonationId = () => {
  initializeCounter();
  const current = parseInt(localStorage.getItem(DONATION_COUNTER_KEY)) || 0;
  const next = current + 1;
  localStorage.setItem(DONATION_COUNTER_KEY, next.toString());
  return `DON-${String(next).padStart(4, '0')}`;
};

// Get all donations
export const getAllDonations = () => {
  const donations = localStorage.getItem(DONATIONS_KEY);
  return donations ? JSON.parse(donations) : [];
};

// Add new donation
export const addDonation = (donationData) => {
  const donations = getAllDonations();
  const newDonation = {
    id: donations.length + 1,
    donationId: getNextDonationId(),
    donorName: 'Anonymous Donor',
    donorId: 'D-' + new Date().getTime(),
    category: donationData.category,
    item: donationData.itemType,
    quantity: donationData.quantity,
    status: 'Pending',
    pickupLocation: donationData.pickupLocation,
    pickupTime: donationData.pickupTime,
    expectedDelivery: 'TBD',
    assignedVolunteer: null,
    volunteerId: null,
    volunteerPhone: null,
    volunteerVehicle: null,
    requirement: 'N/A',
    createdDate: new Date().toISOString(),
    volunteerResponse: null,
    ...(donationData.bookDetails && { bookDetails: donationData.bookDetails }),
    tracking: {
      currentLocation: donationData.pickupLocation,
      coordinates: donationData.coordinates || null,
      lastUpdate: new Date().toISOString(),
      locationHistory: [{
        location: donationData.pickupLocation,
        timestamp: new Date().toISOString(),
        status: 'Donation Created',
        coordinates: donationData.coordinates || null,
        note: 'Donation request submitted successfully'
      }],
      estimatedDelivery: null,
      distanceCovered: '0 km',
      destinationAddress: null,
      statusProgress: {
        created: true,
        accepted: false,
        pickedUp: false,
        inTransit: false,
        delivered: false
      }
    }
  };
  
  donations.push(newDonation);
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  return newDonation;
};

// Get pending donations (for volunteers)
export const getPendingDonations = () => {
  const donations = getAllDonations();
  return donations.filter(d => d.status === 'Pending' || d.status === 'Accepted by Volunteer');
};

// Update donation status
export const updateDonationStatus = (donationId, newStatus, volunteerData = null) => {
  const donations = getAllDonations();
  const donation = donations.find(d => d.id === donationId);
  
  if (donation) {
    donation.status = newStatus;
    if (volunteerData) {
      donation.assignedVolunteer = volunteerData.name;
      donation.volunteerId = volunteerData.volunteerId;
      donation.volunteerResponse = volunteerData.response;
    }
    
    // Update tracking with status change
    if (donation.tracking) {
      donation.tracking.lastUpdate = new Date().toISOString();
      donation.tracking.locationHistory.push({
        location: donation.tracking.currentLocation,
        timestamp: new Date().toISOString(),
        status: newStatus,
        coordinates: donation.tracking.coordinates,
        note: volunteerData ? `${volunteerData.name} ${volunteerData.response} the donation` : `Status changed to ${newStatus}`
      });
      
      // Update progress indicators
      if (newStatus === 'Accepted by Volunteer') {
        donation.tracking.statusProgress.accepted = true;
      }
    }
    
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    return donation;
  }
  return null;
};

// Accept donation (volunteer action)
export const acceptDonation = (donationId, volunteerData) => {
  return updateDonationStatus(donationId, 'Accepted by Volunteer', {
    name: volunteerData.name,
    volunteerId: volunteerData.volunteerId,
    response: 'accepted'
  });
};

// Decline donation (volunteer action)
export const declineDonation = (donationId, volunteerData) => {
  return updateDonationStatus(donationId, 'Declined by Volunteer', {
    name: volunteerData.name,
    volunteerId: volunteerData.volunteerId,
    response: 'declined'
  });
};

// Get donations by donor (for donor dashboard)
export const getDonorDonations = () => {
  const donations = getAllDonations();
  return donations;
};

// Verified Donations Storage
const VERIFIED_DONATIONS_KEY = 'careconnect_verified_donations';

// Add a verified donation (called after OTP verification)
export const addVerifiedDonation = (verifiedData) => {
  const verifiedDonations = getVerifiedDonations();
  const newVerified = {
    id: verifiedDonations.length + 1,
    verificationId: `VER-${String(verifiedDonations.length + 1).padStart(4, '0')}`,
    needyPersonId: verifiedData.id,
    needyPersonName: verifiedData.name,
    needyPersonArea: verifiedData.area,
    needyPersonCategory: verifiedData.category,
    phoneNumber: verifiedData.phone,
    verifiedAt: verifiedData.verifiedAt,
    verifiedBy: 'Volunteer',
    status: 'Delivered Successfully',
    donationType: verifiedData.category || 'General',
    createdAt: new Date().toISOString()
  };
  
  verifiedDonations.push(newVerified);
  localStorage.setItem(VERIFIED_DONATIONS_KEY, JSON.stringify(verifiedDonations));
  return newVerified;
};

// Get all verified donations
export const getVerifiedDonations = () => {
  const verified = localStorage.getItem(VERIFIED_DONATIONS_KEY);
  return verified ? JSON.parse(verified) : [];
};
// Update donation tracking location
export const updateDonationLocation = (donationId, locationData) => {
  const donations = getAllDonations();
  const donation = donations.find(d => d.id === donationId);
  
  if (donation && donation.tracking) {
    donation.tracking.currentLocation = locationData.address;
    donation.tracking.coordinates = locationData.coordinates;
    donation.tracking.lastUpdate = new Date().toISOString();
    donation.tracking.distanceCovered = locationData.distanceCovered || donation.tracking.distanceCovered;
    donation.tracking.estimatedDelivery = locationData.estimatedDelivery || donation.tracking.estimatedDelivery;
    
    donation.tracking.locationHistory.push({
      location: locationData.address,
      timestamp: new Date().toISOString(),
      status: locationData.status || 'Moving',
      coordinates: locationData.coordinates,
      note: locationData.note || ''
    });
    
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    return donation;
  }
  return null;
};

// Volunteer picks up donation
export const pickupDonation = (donationId, volunteerData, pickupData) => {
  const donations = getAllDonations();
  const donation = donations.find(d => d.id === donationId);
  
  if (donation) {
    donation.status = 'Picked Up';
    donation.assignedVolunteer = volunteerData.name;
    donation.volunteerId = volunteerData.volunteerId;
    donation.volunteerPhone = volunteerData.phone;
    donation.volunteerVehicle = volunteerData.vehicle;
    donation.volunteerResponse = 'accepted';
    
    if (donation.tracking) {
      donation.tracking.currentLocation = pickupData.currentLocation;
      donation.tracking.coordinates = pickupData.coordinates;
      donation.tracking.lastUpdate = new Date().toISOString();
      donation.tracking.destinationAddress = pickupData.destinationAddress;
      donation.tracking.estimatedDelivery = pickupData.estimatedDelivery;
      
      // Update status progress
      donation.tracking.statusProgress.pickedUp = true;
      
      donation.tracking.locationHistory.push({
        location: pickupData.currentLocation,
        timestamp: new Date().toISOString(),
        status: 'Picked Up by Volunteer',
        coordinates: pickupData.coordinates,
        note: `Picked up by ${volunteerData.name}`
      });
    }
    
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    return donation;
  }
  return null;
};

// Mark donation as in transit
export const markInTransit = (donationId, locationData) => {
  const donations = getAllDonations();
  const donation = donations.find(d => d.id === donationId);
  
  if (donation) {
    donation.status = 'In Transit';
    
    // Update status progress
    if (donation.tracking) {
      donation.tracking.statusProgress.inTransit = true;
    }
    
    updateDonationLocation(donationId, {
      ...locationData,
      status: 'In Transit'
    });
    return donation;
  }
  return null;
};

// Mark donation as delivered
export const markDelivered = (donationId, deliveryData = {}) => {
  const donations = getAllDonations();
  const donation = donations.find(d => d.id === donationId);
  
  if (donation) {
    donation.status = 'Delivered';
    
    if (donation.tracking) {
      donation.tracking.statusProgress.delivered = true;
      donation.tracking.lastUpdate = new Date().toISOString();
      
      donation.tracking.locationHistory.push({
        location: deliveryData.location || donation.tracking.destinationAddress || 'Destination',
        timestamp: new Date().toISOString(),
        status: 'Delivered',
        coordinates: deliveryData.coordinates || donation.tracking.coordinates,
        note: deliveryData.note || 'Donation successfully delivered'
      });
    }
    
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    return donation;
  }
  return null;
};

// Clear all donations (for testing)
export const clearAllDonations = () => {
  localStorage.removeItem(DONATIONS_KEY);
  localStorage.removeItem(DONATION_COUNTER_KEY);
  localStorage.removeItem(VERIFIED_DONATIONS_KEY);
};
