const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      const err = new Error('No token provided');
      err.status = 401;
      throw err;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    const err = new Error('Acceso denegado. Se requiere rol de administrador');
    err.status = 403;
    return next(err);
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
