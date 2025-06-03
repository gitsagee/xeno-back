// deliveryReceipt.js

const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');

router.post('/delivery-receipt', async (req, res) => {
  const { campaignId, customerId, status } = req.body;

  if (!campaignId || !customerId || !status) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Find the communication log entry for this customer & campaign
    const logEntry = await CommunicationLog.findOne({
      campaignId,
      customerId,
    });

    if (!logEntry) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    // Update status
    logEntry.deliveryStatus = status;
    await logEntry.save();

    res.json({ message: 'Delivery status updated' });
  } catch (error) {
    console.error('Delivery receipt error:', error);
    res.status(500).json({ error: 'Server error updating delivery status' });
  }
});

module.exports = router;
