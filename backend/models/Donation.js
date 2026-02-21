// In-memory database for donations (replace with MongoDB in production)
let donations = [];
let donationCounter = 0;

class Donation {
  constructor(data) {
    this.id = ++donationCounter;
    this.donationId = `DON-${String(donationCounter).padStart(4, '0')}`;
    this.donorName = data.donorName || 'Anonymous Donor';
    this.donorId = data.donorId || 'D-' + Date.now();
    this.category = data.category;
    this.item = data.itemType;
    this.quantity = data.quantity;
    this.status = 'Pending';
    this.pickupLocation = data.pickupLocation;
    this.pickupTime = data.pickupTime;
    this.expectedDelivery = 'TBD';
    this.assignedVolunteer = null;
    this.volunteerId = null;
    this.volunteerPhone = null;
    this.volunteerVehicle = null;
    this.requirement = 'N/A';
    this.createdDate = new Date().toISOString();
    this.volunteerResponse = null;
    this.bookDetails = data.bookDetails || null;
    this.tracking = {
      currentLocation: data.pickupLocation,
      coordinates: data.coordinates || null,
      lastUpdate: new Date().toISOString(),
      locationHistory: [{
        location: data.pickupLocation,
        timestamp: new Date().toISOString(),
        status: 'Donation Created',
        coordinates: data.coordinates || null,
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
    };
  }

  static getAll() {
    return donations;
  }

  static findById(id) {
    return donations.find(d => d.id === parseInt(id));
  }

  static findByDonationId(donationId) {
    return donations.find(d => d.donationId === donationId);
  }

  static getPending() {
    return donations.filter(d => d.status === 'Pending' || d.status === 'Accepted by Volunteer');
  }

  static create(data) {
    const donation = new Donation(data);
    donations.push(donation);
    return donation;
  }

  static update(id, updates) {
    const donation = Donation.findById(id);
    if (donation) {
      Object.assign(donation, updates);
      if (updates.tracking) {
        donation.tracking.lastUpdate = new Date().toISOString();
      }
      return donation;
    }
    return null;
  }

  static updateStatus(id, status, volunteerData = null) {
    const donation = Donation.findById(id);
    if (donation) {
      donation.status = status;
      if (volunteerData) {
        donation.assignedVolunteer = volunteerData.name;
        donation.volunteerId = volunteerData.volunteerId;
        donation.volunteerResponse = volunteerData.response;
      }
      
      // Update tracking
      if (donation.tracking) {
        donation.tracking.lastUpdate = new Date().toISOString();
        donation.tracking.locationHistory.push({
          location: donation.tracking.currentLocation,
          timestamp: new Date().toISOString(),
          status: status,
          coordinates: donation.tracking.coordinates,
          note: volunteerData ? `${volunteerData.name} ${volunteerData.response} the donation` : `Status changed to ${status}`
        });
        
        // Update progress
        if (status === 'Accepted by Volunteer') {
          donation.tracking.statusProgress.accepted = true;
        } else if (status === 'Picked Up') {
          donation.tracking.statusProgress.pickedUp = true;
        } else if (status === 'In Transit') {
          donation.tracking.statusProgress.inTransit = true;
        } else if (status === 'Delivered') {
          donation.tracking.statusProgress.delivered = true;
        }
      }
      return donation;
    }
    return null;
  }

  static updateLocation(id, locationData) {
    const donation = Donation.findById(id);
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
      return donation;
    }
    return null;
  }

  static deleteAll() {
    donations = [];
    donationCounter = 0;
  }
}

module.exports = Donation;
