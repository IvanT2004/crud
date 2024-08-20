const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Método para comparar la contraseña cifrada
UserSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
};

// Método para cifrar la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
