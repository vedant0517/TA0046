// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Donations
  donations: {
    getAll: `${API_BASE_URL}/donations`,
    getPending: `${API_BASE_URL}/donations/pending`,
    getById: (id) => `${API_BASE_URL}/donations/${id}`,
    create: `${API_BASE_URL}/donations`,
    updateStatus: (id) => `${API_BASE_URL}/donations/${id}/status`,
    accept: (id) => `${API_BASE_URL}/donations/${id}/accept`,
    decline: (id) => `${API_BASE_URL}/donations/${id}/decline`,
    updateLocation: (id) => `${API_BASE_URL}/donations/${id}/location`,
    pickup: (id) => `${API_BASE_URL}/donations/${id}/pickup`,
    transit: (id) => `${API_BASE_URL}/donations/${id}/transit`,
    deliver: (id) => `${API_BASE_URL}/donations/${id}/deliver`,
    clearAll: `${API_BASE_URL}/donations/all`
  },
  
  // Volunteers
  volunteers: {
    getNeedyPeople: `${API_BASE_URL}/volunteers`,
    getNeedyById: (id) => `${API_BASE_URL}/volunteers/${id}`,
    sendOTP: `${API_BASE_URL}/volunteers/send-otp`,
    verifyOTP: `${API_BASE_URL}/volunteers/verify-otp`,
    getVerified: `${API_BASE_URL}/volunteers/verified/all`
  },
  
  // Organizations
  organizations: {
    getProfile: `${API_BASE_URL}/organizations/profile`,
    getNeeds: `${API_BASE_URL}/organizations/needs`,
    createNeed: `${API_BASE_URL}/organizations/needs`,
    updateNeed: (id) => `${API_BASE_URL}/organizations/needs/${id}`,
    deleteNeed: (id) => `${API_BASE_URL}/organizations/needs/${id}`
  },
  
  // AI Assistant
  ai: {
    getNGOs: `${API_BASE_URL}/ai/ngos`,
    getHospitals: `${API_BASE_URL}/ai/hospitals`,
    getDisasters: `${API_BASE_URL}/ai/disasters`,
    getSchools: `${API_BASE_URL}/ai/schools`,
    query: `${API_BASE_URL}/ai/query`
  }
};

// API Helper Functions
export const api = {
  get: async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      return data.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },
  
  post: async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      return data.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },
  
  patch: async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      return data.data;
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },
  
  delete: async (url) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

export default API_ENDPOINTS;
