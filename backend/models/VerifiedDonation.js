// In-memory database for verified donations
let verifiedDonations = [];
let verificationCounter = 0;

class VerifiedDonation {
  constructor(data) {
    this.id = ++verificationCounter;
    this.verificationId = `VER-${String(verificationCounter).padStart(4, '0')}`;
    this.needyPersonId = data.needyPersonId || data.id;
    this.needyPersonName = data.needyPersonName || data.name;
    this.needyPersonArea = data.needyPersonArea || data.area;
    this.needyPersonCategory = data.needyPersonCategory || data.category;
    this.phoneNumber = data.phoneNumber || data.phone;
    this.verifiedAt = data.verifiedAt || new Date().toISOString();
    this.verifiedBy = data.verifiedBy || 'Volunteer';
    this.status = 'Delivered Successfully';
    this.donationType = data.donationType || data.category || 'General';
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return verifiedDonations;
  }

  static findById(id) {
    return verifiedDonations.find(v => v.id === parseInt(id));
  }

  static create(data) {
    const verified = new VerifiedDonation(data);
    verifiedDonations.push(verified);
    return verified;
  }

  static deleteAll() {
    verifiedDonations = [];
    verificationCounter = 0;
  }
}

module.exports = VerifiedDonation;
