const EtatPoincon = require('../models/Etatpoincon');

exports.createEtat = async (req, res) => {
  try {
    const { code, designation, statut } = req.body;

    const existing = await EtatPoincon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Code déjà existant' });

    const etat = new EtatPoincon({
      code,
      designation,
      statut: statut || 'actif',
      createdBy: req.user.id
    });

    await etat.save();
    res.status(201).json({ message: 'État créé avec succès', etat });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getEtats = async (req, res) => {
  try {
    const etats = await EtatPoincon.find().populate('createdBy', 'nom prenom');
    res.status(200).json(etats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateEtat = async (req, res) => {
  try {
    const etat = await EtatPoincon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    res.status(200).json({ message: 'État mis à jour', etat });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteEtat = async (req, res) => {
  try {
    const etat = await EtatPoincon.findByIdAndDelete(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    res.status(200).json({ message: 'État supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
