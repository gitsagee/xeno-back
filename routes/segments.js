const express = require('express');
const router = express.Router();
const Segment = require('../models/Temp');
const { convertRuleToMongoQuery } = require('../utils/ruleConnverter');
const Customer=require('../models/Customer');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');


// POST /api/segments

router.post('/preview', async (req, res) => {
  try {
    const { rules } = req.body;

    if (!rules) return res.status(400).json({ error: 'Rules are required' });

    const mongoQuery = convertRuleToMongoQuery(rules);
    // console.log('Preview Mongo Query:', JSON.stringify(mongoQuery, null, 2));

    const audience = await Customer.find(mongoQuery);
    res.status(200).json({ audience });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Error generating audience preview' });
  }
});
router.post('/resend-pending', async (req, res) => {
  try {
    const pendingLogs = await CommunicationLog.find({ status: 'pending' }).populate('customerId');

    for (let log of pendingLogs) {
      const customer = log.customerId;
      const message = log.message;

      try {
        const response = await fetch('http://localhost:5000/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId: log.campaignId,
            customerId: customer._id,
            message,
          }),
        });

        const data = await response.json();

        await CommunicationLog.updateOne(
  { _id: log._id },
  {
    messageId: data.messageId,
    status: typeof data.status === 'string' ? data.status.toLowerCase() : 'sent'
  }
);

        console.log(`✅ Resent message to ${customer.name} ${data.status}`);
      } catch (err) {
        console.error(`❌ Failed to resend to ${customer.name}`, err);
      }
    }

    res.status(200).json({ message: 'Pending messages resent' });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Failed to resend pending messages' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, rules } = req.body;

    if (!name || !rules) {
      return res.status(400).json({ error: 'Segment name and rules are required' });
    }

    // Save the segment first
    const segment = new Segment({ name, rules });
    const savedSegment = await segment.save();

    // Reuse your existing function to generate the audience query
    const mongoQuery = convertRuleToMongoQuery(rules);

    // Get the audience (customers matching the rules)
    const audience = await Customer.find(mongoQuery);

    // Create campaign linked to segment
    const campaign = new Campaign({
      segmentId: savedSegment._id,
      name: `Campaign for ${name}`,
      audienceSize: audience.length,
      status: 'pending',
    });
    const savedCampaign = await campaign.save();

    // Optionally create communication logs for each audience member
    // (Prepare for message sending in next step)
    const logs = audience.map(customer => ({
      campaignId: savedCampaign._id,
      customerId: customer._id,
      status: 'pending',
      message: `Hi ${customer.name}, here’s 10% off on your next order!`,
    }));

    await CommunicationLog.insertMany(logs);
    // Send messages via internal /api/send-message for each customer
const sendMessage = async (customer, message) => {
  const response = await fetch('http://localhost:5000/api/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      campaignId: savedCampaign._id,
      customerId: customer._id,
      message,
    })
  });

  const data = await response.json();
  return {
    messageId: data.messageId,
    status: typeof data.status === 'string' ? data.status.toLowerCase() : 'sent'
  };
};

for (let customer of audience) {
  const message = `Hi ${customer.name}, here’s 10% off on your next order!`;
  try {
    const { messageId, status } = await sendMessage(customer, message);

    await CommunicationLog.updateOne(
      { campaignId: savedCampaign._id, customerId: customer._id },
      { messageId, status }
    );
  } catch (err) {
    console.error('❌ Failed to send message to:', customer.name, err);
  }
}



    res.status(201).json({
      segment: savedSegment,
      campaign: savedCampaign,
      audienceSize: audience.length,
    });
  } catch (error) {
    console.error('Error saving segment & creating campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
