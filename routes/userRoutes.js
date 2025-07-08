const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Protéger toutes les routes utilisateurs
router.use(auth);

// CRUD utilisateurs (seulement admin)
router.post('/', checkPermission('users', 'create'), userController.createUser);
router.get('/', checkPermission('users', 'read'), userController.getUsers);
router.get('/:id', checkPermission('users', 'read'), userController.getUserById);
router.put('/:id', checkPermission('users', 'update'), userController.updateUser);
router.delete('/:id', checkPermission('users', 'delete'), userController.deleteUser);

module.exports = router;
