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
    requirement: 'N/A',
    createdDate: new Date().toISOString(),
    volunteerResponse: null
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

// Clear all donations (for testing)
export const clearAllDonations = () => {
  localStorage.removeItem(DONATIONS_KEY);
  localStorage.removeItem(DONATION_COUNTER_KEY);
  localStorage.removeItem(VERIFIED_DONATIONS_KEY);
};
