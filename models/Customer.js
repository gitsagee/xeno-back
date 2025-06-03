const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 },
  lastSeen: { type: Date },
  totalSpend: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
