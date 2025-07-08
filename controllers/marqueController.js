const Marque = require('../models/Marque');

// Créer une marque
exports.createMarque = async (req, res) => {
  try {
    const { code, designation, statut } = req.body;

    // Vérifier unicité du code
    const existing = await Marque.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Code marque déjà utilisé.' });
    }

    const marque = new Marque({
      code,
      designation,
      statut: statut || 'actif',
      createdBy: req.user.id
    });

    await marque.save();
    res.status(201).json({ message: 'Marque créée avec succès.', marque });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister toutes les marques
exports.getMarques = async (req, res) => {
  try {
    const marques = await Marque.find().populate('createdBy', 'nom prenom email');
    res.status(200).json(marques);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une marque par ID
exports.getMarqueById = async (req, res) => {
  try {
    const marque = await Marque.findById(req.params.id);
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });
    res.status(200).json(marque);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une marque
exports.updateMarque = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const marque = await Marque.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });

    res.status(200).json({ message: 'Marque mise à jour', marque });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une marque
exports.deleteMarque = async (req, res) => {
  try {
    const marque = await Marque.findByIdAndDelete(req.params.id);
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });

    res.status(200).json({ message: 'Marque supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
