const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif'
  },
  role: {
    type: String,
    enum: ['Administrateur', 'Superviseur', 'Agent'],
    default: 'Agent'
  },
  nbErreursLogin: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Ajoute CreateDate et UpdateDate
});

module.exports = mongoose.model('User', userSchema);
