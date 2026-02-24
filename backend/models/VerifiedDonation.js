const mongoose = require('mongoose');

const verifiedDonationSchema = new mongoose.Schema({
  verificationId: { type: String, unique: true },
  needyPersonId: { type: String },
  needyPersonName: { type: String },
  needyPersonArea: { type: String, default: '' },
  needyPersonCategory: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  verifiedAt: { type: Date, default: Date.now },
  verifiedBy: { type: String, default: 'Volunteer' },
  status: { type: String, default: 'Delivered Successfully' },
  donationType: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate verificationId before saving
verifiedDonationSchema.pre('save', async function () {
  if (!this.verificationId) {
    const count = await mongoose.model('VerifiedDonation').countDocuments();
    this.verificationId = `VER-${String(count + 1).padStart(4, '0')}`;
  }
});

const VerifiedDonation = mongoose.model('VerifiedDonation', verifiedDonationSchema);

module.exports = VerifiedDonation;
