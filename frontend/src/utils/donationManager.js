// Donation Manager - Now using Backend API instead of localStorage
import { API_ENDPOINTS, api } from './apiConfig';

// Get all donations
export const getAllDonations = async () => {
  try {
    return await api.get(API_ENDPOINTS.donations.getAll);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

// Add new donation
export const addDonation = async (donationData) => {
  try {
    return await api.post(API_ENDPOINTS.donations.create, donationData);
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
};

// Get pending donations (for volunteers)
export const getPendingDonations = async () => {
  try {
    return await api.get(API_ENDPOINTS.donations.getPending);
  } catch (error) {
    console.error('Error fetching pending donations:', error);
    return [];
  }
};

// Update donation status
export const updateDonationStatus = async (donationId, newStatus, volunteerData = null) => {
  try {
    return await api.patch(API_ENDPOINTS.donations.updateStatus(donationId), {
      status: newStatus,
      volunteerData
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

// Accept donation (volunteer action)
export const acceptDonation = async (donationId, volunteerData) => {
  try {
    return await api.post(API_ENDPOINTS.donations.accept(donationId), { volunteerData });
  } catch (error) {
    console.error('Error accepting donation:', error);
    throw error;
  }
};

// Decline donation (volunteer action)
export const declineDonation = async (donationId, volunteerData) => {
  try {
    return await api.post(API_ENDPOINTS.donations.decline(donationId), { volunteerData });
  } catch (error) {
    console.error('Error declining donation:', error);
    throw error;
  }
};

// Get donations by donor (for donor dashboard)
export const getDonorDonations = async () => {
  try {
    return await api.get(API_ENDPOINTS.donations.getAll);
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    return [];
  }
};

// Get all verified donations
export const getVerifiedDonations = async () => {
  try {
    return await api.get(API_ENDPOINTS.volunteers.getVerified);
  } catch (error) {
    console.error('Error fetching verified donations:', error);
    return [];
  }
};

// Add a verified donation (called after OTP verification)
export const addVerifiedDonation = async (verifiedData) => {
  try {
    return await api.post(API_ENDPOINTS.volunteers.verifyOTP, {
      phoneNumber: verifiedData.phone,
      needyPersonId: verifiedData.id,
      otp: verifiedData.otp
    });
  } catch (error) {
    console.error('Error verifying donation:', error);
    throw error;
  }
};
// Update donation tracking location
export const updateDonationLocation = async (donationId, locationData) => {
  try {
    return await api.patch(API_ENDPOINTS.donations.updateLocation(donationId), locationData);
  } catch (error) {
    console.error('Error updating donation location:', error);
    throw error;
  }
};

// Volunteer picks up donation
export const pickupDonation = async (donationId, volunteerData, pickupData) => {
  try {
    return await api.post(API_ENDPOINTS.donations.pickup(donationId), {
      volunteerData,
      pickupData
    });
  } catch (error) {
    console.error('Error picking up donation:', error);
    throw error;
  }
};

// Mark donation as in transit
export const markInTransit = async (donationId, locationData) => {
  try {
    return await api.post(API_ENDPOINTS.donations.transit(donationId), { locationData });
  } catch (error) {
    console.error('Error marking donation in transit:', error);
    throw error;
  }
};

// Mark donation as delivered
export const markDelivered = async (donationId, deliveryData = {}) => {
  try {
    return await api.post(API_ENDPOINTS.donations.deliver(donationId), { deliveryData });
  } catch (error) {
    console.error('Error marking donation as delivered:', error);
    throw error;
  }
};

// Clear all donations (for testing)
export const clearAllDonations = async () => {
  try {
    return await api.delete(API_ENDPOINTS.donations.clearAll);
  } catch (error) {
    console.error('Error clearing donations:', error);
    throw error;
  }
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber, needyPersonId) => {
  try {
    const response = await fetch(API_ENDPOINTS.volunteers.sendOTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, needyPersonId })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to send OTP');
    }
    // Return the full response (not just data.data)
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (phoneNumber, needyPersonId, otp) => {
  try {
    const response = await fetch(API_ENDPOINTS.volunteers.verifyOTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, needyPersonId, otp })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to verify OTP');
    }
    // Return the full response data
    return data.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Get needy people
export const getNeedyPeople = async () => {
  try {
    return await api.get(API_ENDPOINTS.volunteers.getNeedyPeople);
  } catch (error) {
    console.error('Error fetching needy people:', error);
    return [];
  }
};
