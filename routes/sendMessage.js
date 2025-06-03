// vendorApi.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simulate message delivery with ~90% success rate
router.post('/send-message', async (req, res) => {
  const { campaignId, customerId, message } = req.body;

  // Simple success/fail simulation
  const isSuccess = Math.random() < 0.9;

  
    

setTimeout(() => {
  const deliveryStatus = isSuccess ? 'SENT' : 'FAILED';

  axios.post('http://localhost:5000/api/delivery-receipt', {
    campaignId,
    customerId,
    status: deliveryStatus,
  })
  .then(() => {
    res.json({ success: isSuccess, status: deliveryStatus });
  })
  .catch((error) => {
    console.error('Error notifying delivery receipt:', error);
    res.status(500).json({ error: 'Delivery receipt update failed' });
  });
}, 500);

});

module.exports = router;
