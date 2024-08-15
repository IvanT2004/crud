const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createUser() {
  const hashedPassword = await bcrypt.hash('NuevaContraseña123*', 10);
  const newUser = new User({
    name: 'NuevoUsuario',
    email: 'ivantabaresp@gmail.com',
    password: hashedPassword,
  });

  await newUser.save();
  console.log('User created:', newUser);
}

createUser().catch(err => console.error(err));