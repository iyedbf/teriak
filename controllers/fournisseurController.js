const Fournisseur = require('../models/Fournisseur');

// Créer un fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const { code, designation, pays, statut } = req.body;

    // Vérifier unicité du code
    const existing = await Fournisseur.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Code fournisseur déjà utilisé.' });
    }

    const fournisseur = new Fournisseur({
      code,
      designation,
      pays,
      statut: statut || 'actif',
      createdBy: req.user.id
    });

    await fournisseur.save();
    res.status(201).json({ message: 'Fournisseur créé avec succès', fournisseur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les fournisseurs
exports.getFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find();
    res.status(200).json(fournisseurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un fournisseur par ID
exports.getFournisseurById = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findById(req.params.id);
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un fournisseur
exports.updateFournisseur = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const fournisseur = await Fournisseur.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });

    res.status(200).json({ message: 'Fournisseur mis à jour', fournisseur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un fournisseur
exports.deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByIdAndDelete(req.params.id);
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });

    res.status(200).json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
