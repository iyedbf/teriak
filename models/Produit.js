const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
  statut: { type: String, default: 'actif' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  codeFormatParDefaut: { type: mongoose.Schema.Types.ObjectId, ref: 'Poincon' }, // 🔗
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Produit', produitSchema);
