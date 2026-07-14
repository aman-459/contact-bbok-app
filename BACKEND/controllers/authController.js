const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, });

    if(user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: 'Invalid data'});
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).send({ message: 'Invalid email and Password' });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

// module.exports = { registerUser, loginUser };