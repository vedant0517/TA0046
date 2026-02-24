const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: { type: String, unique: true },
  donorName: { type: String, default: 'Anonymous Donor' },
  donorId: { type: String },
  category: { type: String },
  item: { type: String },
  quantity: { type: String },
  status: { type: String, default: 'Pending' },
  pickupLocation: { type: String },
  pickupTime: { type: String, default: '' },
  expectedDelivery: { type: String, default: 'TBD' },
  assignedVolunteer: { type: String, default: '' },
  volunteerId: { type: String, default: '' },
  volunteerPhone: { type: String, default: '' },
  volunteerVehicle: { type: String, default: '' },
  requirement: { type: String, default: 'N/A' },
  volunteerResponse: { type: String, default: '' },
  bookDetails: { type: mongoose.Schema.Types.Mixed, default: null },
  addressDetails: { type: mongoose.Schema.Types.Mixed, default: null },
  coordinates: { type: mongoose.Schema.Types.Mixed, default: null },
  createdDate: { type: Date, default: Date.now },
  tracking: {
    currentLocation: { type: String },
    coordinates: { type: mongoose.Schema.Types.Mixed, default: null },
    lastUpdate: { type: Date, default: Date.now },
    locationHistory: [{
      location: String,
      timestamp: { type: Date, default: Date.now },
      status: String,
      coordinates: { type: mongoose.Schema.Types.Mixed, default: null },
      note: { type: String, default: '' }
    }],
    estimatedDelivery: { type: String, default: null },
    distanceCovered: { type: String, default: '0 km' },
    destinationAddress: { type: String, default: null },
    statusProgress: {
      created: { type: Boolean, default: true },
      accepted: { type: Boolean, default: false },
      pickedUp: { type: Boolean, default: false },
      inTransit: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

// Auto-generate donationId before saving
donationSchema.pre('save', async function () {
  if (!this.donationId) {
    const count = await mongoose.model('Donation').countDocuments();
    this.donationId = `DON-${String(count + 1).padStart(4, '0')}`;
  }
});

// Override findById to also search by donationId
const originalFindById = mongoose.Model.findById;
donationSchema.statics.findById = async function (id) {
  // Try by _id first, then by donationId
  let doc = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    doc = await this.findOne({ _id: id });
  }
  if (!doc) {
    doc = await this.findOne({ donationId: id });
  }
  return doc;
};

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
