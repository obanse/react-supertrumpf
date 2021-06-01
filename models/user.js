const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  u_email: { type: String, required: true, unique: true },
  u_pass: { type: String, required: true },
  hit_bnr: { type: String },
  hit_mbn: { type: String },
  hit_pass: { type: String },
  isHitUser: { type: Boolean, default: false },
  isEnabled: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
