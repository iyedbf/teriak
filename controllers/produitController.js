const Produit = require('../models/Produit');

// Créer un produit
exports.createProduit = async (req, res) => {
  try {
    const { code, designation, statut } = req.body;
    const createdBy = req.user.id;
    // Vérifier si le code existe déjà
    const existingProduit = await Produit.findOne({ code });
    if (existingProduit) {
      return res.status(400).json({ message: 'Code produit déjà utilisé.' });
    }

    const produit = new Produit({
      code,
      designation,
      statut: statut || 'actif',
    codeFormatParDefaut,
        createdBy,
    });

    await produit.save();
    res.status(201).json({ message: 'Produit créé avec succès.', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister tous les produits
exports.getProduits = async (req, res) => {
  try {
    const produits = await Produit.find()
      .populate('createdBy', 'nom prenom email role')
      .populate('codeFormatParDefaut', 'codeFormat forme marque statut'); // 🔗 poinçon lié

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Lister les produits actifs
exports.getProduits = async (req, res) => {
  try {
    const produits = await Produit.find({ statut: 'actif' }).populate('createdBy', 'nom prenom email role');
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const produit = await Produit.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json({ message: 'Produit mis à jour', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
