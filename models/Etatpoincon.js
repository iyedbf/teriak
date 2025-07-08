const mongoose = require('mongoose');

const EtatPoinconSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EtatPoincon', EtatPoinconSchema);
