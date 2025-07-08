const express = require('express');
const router = express.Router();
const marqueController = require('../controllers/marqueController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// CRUD des marques
router.post('/', verifyToken, checkPermission('marques', 'create'), marqueController.createMarque);
router.get('/', verifyToken, checkPermission('marques', 'read'), marqueController.getMarques);
router.get('/:id', verifyToken, checkPermission('marques', 'read'), marqueController.getMarqueById);
router.put('/:id', verifyToken, checkPermission('marques', 'update'), marqueController.updateMarque);
router.delete('/:id', verifyToken, checkPermission('marques', 'delete'), marqueController.deleteMarque);

module.exports = router;
