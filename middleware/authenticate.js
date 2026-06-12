export function isAuthenticated(req, res, next) {
  if (req.session.user === undefined) {
    return res.status(401).json('You do not have access.');
  }
  next();
}

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
