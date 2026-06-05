import express from 'express';
import { initDb } from './db/connect.js';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import './config/passport.js';

const app = express();
const port = process.env.PORT || 8080;

app
  .use(bodyParser.json())
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }),
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }))
  .use('/', routes);

async function start() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Server connected to DB and listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
  }
}

start();
