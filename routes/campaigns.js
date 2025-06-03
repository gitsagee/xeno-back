const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');

router.get('/history', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }); // Most recent first

    const result = await Promise.all(campaigns.map(async (camp) => {
      const logs = await CommunicationLog.find({ campaignId: camp._id });

      const sentCount = logs.filter(l => l.status === 'sent').length;
      const failedCount = logs.filter(l => l.status === 'failed').length;
      const total = logs.length;

      return {
        id: camp._id,
        name: camp.name,
        createdAt: camp.createdAt,
        message: camp.message,
        audienceSize: total,
        sentCount,
        failedCount,
      };
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching campaign history:', err);
    res.status(500).json({ error: 'Failed to fetch campaign history' });
  }
});

module.exports = router;

