require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
  clientSecret: process.env.YOUR_GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user in DB
  // Example: User.findOrCreate({ googleId: profile.id }, ...)
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
