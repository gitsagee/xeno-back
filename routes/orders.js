const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// POST /api/orders - create new order
router.post('/', async (req, res) => {
  try {
    const { customerId, amount, timestamp } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({ error: 'customerId and amount are required' });
    }

    // Check if customer exists
    const customerExists = await Customer.findById(customerId);
    if (!customerExists) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create order
    const order = new Order({ customerId, amount, timestamp });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders - get all orders (optional)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
