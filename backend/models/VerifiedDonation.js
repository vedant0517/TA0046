// In-memory verified donation storage
class VerifiedDonation {
  static verifiedDonations = [];
  static counter = 1;

  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.verificationId = `VER-${String(VerifiedDonation.counter++).padStart(4, '0')}`;
    this.needyPersonId = data.needyPersonId;
    this.needyPersonName = data.needyPersonName;
    this.needyPersonArea = data.needyPersonArea || '';
    this.needyPersonCategory = data.needyPersonCategory || '';
    this.phoneNumber = data.phoneNumber || '';
    this.verifiedAt = data.verifiedAt || new Date();
    this.verifiedBy = data.verifiedBy || 'Volunteer';
    this.status = data.status || 'Delivered Successfully';
    this.donationType = data.donationType || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(data) {
    const verified = new VerifiedDonation(data);
    this.verifiedDonations.push(verified);
    return verified;
  }

  static async find(query = {}) {
    return [...this.verifiedDonations].sort((a, b) => b.verifiedAt - a.verifiedAt);
  }

  static async findById(id) {
    return this.verifiedDonations.find(v => v._id === id || v.verificationId === id);
  }

  static async countDocuments(query = {}) {
    return this.verifiedDonations.length;
  }

  async save() {
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = VerifiedDonation;
