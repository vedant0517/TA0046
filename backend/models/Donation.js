// In-memory donation storage
class Donation {
  static donations = [];
  static counter = 1;

  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.donationId = `DON-${String(Donation.counter++).padStart(4, '0')}`;
    this.donorName = data.donorName || 'Anonymous Donor';
    this.donorId = data.donorId;
    this.category = data.category;
    this.item = data.item;
    this.quantity = data.quantity;
    this.status = data.status || 'Pending';
    this.pickupLocation = data.pickupLocation;
    this.pickupTime = data.pickupTime || '';
    this.expectedDelivery = data.expectedDelivery || 'TBD';
    this.assignedVolunteer = data.assignedVolunteer || '';
    this.volunteerId = data.volunteerId || '';
    this.volunteerPhone = data.volunteerPhone || '';
    this.volunteerVehicle = data.volunteerVehicle || '';
    this.requirement = data.requirement || 'N/A';
    this.volunteerResponse = data.volunteerResponse || '';
    this.bookDetails = data.bookDetails || null;
    this.addressDetails = data.addressDetails || null;
    this.coordinates = data.coordinates || null;
    this.createdDate = new Date();
    this.updatedAt = new Date();
    
    // Initialize tracking
    this.tracking = data.tracking || {
      currentLocation: data.pickupLocation,
      coordinates: data.coordinates || null,
      lastUpdate: new Date(),
      locationHistory: [{
        location: data.pickupLocation,
        timestamp: new Date(),
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

  // Static methods to mimic Mongoose API
  static async create(data) {
    const donation = new Donation(data);
    this.donations.push(donation);
    return donation;
  }

  static async find(query = {}) {
    let results = [...this.donations];
    
    if (query.status) {
      if (query.status.$in) {
        results = results.filter(d => query.status.$in.includes(d.status));
      } else {
        results = results.filter(d => d.status === query.status);
      }
    }
    
    return results.sort((a, b) => b.createdDate - a.createdDate);
  }

  static async findById(id) {
    return this.donations.find(d => d._id === id || d.donationId === id);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const donation = await this.findById(id);
    if (!donation) return null;
    
    Object.assign(donation, update);
    donation.updatedAt = new Date();
    
    if (options.new) return donation;
    return donation;
  }

  static async findByIdAndDelete(id) {
    const index = this.donations.findIndex(d => d._id === id || d.donationId === id);
    if (index === -1) return null;
    
    const deleted = this.donations[index];
    this.donations.splice(index, 1);
    return deleted;
  }

  static async countDocuments(query = {}) {
    return this.donations.length;
  }

  // Instance method to save
  async save() {
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = Donation;
