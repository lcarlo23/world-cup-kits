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

app.use((req, res, next) => {
  console.log('incoming', req.method, req.originalUrl);
  console.log('Cookies header', req.headers.cookies);
  next();
});

app.use(
  cors({
    origin: process.env.HOST_URL,
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use('/', routes);

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
