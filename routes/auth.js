const express = require('express');
const passport = require('passport');

const router = express.Router();

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL from Google
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: 'http://localhost:5173/segments' // React route
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/'); // or redirect to login
  });
});

module.exports = router;
