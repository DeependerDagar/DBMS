const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware: Ensures the incoming request provides a valid JWT Bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object without returning password hash
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User associated with this token no longer exists'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token verification failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No bearer token provided'
    });
  }
};

/**
 * Admin authorization middleware: Restricts route to users with role = 'admin'
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Administrator privileges required'
    });
  }
};

module.exports = { protect, adminOnly };