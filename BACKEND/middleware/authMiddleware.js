const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`decided = ${decoded}`);
      req.user = await User.findById(decoded.id).select('-password');
      console.log(`decoded.id = ${decoded.id}`);
      console.log(`req.user = ${req.user}`);
      next();
    } catch(err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if(!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };