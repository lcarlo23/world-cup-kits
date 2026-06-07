import express from 'express';
import productsRoute from './products.js';
import usersRoute from './users.js';
import ordersRoute from './orders.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' with { type: 'json' };
import passport from 'passport';

const router = express.Router();

const swaggerOptions = {
  customCss: '.auth-wrapper { display: none !important; }',
};

router.use('/products', productsRoute);
router.use('/users', usersRoute);
router.use('/users', ordersRoute);
router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

router.get(
  '/login',
  passport.authenticate('github', () => {}),
);
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.name}`
      : 'Logged Out',
  );
});

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  },
);

export default router;
