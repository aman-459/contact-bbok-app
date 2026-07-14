const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please add an email'],
  },
  password: {
    type: String,
    required: [true, 'please add a password'],
    minlength: [6, 'password must be at least 6 characters long'],
  },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);