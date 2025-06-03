const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST /api/customers - create new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, visits, lastSeen, totalSpend } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create customer
    const customer = new Customer({ name, email, visits, lastSeen, totalSpend });
    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/customers - get all customers (optional, useful for frontend dropdown)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
