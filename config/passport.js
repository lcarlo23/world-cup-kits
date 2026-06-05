import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { getDb } from '../db/connect.js';

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const db = getDb();

        let user = await db
          .collection('users')
          .findOne({ providerId: profile.id });

        if (!user) {
          const newUser = {
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || 'No public email',
            role: 'customer',
            provider: 'github',
            providerId: profile.id,
          };

          const response = await db.collection('users').insertOne(newUser);
          user = { _id: response.insertedId, ...newUser };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
