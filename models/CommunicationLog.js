const mongoose = require('mongoose');
const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  message: { type: String, required: true },
  sentAt: { type: Date },
  deliveryReceipt: { type: Object }, // later store delivery API response
}, { timestamps: true });

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
