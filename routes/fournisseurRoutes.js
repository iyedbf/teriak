const express = require('express');
const router = express.Router();

const fournisseurController = require('../controllers/fournisseurController');
const checkPermission = require('../middleware/checkPermission');
const authMiddleware = require('../middleware/auth');

// Toutes les routes nécessitent d'être connecté
router.use(authMiddleware);

// CRUD fournisseurs (seulement Admin peut créer, modifier, supprimer)
router.post('/', checkPermission('fournisseurs', 'create'), fournisseurController.createFournisseur);
router.get('/', checkPermission('fournisseurs', 'read'), fournisseurController.getFournisseurs);
router.get('/:id', checkPermission('fournisseurs', 'read'), fournisseurController.getFournisseurById);
router.put('/:id', checkPermission('fournisseurs', 'update'), fournisseurController.updateFournisseur);
router.delete('/:id', checkPermission('fournisseurs', 'delete'), fournisseurController.deleteFournisseur);

module.exports = router;
