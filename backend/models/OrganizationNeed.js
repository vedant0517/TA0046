const mongoose = require('mongoose');

const organizationNeedSchema = new mongoose.Schema({
    reqId: { type: String, unique: true },
    organizationId: { type: String, required: true },
    organizationName: { type: String, required: true },
    category: { type: String, required: true },
    itemDescription: { type: String, required: true },
    quantityNeeded: { type: String, required: true },
    fulfilledQuantity: { type: String, default: '0 units' },
    urgencyLevel: { type: String, default: 'Medium' },
    location: { type: String, required: true },
    status: { type: String, default: 'Active' },
    beneficiaryType: { type: String, required: true },
    estimatedDuration: { type: String, required: true }
}, { timestamps: true });

// Auto-generate reqId before saving
organizationNeedSchema.pre('save', async function () {
    if (!this.reqId) {
        const count = await mongoose.model('OrganizationNeed').countDocuments();
        this.reqId = `REQ-${String(count + 1).padStart(3, '0')}`;
    }
});

const OrganizationNeed = mongoose.model('OrganizationNeed', organizationNeedSchema);

module.exports = OrganizationNeed;
