const Forme = require('../models/Forme');

// Créer une forme
exports.createForme = async (req, res) => {
  try {
    const { code, designation, statut } = req.body;

    const existing = await Forme.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Code forme déjà utilisé.' });
    }

    const forme = new Forme({
      code,
      designation,
      statut: statut || 'actif',
      createdBy: req.user.id
    });

    await forme.save();
    res.status(201).json({ message: 'Forme créée avec succès.', forme });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir toutes les formes
exports.getFormes = async (req, res) => {
  try {
    const formes = await Forme.find().populate('createdBy', 'nom prenom email role');
    res.status(200).json(formes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir une forme par ID
exports.getFormeById = async (req, res) => {
  try {
    const forme = await Forme.findById(req.params.id).populate('createdBy', 'nom prenom email role');
    if (!forme) return res.status(404).json({ message: 'Forme non trouvée.' });
    res.status(200).json(forme);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une forme
exports.updateForme = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    updates.updatedBy = req.user.id;

    const forme = await Forme.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!forme) return res.status(404).json({ message: 'Forme non trouvée.' });

    res.status(200).json({ message: 'Forme mise à jour.', forme });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une forme
exports.deleteForme = async (req, res) => {
  try {
    const forme = await Forme.findByIdAndDelete(req.params.id);
    if (!forme) return res.status(404).json({ message: 'Forme non trouvée.' });
    res.status(200).json({ message: 'Forme supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
