const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // adapte le chemin si besoin
require('dotenv').config();

async function createAdmin() {
await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  const adminUser = new User({
    nom: 'Admin',
    prenom: 'Super',
    login: 'adminlogin',
    email: 'admin@example.com',
    motDePasse: hashedPassword,
    role: 'Administrateur',
    statut: 'actif',
    nbErreursLogin: 0,
  });

  await adminUser.save();
  console.log('Admin créé avec succès');
  process.exit();
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
