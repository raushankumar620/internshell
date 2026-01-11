const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided. Access denied.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'Invalid token format. Access denied.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if the token is for admin
    if (!decoded.isAdmin) {
      return res.status(403).json({
        message: 'Admin access required. Forbidden.'
      });
    }

    // Add admin info to request
    req.admin = {
      username: decoded.username,
      isAdmin: decoded.isAdmin
    };

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token. Access denied.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      message: 'Server error in authentication.'
    });
  }
};

module.exports = adminAuth;