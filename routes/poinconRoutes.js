const express = require('express');
const router = express.Router();
const poinconController = require('../controllers/poinconController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.use(auth);

router.post('/', checkPermission('poincons', 'create'), poinconController.createPoincon);
router.get('/', checkPermission('poincons', 'read'), poinconController.getPoincons);
router.get('/:id', checkPermission('poincons', 'read'), poinconController.getPoinconById);
router.put('/:id', checkPermission('poincons', 'update'), poinconController.updatePoincon);
router.delete('/:id', checkPermission('poincons', 'delete'), poinconController.deletePoincon);

module.exports = router;
