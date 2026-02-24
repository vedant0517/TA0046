const mongoose = require('mongoose');

const needyPersonSchema = new mongoose.Schema({
  needyId: { type: String, unique: true },
  name: { type: String, required: true },
  area: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: String, default: '' }
}, { timestamps: true });

const NeedyPerson = mongoose.model('NeedyPerson', needyPersonSchema);

module.exports = NeedyPerson;
