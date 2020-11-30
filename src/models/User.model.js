const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  foto: String,
  public_id: String
});

UserSchema.pre('save', function(next) {
  bcrypt.genSalt(10).then(salts => {
    bcrypt.hash(this.password, salts).then(hash => {
      this.password = hash;
      next();
    })
  }).catch(error => next(error))
});

module.exports = mongoose.model('User', UserSchema);