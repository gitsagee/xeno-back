const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
  name: { type: String, required: true },  // could be same as segment name or custom
  audienceSize: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'sending', 'completed'], default: 'pending' },
  deliveryStats: {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
