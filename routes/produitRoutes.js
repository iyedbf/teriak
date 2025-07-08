const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Toutes les routes sont protégées par auth middleware
router.use(auth);

// Routes CRUD avec vérification des permissions par rôle
router.post('/', checkPermission('produits', 'create'), produitController.createProduit);
router.get('/', checkPermission('produits', 'read'), produitController.getProduits);
router.get('/:id', checkPermission('produits', 'read'), produitController.getProduitById);
router.put('/:id', checkPermission('produits', 'update'), produitController.updateProduit);
router.delete('/:id', checkPermission('produits', 'delete'), produitController.deleteProduit);

module.exports = router;
