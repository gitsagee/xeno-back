const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const segmentRoutes = require('./routes/segments');
const campaignRoutes = require('./routes/campaigns');
const deliveryReceipt = require('./routes/deliveryReceipt');
const sendMessage =require('./routes/sendMessage');
const passport = require('passport');
const router = express.Router();
const session = require('express-session');
const cors = require('cors');
require('./config/passport');
require('dotenv').config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: 'http://localhost:5173/segment', 
  }));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// Protected API example
app.get('/api/user', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});




// app.use('/api', ensureAuthenticated);







app.use(cors());
app.use(bodyParser.json());


app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api', sendMessage);
app.use('/api', deliveryReceipt);

mongoose.connect('mongodb+srv://utsavjhaa2003:chutiyapa@cluster4.qvro8jo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4/xeno_db')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
